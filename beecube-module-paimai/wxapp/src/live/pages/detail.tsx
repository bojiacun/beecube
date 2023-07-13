import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request from "../../lib/request";
import PageLoading from "../../components/pageloading";
import FallbackImage from "../../components/FallbackImage";
import utils from "../../lib/utils";
import {Button, Navigator, Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {connect} from "react-redux";
import './detail.scss';
import NoData from "../../components/nodata";
import MessageType from "../../utils/message-type";
import EventBus from '../../utils/event-bus';
import EventType from '../../utils/event-type';

const numeral = require('numeral');
// @ts-ignore
@connect((state: any) => (
    {
        systemInfo: state.context.systemInfo,
        settings: state.context.settings,
        context: state.context,
        message: state.message,
    }
))
export default class Index extends Component<any, any> {
    state: any = {
        id: null,
        detail: null,
        goodsList: null,
        loadingMore: false,
        noMore: false,
        page: 1,
        posting: false,
        status: undefined,
        message: false,
        deposited: true,
        preOffered: false,
    }

    constructor(props) {
        super(props);
        this.noticeMe = this.noticeMe.bind(this);
        this.onMessageReceived = this.onMessageReceived.bind(this);
    }


    loadData(id, page: number, clear = false) {
        const {settings} = this.props;
        return request.get('/paimai/api/live/room/goods', {params: {roomId: id, pageNo: page}}).then(res => {
            if (clear) {
                let newGoodsList = res.data.result;
                if (!newGoodsList || newGoodsList.length == 0) {
                    this.setState({noMore: true, loadingMore: false, goodsList: []});
                } else {
                    if (parseInt(settings.isDealCommission) == 1) {
                        newGoodsList.forEach(item => {
                            if (parseFloat(item.commission) > 0.00 && item.state == 3) {
                                //落槌价显示佣金
                                const commission = item.commission / 100;
                                item.dealPrice = (item.dealPrice + (item.dealPrice * commission));
                            }
                        })
                    }
                    this.setState({goodsList: newGoodsList, loadingMore: false, noMore: false});
                }
            } else {
                let goodsList = this.state.goodsList || [];
                let newGoodsList = res.data.result;
                if (!newGoodsList || newGoodsList.length == 0) {
                    this.setState({noMore: true, loadingMore: false, goodsList});
                } else {
                    if (parseInt(settings.isDealCommission) == 1) {
                        newGoodsList.forEach(item => {
                            if (parseFloat(item.commission) > 0.00 && item.state == 3) {
                                //落槌价显示佣金
                                const commission = item.commission / 100;
                                item.dealPrice = (item.dealPrice + (item.dealPrice * commission));
                            }
                        })
                    }
                    this.setState({noMore: false, loadingMore: false, goodsList: [...goodsList, ...newGoodsList]});
                }
            }
        });
    }

    onMessageReceived(message) {
        const {goodsList} = this.state;
        if (!goodsList) return;
        switch (message.type) {
            case MessageType.GOODS_UPDATE:
                goodsList?.forEach(g => {
                    if (g.id == message.goodsId) {
                        g.startTime = message.startTime;
                        g.endTime = message.endTime;
                        g.actualEndTime = message.actualEndTime;
                        g.dealPrice = message.dealPrice;
                        g.state = message.state;
                        this.setState({goodsList: goodsList});
                    }
                });
                break;
            case MessageType.ROOM_STATE_CHANGED:
                let state = message.state;
                let roomId = message.roomId;
                let detail = this.state.detail;
                if(roomId == detail.id) {
                    detail.state = state;
                    this.setState({detail: detail});
                }
                break;
        }
    }

    componentDidShow() {
        // if(this.state.id) {
        //     //查询是否需要缴纳保证金
        //     return request.get('/paimai/api/members/deposited/liveroom', {params: {id: this.state.id}}).then(res => {
        //         this.setState({deposited: res.data.result});
        //     });
        // }
    }

    onLoad(options) {
        this.setState({id: options.id});
        request.get('/paimai/api/live/rooms/' + options.id, {params: {id: options.id}}).then(res => {
            let detail = res.data.result;
            this.setState({detail: detail});
            this.loadData(detail.id, 1, true).then();
            //注册全局事件
            EventBus.register(EventType.onMessageData, this.onMessageReceived);
        });
    }

    onShareTimeline() {
        let mid = this.props.context?.userInfo?.id || '';
        return {
            title: this.state.detail?.title,
            query: {mid: mid},
        }
    }

    onShareAppMessage() {
        let mid = this.props.context?.userInfo?.id || '';
        return {
            title: this.state.detail?.title,
            path: '/live/pages/detail?id=' + this.state.id + '&mid=' + mid
        }
    }

    onReachBottom() {
        // this.setState({loadingMore: true, noMore: false});
        // this.loadData(this.state.id, this.state.page + 1, false).then(() => {
        // });
        // this.setState({page: this.state.page + 1});
    }

    onPullDownRefresh() {
        // utils.showLoading();
        // this.loadData(this.state.id, 1, true).then(() => utils.hideLoading());
        // this.setState({page: 1});
    }

    // async payDeposit() {
    //     const {preOffered} = this.state;
    //     if(!preOffered) {
    //         let checkResult = await request.get('/paimai/api/members/check');
    //         if (!checkResult.data.result) {
    //             return utils.showMessage("请完善您的个人信息(手机号、昵称、头像)", function () {
    //                 Taro.navigateTo({url: '/pages/my/profile'}).then();
    //             });
    //         }
    //         this.setState({preOffered: true});
    //     }
    //     this.setState({posting: true});
    //     //支付宝保证金
    //     request.post('/paimai/api/members/deposits/performance', null, {params: {id: this.state.id}}).then(res => {
    //         let data = res.data.result;
    //         data.package = data.packageValue;
    //         Taro.requestPayment(data).then(() => {
    //             //支付已经完成，提醒支付成功并返回上一页面
    //             Taro.showToast({title: '支付成功', duration: 2000}).then(() => {
    //                 let detail = this.state.detail;
    //                 detail.deposited = true;
    //                 this.setState({detail: detail});
    //             });
    //             this.setState({posting: false});
    //         }).catch(() => this.setState({posting: false}));
    //     })
    // }

    noticeMe() {
        let type = 0;
        if (this.state.status == 'notstart') {
            type = 1;
        } else if (this.state.status == 'started') {
            type = 2;
        }
        if (type > 0) {
            request.put('/paimai/api/members/messages/toggle', {type: type, roomId: this.state.detail.id}).then(res => {
                this.setState({message: res.data.result});
            });
        }
    }

    componentWillUnmount() {
        EventBus.unregister(EventType.onMessageData, this.onMessageReceived);
    }


    render() {
        const {detail, goodsList} = this.state;
        const {systemInfo} = this.props;

        if (!detail || goodsList === null) return <PageLoading />;

        let safeBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom;
        if (safeBottom > 10) safeBottom -= 10;
        return (
            <PageLayout statusBarProps={{title: '直播间详情'}} enableReachBottom={true}>
                <View className={'p-4 m-4 bg-white rounded-lg shadow-outer space-y-4'}>
                    <View><FallbackImage src={utils.resolveUrl(detail.preview)} mode={'widthFix'} className={'block w-full box-border'}/></View>
                    <View className={'flex items-center justify-between'}>
                        <View className={'text-sm text-red-600 space-x-1'}>{detail.tags && detail.tags.split(',').map(item => <Text
                            className={'py-1 px-2 border border-1 border-solid border-red-500 rounded'}>{item}</Text>)}</View>
                        {detail.state == 0 && <View className={'text-gray-400 font-bold'}>未开始</View>}
                        {detail.state == 1 && <View className={'text-red-600 font-bold'}>直播中</View>}
                        {detail.state == 2 && <View className={'text-gray-400 font-bold'}>已结束</View>}
                    </View>
                    <View className={'font-bold text-lg'}>{detail.title}</View>
                    <View className={'space-x-4'}>
                        <Text className={'font-bold'}>开始时间</Text>
                        <Text>{detail.startTime}</Text>
                    </View>
                    <View className={'space-x-4'}>
                        <Text className={'font-bold'}>结束时间</Text>
                        <Text>{detail.endTime}</Text>
                    </View>
                    <View className={'space-x-4'}>
                        <Text className={'font-bold'}>主播</Text>
                        <Text>{detail.mainAnchorName}</Text>
                    </View>

                    <View className={'flex items-center pt-4 justify-around text-gray-400 border-t-1 border-gray-200'}>
                        <Text>拍品{goodsList.length}件</Text>
                        <Text>围观{detail.views}人</Text>
                    </View>
                </View>
                <View className={'p-4 mt-4 grid grid-cols-1 gap-4'}>
                    {goodsList.map((item: any) => {
                        return (
                            <Navigator url={'/goods/pages/detail?id=' + item.id}
                                       className={'bg-white flex items-center shadow-outer rounded-lg overflow-hidden'}>
                                <View className={'relative w-28 h-28'}>
                                    <FallbackImage
                                        mode={'aspectFill'}
                                        className={'block w-full h-full'}
                                        src={utils.resolveUrl(item.images.split(',')[0])}
                                    />
                                </View>
                                <View className={'p-2 space-y-4 flex-1'}>
                                    <View className={'text-gray-600 text-lg'}>LOT{item.sortNum} {item.title}</View>
                                    {item.state < 3 &&
                                        <View className={'text-sm'}>
                                            <View className={'space-x-1'}>
                                                估价 <Text className={'text-red-500'}>RMB</Text>
                                                <Text className={'text-base font-bold'}>{item.evaluatePrice}</Text>
                                            </View>
                                            <View>
                                                当前价 <Text className={'text-red-500'}>RMB</Text> <Text
                                                className={'text-base font-bold'}>{numeral(item.currentPrice || item.startPrice).format('0,0.00')}</Text>
                                            </View>
                                        </View>
                                    }
                                    {item.state == 3 &&
                                        <View className={'text-sm'}>
                                            落槌价 <Text className={'text-red-500'}>RMB</Text> <Text
                                            className={'text-base font-bold'}>{numeral(item.dealPrice).format('0,0.00')}</Text>
                                        </View>
                                    }
                                    {item.state == 4 &&
                                        <View className={'text-sm'}>
                                            流拍
                                        </View>
                                    }
                                </View>
                                <View className={'flex items-center justify-center pr-4'}>
                                    {item.state == 1 && <Text className={'text-indigo-600 font-bold'}>进行中</Text>}
                                    {item.state == 0 && <Text className={'text-gray-600'}>未开始</Text>}
                                    {item.state == 2 && <Text className={'text-gray-600'}>已结束</Text>}
                                    {item.state == 3 && <Text className={'text-green-600 font-bold'}>成交</Text>}
                                    {item.state == 4 && <Text className={'text-gray-600'}>流拍</Text>}
                                </View>
                            </Navigator>
                        );
                    })}
                </View>
                {goodsList.length == 0 && <NoData/>}
                {/*{goodsList.length > 0 && <LoadMore noMore={noMore} loading={loadingMore}/>}*/}
                <View style={{height: Taro.pxTransform(124)}}/>
                <View className={'bg-white px-4 pt-1 flex items-center justify-center fixed bottom-0 w-full'}
                      style={{paddingBottom: safeBottom}}>
                    {detail.state == 0 &&
                        <Button disabled={true} className={'btn btn-info w-56'}>
                            <View>直播尚未开始</View>
                        </Button>
                    }
                    {detail.state == 1 &&
                        <Button onClick={() => Taro.navigateTo({url: `/live/pages/room?roomId=${detail.id}`})} className={'btn btn-success w-56'}>
                            <View>直播中，点击观看</View>
                        </Button>
                    }
                    {detail.state == 2 &&
                        <Button onClick={() => Taro.navigateTo({url: `/live/pages/history?id=${detail.id}`})} className={'btn btn-primary w-56'}>
                            <View>直播已结束，观看回放</View>
                        </Button>
                    }
                </View>
            </PageLayout>
        );
    }
}
