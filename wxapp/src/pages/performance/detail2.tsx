import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request from "../../lib/request";
import PageLoading from "../../components/pageloading";
import FallbackImage from "../../components/FallbackImage";
import utils from "../../lib/utils";
import {Button, Navigator, Text, View} from "@tarojs/components";
import LoadMore from "../../components/loadmore";
import Taro from "@tarojs/taro";
import LoginView from "../../components/login";
import {connect} from "react-redux";
import './detail.scss';
import NoData from "../../components/nodata";

const numeral = require('numeral');
// @ts-ignore
@connect((state: any) => (
    {
        systemInfo: state.context.systemInfo,
        settings: state.context.settings,
        context: state.context
    }
))
export default class Index extends Component<any, any> {
    state: any = {
        id: null,
        detail: null,
        goodsList: [],
        loadingMore: false,
        noMore: false,
        page: 1,
        posting: false,
        status: undefined,
        message: false,
        deposited: true,
    }

    constructor(props) {
        super(props);
        this.payDeposit = this.payDeposit.bind(this);
        this.noticeMe = this.noticeMe.bind(this);
    }


    loadData(id, page: number, clear = false) {
        return request.get('/paimai/api/goods/list', {params: {performanceId: id, pageNo: page}}).then(res => {
            if (clear) {
                let newGoodsList = res.data.result.records;
                if (!newGoodsList || newGoodsList.length == 0) {
                    this.setState({noMore: true, loadingMore: false});
                } else {
                    this.setState({goodsList: newGoodsList, loadingMore: false, noMore: false});
                }
            } else {
                let goodsList = this.state.goodsList;
                let newGoodsList = res.data.result.records;
                if (!newGoodsList || newGoodsList.length == 0) {
                    this.setState({noMore: true, loadingMore: false});
                } else {
                    this.setState({noMore: false, loadingMore: false, goodsList: [...goodsList, ...newGoodsList]});
                }
            }
        });
    }

    onLoad(options) {
        this.setState({id: options.id});
        request.get('/paimai/api/performances/detail', {params: {id: options.id}}).then(res => {
            let detail = res.data.result;
            this.setState({detail: detail});
            this.loadData(detail.id, 1, true);

        });
        //查询是否需要缴纳保证金
        return request.get('/paimai/api/members/deposited/performance', {params: {id: options.id}}).then(res => {
            this.setState({deposited: res.data.result});
        });
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

    payDeposit() {
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
        let type = 0;
        if (prevState.status == '') {
            if (this.state.status == 'notstart') {
                type = 1;
            } else if (this.state.status == 'started') {
                type = 2;
            }
            if (type > 0 && this.state.detail) {
                request.get('/paimai/api/members/messaged', {params: {type: type, performanceId: this.state.detail.id}}).then(res => {
                    this.setState({message: res.data.result});
                })
            }
        }
    }

    noticeMe() {
        let type = 0;
        if (this.state.status == 'notstart') {
            type = 1;
        } else if (this.state.status == 'started') {
            type = 2;
        }
        if (type > 0) {
            request.put('/paimai/api/members/messages/toggle', {type: type, performanceId: this.state.detail.id}).then(res => {
                this.setState({message: res.data.result});
            });
        }
    }

    componentWillUnmount() {

    }


    render() {
        const {detail, goodsList, noMore, loadingMore, deposited} = this.state;
        const {systemInfo} = this.props;


        if (!detail) return <PageLoading/>
        let safeBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom;
        if (safeBottom > 10) safeBottom -= 10;


        return (
            <PageLayout statusBarProps={{title: '同步拍专场详情'}} enableReachBottom={true}>
                <View className={'p-4 m-4 bg-white rounded-lg shadow-outer space-y-4'}>
                    <View className={'text-sm text-indigo-600 space-x-1'}>{detail.tags && detail.tags.split(',').map(item => <Text
                        className={'py-1 px-2 border border-1 border-solid border-indigo-500'}>{item}</Text>)}</View>
                    <View className={'font-bold text-lg'}>{detail.title}</View>
                    <View className={'space-x-4'}>
                        <Text className={'font-bold'}>拍卖地点</Text>
                        <Text>{detail.performanceAddress}</Text>
                    </View>
                    <View className={'space-x-4'}>
                        <Text className={'font-bold'}>拍卖时间</Text>
                        <Text>{detail.startTime}</Text>
                    </View>
                    <View className={'flex items-center pt-4 justify-around text-gray-400 border-t-1 border-gray-200'}>
                        <Text>拍品{detail.goodsCount}件</Text>
                        <Text>围观{detail.viewCount}人</Text>
                        <Text>报名{detail.depositCount}人</Text>
                        <Text>出价{detail.offerCount}次</Text>
                    </View>
                </View>
                <View className={'p-4 mt-4 grid grid-cols-1 gap-4'}>
                    {goodsList.map((item: any) => {
                        return (
                            <Navigator url={'/pages/goods/detail?id=' + item.id} className={'bg-white flex items-center shadow-outer rounded-lg overflow-hidden'}>
                                <View className={'relative w-28 h-28'}>
                                    <FallbackImage
                                        mode={'aspectFill'}
                                        className={'block w-full h-full'}
                                        src={utils.resolveUrl(item.images.split(',')[0])}
                                    />
                                </View>
                                <View className={'p-2 space-y-4 flex-1'}>
                                    <View className={'text-gray-600 text-lg'}>LOT{item.sortNum} {item.title}</View>
                                    <View className={'text-sm'}>
                                        当前价 <Text className={'text-red-500'}>RMB</Text> <Text
                                        className={'text-base'}>{numeral(item.currentPrice || item.startPrice).format('0,0.00')}</Text>
                                    </View>
                                </View>
                                <View className={'flex items-center justify-center pr-4'}>
                                    {item.started == 1 && item.ended == 0 && <Text className={'text-indigo-600 font-bold'}>进行中</Text>}
                                    {item.started == 0 && <Text className={'text-gray-600'}>未开始</Text>}
                                    {item.ended == 1 && <Text className={'text-gray-600'}>已结束</Text>}
                                </View>
                            </Navigator>
                        );
                    })}
                </View>
                {goodsList.length == 0 && <NoData/>}
                {goodsList.length > 0 && <LoadMore noMore={noMore} loading={loadingMore}/>}
                <View style={{height: Taro.pxTransform(124)}}/>
                {!deposited &&
                    <LoginView>
                        <View className={'bg-white px-4 pt-1 flex items-center justify-center fixed bottom-0 w-full'}
                              style={{paddingBottom: safeBottom}}>
                            <View>
                                <Button disabled={this.state.posting} className={'btn btn-primary w-56'} onClick={this.payDeposit}>
                                    <View>交保证金</View>
                                    <View>RMB {numeral(detail.deposit).format('0,0.00')}</View>
                                </Button>
                            </View>
                        </View>
                    </LoginView>
                }
            </PageLayout>
        );
    }
}
