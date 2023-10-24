import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request, {APP_ID} from "../../lib/request";
import PageLoading from "../../components/pageloading";
import FallbackImage from "../../components/FallbackImage";
import utils from "../../lib/utils";
import {Button, Navigator, Text, View} from "@tarojs/components";
import TimeCountDowner, {TimeCountDownerStatus} from "../../components/TimeCountDowner";
import LoadMore from "../../components/loadmore";
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
        message: state.message
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
        this.payDeposit = this.payDeposit.bind(this);
        this.noticeMe = this.noticeMe.bind(this);
        this.onMessageReceived = this.onMessageReceived.bind(this);
    }


    loadData(id, page: number, clear = false) {
        const {settings} = this.props;
        return request.get('/paimai/api/goods/list', {params: {performanceId: id, pageNo: page}}).then(res => {
            if (clear) {
                let newGoodsList = res.data.result.records;
                if (!newGoodsList || newGoodsList.length == 0) {
                    this.setState({noMore: true, loadingMore: false, goodsList: []});
                } else {
                    if(parseInt(settings.isDealCommission) == 1) {
                        newGoodsList.forEach(item=>{
                            if(parseFloat(item.commission) > 0.00 && item.state == 3) {
                                //成交价显示佣金
                                const commission = item.commission/100;
                                item.dealPrice = (item.dealPrice + (item.dealPrice * commission));
                            }
                        })
                    }
                    this.setState({goodsList: newGoodsList, loadingMore: false, noMore: false});
                }
            } else {
                let goodsList = this.state.goodsList || [];
                let newGoodsList = res.data.result.records;
                if (!newGoodsList || newGoodsList.length == 0) {
                    this.setState({noMore: true, loadingMore: false, goodsList});
                } else {
                    if(parseInt(settings.isDealCommission) == 1) {
                        newGoodsList.forEach(item=>{
                            if(parseFloat(item.commission) > 0.00 && item.state == 3) {
                                //成交价显示佣金
                                const commission = item.commission/100;
                                item.dealPrice = (item.dealPrice + (item.dealPrice * commission));
                            }
                        })
                    }
                    this.setState({noMore: false, loadingMore: false, goodsList: [...goodsList, ...newGoodsList]});
                }
            }
        });
    }

    componentDidShow() {
        //查询是否需要缴纳保证金
        if (this.state.id) {
            return request.get('/paimai/api/members/deposited/performance', {params: {id: this.state.id}}).then(res => {
                this.setState({deposited: res.data.result});
            });
        }
    }

    onMessageReceived(message) {
        console.log('performance detail received a message', message);
        const {detail, goodsList} = this.state;
        if (detail.id == message.performanceId) {
            switch (message.type) {
                case MessageType.PERFORMANCE_UPDATE:
                    detail.startTime = message.startTime;
                    detail.state = message.state;
                    detail.endTime = message.endTime;
                    break;
            }
            this.setState({detail: detail});
        }
        if (!goodsList) return;
        goodsList?.forEach(g => {
            if (g.id == message.goodsId) {
                switch (message.type) {
                    case MessageType.GOODS_UPDATE:
                        g.startTime = message.startTime;
                        g.endTime = message.endTime;
                        g.actualEndTime = message.actualEndTime;
                        g.state = message.state;
                        g.dealPrice = message.dealPrice;
                        break;
                }
                this.setState({goodsList: goodsList});
            }
        });
    }

    onLoad(options) {
        this.setState({id: options.id});
        request.get('/paimai/api/performances/detail', {params: {id: options.id}}).then(res => {
            let detail = res.data.result;
            this.setState({detail: detail});
            this.loadData(detail.id, 1, true).then();
            //注册全局事件
            EventBus.register(EventType.onMessageData, this.onMessageReceived);
        });
        request.get('/api/app/'+APP_ID).then(res=>{
            let app = res.data.result;
            if(app.userCenterLayout == 1) {
                Taro.redirectTo({url: 'detail2?id='+options.id}).then();
            }
            this.setState({app});
        })
    }

    onReachBottom() {
        this.setState({loadingMore: true, noMore: false});
        this.loadData(this.state.id, this.state.page + 1, false).then(() => {
        });
        this.setState({page: this.state.page + 1});
    }

    onPullDownRefresh() {
        utils.showLoading();
        this.loadData(this.state.id, 1, true).then(() => utils.hideLoading());
        this.setState({page: 1});
    }
    postIntegral() {
        request.post('/app/api/members/scores/share').then(()=>{});
    }
    onShareTimeline() {
        let mid = this.props.context?.userInfo?.id || '';
        this.postIntegral();
        return {
            title: this.state.detail?.title,
            query: {mid: mid},
        }
    }

    onShareAppMessage() {
        let mid = this.props.context?.userInfo?.id || '';
        this.postIntegral();
        return {
            title: this.state.detail?.title,
            path: '/performance/pages/detail?id=' + this.state.id +'&mid='+mid
        }
    }
    async payDeposit() {
        const {preOffered} = this.state;
        if(!preOffered) {
            let checkResult = await request.get('/paimai/api/members/check');
            if (checkResult.data.result == 0) {
                return utils.showMessage("请完善您的个人信息(手机号、昵称、头像)", function () {
                    Taro.navigateTo({url: '/pages/my/profile'}).then();
                });
            }
            else if(checkResult.data.result == -1) {
                return utils.showMessage("请完成实名认证", function () {
                    Taro.navigateTo({url: '/pages/my/realauth'}).then();
                });
            }
            this.setState({preOffered: true});
        }
        this.setState({posting: true});
        //支付宝保证金
        request.post('/paimai/api/members/deposits/performance', null, {params: {id: this.state.id}}).then(res => {
            let data = res.data.result;
            data.package = data.packageValue;
            Taro.requestPayment(data).then(() => {
                //支付已经完成，提醒支付成功并返回上一页面
                Taro.showToast({title: '支付成功', duration: 2000}).then(() => {
                    let detail = this.state.detail;
                    detail.deposited = true;
                    this.setState({detail: detail});
                });
                this.setState({posting: false});
            }).catch(() => this.setState({posting: false}));
        })
    }

    componentDidUpdate(_prevProps: Readonly<any>, prevState: Readonly<any>) {
        const {detail, status} = this.state;
        if (!detail) return;
        if (prevState.status != status && status != TimeCountDownerStatus.ENDED) {
            request.get('/paimai/api/members/messaged', {
                params: {
                    type: status == TimeCountDownerStatus.NOT_START ? 1 : 2,
                    performanceId: detail.id
                }
            }).then(res => {
                this.setState({message: res.data.result});
            });
        }
    }

    async noticeMe() {
        const {message, status} = this.state;
        const {settings} = this.props;

        let templateId,type;

        if(status == TimeCountDownerStatus.NOT_START) {
            //开始提醒
            type = 1;
            templateId = settings.startTemplateId;
        }
        else if(status == TimeCountDownerStatus.STARTED) {
            type = 2;
            templateId = settings.endTemplateId;
        }

        if(!message && templateId) {
            const res = await Taro.requestSubscribeMessage({tmplIds: [templateId]});
            if(res[templateId] == 'accept' || res[templateId] == 'acceptWithAudio') {
                if(type) {
                    request.put('/paimai/api/members/messages/toggle', {
                        type: type,
                        performanceId: this.state.detail.id,
                        templateId: templateId,
                    }).then(res => {
                        this.setState({message: res.data.result});
                    });
                }
            }
        }
        else {
            if(type) {
                request.put('/paimai/api/members/messages/toggle', {
                    type: type,
                    performanceId: this.state.detail.id,
                    templateId: templateId,
                }).then(res => {
                    this.setState({message: res.data.result});
                });
            }
        }
    }



    componentWillUnmount() {
        EventBus.unregister(EventType.onMessageData, this.onMessageReceived);
    }


    render() {
        const {detail, goodsList, noMore, loadingMore, message, deposited, app} = this.state;
        const {systemInfo} = this.props;

        if (!detail || goodsList === null || !app) return <PageLoading />;
        let safeBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom;
        if (safeBottom > 10) safeBottom -= 10;

        return (
            <PageLayout statusBarProps={{title: '限时拍专场详情'}} style={{backgroundColor: 'white', minHeight: '100vh'}} enableReachBottom={true}>
                <FallbackImage mode={'widthFix'} src={utils.resolveUrl(detail.preview)} className={'block w-full'}/>
                <View className={'px-4 py-2'} style={{backgroundColor: '#f8f8f8'}}>
                    <TimeCountDowner
                        onStatusChanged={(status) => {
                            this.setState({status: status});
                        }}
                        className={'flex'}
                        startTime={detail.startTime}
                        endTime={detail.endTime}
                    />
                </View>
                <View className={'divide-y divide-gray-100 bg-white'}>
                    <View className={'p-4 flex items-center justify-between'}>
                        <View className={'flex-1 space-y-1'}>
                            <View className={'text-xl font-bold'}>{detail.title}</View>
                            <View className={'text-gray-600'}>{detail.subTitle}</View>
                            <View className={'text-gray-600'}>开拍时间: {detail.startTime}</View>
                            <View className={'text-gray-600'}>结束时间: {detail.endTime}</View>
                            <View className={'text-gray-600'}>固定保证金: {numeral(detail.deposit).format('0,0.00')}</View>
                        </View>
                        {(this.state.status == TimeCountDownerStatus.NOT_START || this.state.status == TimeCountDownerStatus.STARTED) &&
                            <View className={'w-20'}>
                                {!message &&
                                    <View className={'flex flex-col items-center text-gray-600'} onClick={this.noticeMe}>
                                        <View><Text className={'iconfont icon-daojishi text-3xl'}/></View>
                                        <View
                                            className={'text-sm'}>{this.state.status == TimeCountDownerStatus.NOT_START ? '开始' : '结束'}提醒</View>
                                    </View>
                                }
                                {message &&
                                    <View className={'flex flex-col items-center text-red-600'} onClick={this.noticeMe}>
                                        <View><Text className={'iconfont icon-daojishi text-3xl'}/></View>
                                        <View className={'text-sm'}>取消提醒</View>
                                    </View>
                                }
                            </View>
                        }
                    </View>
                    <View className={'space-x-4 px-4 py-2 text-gray-400'}>
                        <Text>拍品{detail.goodsCount}件</Text>
                        <Text>围观{detail.viewCount}人</Text>
                        <Text>报名{detail.depositCount}人</Text>
                        <Text>出价{detail.offerCount}次</Text>
                    </View>
                    <View></View>
                </View>
                <View className={'p-4 mt-4 grid grid-cols-2 gap-4 bg-white'}>
                    {goodsList.map((item: any) => {
                        let radius = 0;
                        return (
                            <View className={'bg-white shadow-outer overflow-hidden'} style={{borderRadius: Taro.pxTransform(radius)}}>
                                <Navigator url={'/goods/pages/detail?id=' + item.id}>
                                    <View className={'relative'} style={{width: '100%', paddingTop: '100%'}}>
                                        <FallbackImage mode={'aspectFill'} style={{borderRadius: Taro.pxTransform(radius)}}
                                                       className={'absolute z-0 inset-0 block w-full h-full'}
                                                       src={utils.resolveUrl(item.images.split(',')[0])}/>
                                    </View>
                                    <View className={'p-2 space-y-0.5'}>
                                        <View className={'text-gray-600'}>{item.title}</View>
                                        {item.state < 3 &&
                                            <View className={'text-sm'}>
                                                当前价 <Text className={'text-red-500'}>RMB</Text> <Text
                                                className={'text-base'}>{numeral(item.currentPrice || item.startPrice).format('0,0.00')}</Text>
                                            </View>
                                        }
                                        {item.state == 3 &&
                                            <View className={'text-sm'}>
                                                <Text className={'text-green-600 font-bold'}>成交</Text> 成交价 <Text
                                                className={'text-red-500'}>RMB</Text> <Text
                                                className={'text-base'}>{numeral(item.dealPrice).format('0,0.00')}</Text>
                                            </View>
                                        }
                                        {item.state == 4 &&
                                            <View className={'text-gray-400'}>流拍</View>
                                        }
                                        {item.state < 3 &&
                                            <TimeCountDowner
                                                className={'text-gray-400 text-xs flex'}
                                                startTime={item.startTime}
                                                endTime={item.endTime}
                                            />
                                        }
                                    </View>
                                </Navigator>
                            </View>
                        );
                    })}
                </View>
                {goodsList.length == 0 && <NoData/>}
                {goodsList.length > 0 && <LoadMore noMore={noMore} loading={loadingMore}/>}
                <View style={{height: Taro.pxTransform(124)}}/>
                {!deposited && detail.state < 2 && this.state.status != TimeCountDownerStatus.ENDED &&
                    <View className={'bg-white px-4 pt-1 flex items-center justify-center fixed bottom-0 w-full'}
                          style={{paddingBottom: safeBottom}}>
                        <View>
                            <Button disabled={this.state.posting} className={'btn btn-primary w-56'} onClick={this.payDeposit}>
                                <View>交保证金</View>
                                <View>RMB {numeral(detail.deposit).format('0,0.00')}</View>
                            </Button>
                        </View>
                    </View>
                }
            </PageLayout>
        );
    }
}
