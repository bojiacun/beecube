import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request from "../../lib/request";
import PageLoading from "../../components/pageloading";
import FallbackImage from "../../components/FallbackImage";
import utils from "../../lib/utils";
import {Navigator, Text, View} from "@tarojs/components";
import TimeCountDowner from "../../components/TimeCountDowner";
import LoadMore from "../../components/loadmore";
import Taro from "@tarojs/taro";

const numeral = require('numeral');

export default class Index extends Component<any, any> {
    state: any = {
        id: null,
        detail: null,
        goodsList: [],
        loadingMore: false,
        noMore: false,
        page: 1,
    }

    loadData(id, page:number, clear = false) {
        return request.get('/paimai/api/goods/list', {params: {performance_id: id, pageNo: page}}).then(res=>{
            if(clear) {
                this.setState({goodsList: res.data.result.records, loadingMore: false, noMore: false});
            }
            else {
                let goodsList = this.state.goodsList;
                let newGoodsList = res.data.result.records;
                if(!newGoodsList || newGoodsList.length == 0) {
                    this.setState({noMore: true, loadingMore: false});
                }
                else {
                    this.setState({noMore: false, loadingMore:false, goodsList: [...goodsList, ...newGoodsList]});
                }
            }
        });
    }

    onLoad(options) {
        this.setState({id: options.id});
        request.get('/paimai/api/performances/detail', {params: {id: options.id}}).then(res => {
            let detail = res.data.result;
            this.setState({detail: detail});
            return this.loadData(detail.id, 1, true);
        })
    }

    onReachBottom() {
        this.setState({loadingMore: true, noMore: false});
        this.loadData(this.state.id, this.state.page+1,false).then(()=>{});
        this.setState({page: this.state.page+1});
    }

    onPullDownRefresh() {
        utils.showLoading();
        this.loadData(this.state.id, 1,true).then(()=>utils.hideLoading());
        this.setState({page: 1});
    }


    componentWillUnmount() {

    }


    render() {
        const {detail, goodsList, noMore, loadingMore} = this.state;
        if (!detail) return <PageLoading/>

        return (
            <PageLayout statusBarProps={{title: '专场详情'}}>
                <FallbackImage mode={'widthFix'} src={utils.resolveUrl(detail.preview)} className={'block w-full'}/>
                <View className={'px-4 py-2'}>
                    <TimeCountDowner className={'flex'} endTime={new Date(detail.endTime)} startTime={new Date(detail.startTime)}/>
                </View>
                <View className={'divide-y divide-gray-100 bg-white'}>
                    <View className={'p-4 flex items-center justify-between'}>
                        <View className={'space-y-1'}>
                            <View className={'text-xl font-bold'}>{detail.title}</View>
                            <View className={'text-gray-600'}>{detail.subTitle}</View>
                            <View className={'text-gray-600'}>开拍时间: {detail.startTime}</View>
                            <View className={'text-gray-600'}>结束时间: {detail.endTime}</View>
                            <View className={'text-gray-600'}>固定保证金: {numeral(detail.deposit).format('0,0.00')}</View>
                        </View>
                        <View>
                            <View className={'flex flex-col items-center text-gray-600'}>
                                <View><Text className={'iconfont icon-daojishi text-3xl'}/></View>
                                <View className={'text-sm'}>结束提醒</View>
                            </View>
                        </View>
                    </View>
                    <View className={'space-x-4 px-4 py-2 text-gray-400'}>
                        <Text>拍品{detail.goodsCount}件</Text>
                        <Text>围观{detail.viewCount}人</Text>
                        <Text>报名{detail.depositCount}人</Text>
                        <Text>出价{detail.offerCount}件</Text>
                    </View>
                    <View className={'grid grid-cols-2 gap-4 bg-transparent'}>
                        {goodsList.map((item:any)=>{
                            let radius = 0;
                            return (
                                <View className={'bg-white overflow-hidden'} style={{borderRadius: Taro.pxTransform(radius)}}>
                                    <Navigator url={'/pages/goods/detail?id='+item.id}>
                                        <View className={'relative'} style={{width: '100%', paddingTop: '130%'}}>
                                            <FallbackImage mode={'aspectFill'} style={{borderRadius: Taro.pxTransform(radius)}} className={'absolute z-0 inset-0 block w-full h-full'} src={utils.resolveUrl(item.images.split(',')[0])}/>
                                        </View>
                                        <View className={'px-2 mt-2'}>{item.title}</View>
                                        <View className={'px-2 mb-2 text-sm'}>
                                            当前价 <Text className={'text-red-500'}>RMB</Text> <Text className={'text-red-500 text-lg'}>{numeral(item.currentPrice).format('0,0.00')}</Text>
                                        </View>
                                        <TimeCountDowner className={'text-gray-200 text-sm'} endTime={new Date(item.actualEndTime||item.endTime)} />
                                    </Navigator>
                                </View>
                            );
                        })}
                        <LoadMore noMore={noMore} loading={loadingMore} />
                    </View>
                </View>
            </PageLayout>
        );
    }
}
