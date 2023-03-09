import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request from "../../lib/request";
import PageLoading from "../../components/pageloading";
import FallbackImage from "../../components/FallbackImage";
import utils from "../../lib/utils";
import {Button, Navigator, Text, View} from "@tarojs/components";
import TimeCountDowner, {TimeCountDownerMode, TimeCountDownerStatus} from "../../components/TimeCountDowner";
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
        if(prevState.status == '') {
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
        if(type > 0) {
            request.put('/paimai/api/members/messages/toggle', {type: type, performanceId: this.state.detail.id}).then(res => {
                this.setState({message: res.data.result});
            });
        }
    }

    componentWillUnmount() {

    }


    render() {
        const {detail, goodsList, noMore, loadingMore, message, deposited} = this.state;
        const {systemInfo} = this.props;


        if (!detail) return <PageLoading/>
        let safeBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom;
        if (safeBottom > 10) safeBottom -= 10;


        return (
            <PageLayout statusBarProps={{title: '专场详情'}} style={{backgroundColor: 'white', minHeight: '100vh'}} enableReachBottom={true}>
                <FallbackImage mode={'widthFix'} src={utils.resolveUrl(detail.preview)} className={'block w-full'}/>
                {detail.started == 0 && detail.startTime != null &&
                    <View className={'px-4 py-2'} style={{backgroundColor: '#f8f8f8'}}>
                        <TimeCountDowner
                            mode={detail.type == 1 ? TimeCountDownerMode.TimeBase : TimeCountDownerMode.Manual}
                            onStatusChanged={(status) => {
                                this.setState({status: status});
                            }}
                            className={'flex'}
                            startTime={new Date(detail.startTime)}
                            started={detail.started == 1}
                            ended={detail.ended == 1}
                        />
                    </View>
                }
                <View className={'divide-y divide-gray-100 bg-white'}>
                    <View className={'p-4 flex items-center justify-between'}>
                        <View className={'flex-1 space-y-1'}>
                            <View className={'text-xl font-bold'}>{detail.title}</View>
                            <View className={'text-gray-600'}>{detail.subTitle}</View>
                            <View className={'text-gray-600'}>开拍时间: {detail.startTime}</View>
                            <View className={'text-gray-600'}>结束时间: {detail.endTime}</View>
                            <View className={'text-gray-600'}>固定保证金: {numeral(detail.deposit).format('0,0.00')}</View>
                        </View>
                        <View className={'w-20'}>
                            {this.state.status != 'ended' && this.state.status != '' &&
                                <LoginView>
                                    {!message &&
                                        <View className={'flex flex-col items-center text-gray-600'} onClick={this.noticeMe}>
                                            <View><Text className={'iconfont icon-daojishi text-3xl'}/></View>
                                            <View className={'text-sm'}>{this.state.status == TimeCountDownerStatus.NOT_START ? '开始' : '结束'}提醒</View>
                                        </View>
                                    }
                                    {message &&
                                        <View className={'flex flex-col items-center text-red-600'} onClick={this.noticeMe}>
                                            <View><Text className={'iconfont icon-daojishi text-3xl'}/></View>
                                            <View className={'text-sm'}>取消提醒</View>
                                        </View>
                                    }
                                </LoginView>
                            }
                        </View>
                    </View>
                    <View className={'space-x-4 px-4 py-2 text-gray-400'}>
                        <Text>拍品{detail.goodsCount}件</Text>
                        <Text>围观{detail.viewCount}人</Text>
                        <Text>报名{detail.depositCount}人</Text>
                        <Text>出价{detail.offerCount}件</Text>
                    </View>
                    <View></View>
                </View>
                <View className={'p-4 mt-4 grid grid-cols-2 gap-4 bg-white'}>
                    {goodsList.map((item: any) => {
                        let radius = 0;
                        return (
                            <View className={'bg-white shadow-outer overflow-hidden'} style={{borderRadius: Taro.pxTransform(radius)}}>
                                <Navigator url={'/pages/goods/detail?id=' + item.id}>
                                    <View className={'relative'} style={{width: '100%', paddingTop: '130%'}}>
                                        <FallbackImage mode={'aspectFill'} style={{borderRadius: Taro.pxTransform(radius)}}
                                                       className={'absolute z-0 inset-0 block w-full h-full'}
                                                       src={utils.resolveUrl(item.images.split(',')[0])}/>
                                    </View>
                                    <View className={'p-2 space-y-0.5'}>
                                        <View className={'text-gray-600'}>{item.title}</View>
                                        <View className={'text-sm'}>
                                            当前价 <Text className={'text-red-500'}>RMB</Text> <Text
                                            className={'text-base'}>{numeral(item.currentPrice || item.startPrice).format('0,0.00')}</Text>
                                        </View>
                                        <TimeCountDowner
                                            mode={detail.type == 1 ? TimeCountDownerMode.TimeBase : TimeCountDownerMode.Manual}
                                            className={'text-gray-400 text-xs flex'}
                                            startTime={new Date(detail.startTime)}
                                            started={detail.started}
                                            ended={detail.ended}
                                        />
                                    </View>
                                </Navigator>
                            </View>
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
