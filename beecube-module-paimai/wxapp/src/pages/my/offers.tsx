import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request from "../../lib/request";
import utils from "../../lib/utils";
import {View, Navigator} from "@tarojs/components";
import Taro from "@tarojs/taro";
import NoData from "../../components/nodata";
import LoadMore from "../../components/loadmore";
import FallbackImage from "../../components/FallbackImage";

const numeral = require('numeral');

export default class Index extends Component<any, any> {
    state: any = {
        page: 1,
        list: [],
        loadingMore: false,
        noMore: false,
    }

    componentDidMount() {
    }

    loadData(page, clear = false) {
        return request.get('/paimai/api/members/offers', {params: {pageNo: page, column: 'createTime', order: 'desc'}}).then(res => {
            if (clear) {
                this.setState({list: res.data.result.records, loadingMore: false, noMore: false});
            } else {
                let list = this.state.list;
                let newList = res.data.result.records;
                if (!newList || newList.length == 0) {
                    this.setState({noMore: true, loadingMore: false});
                } else {
                    this.setState({noMore: false, loadingMore: false, list: [...list, ...newList]});
                }
            }
        });
    }

    onLoad() {
        utils.showLoading();
        this.loadData(1, true).then(() => utils.hideLoading());
    }

    onReachBottom() {
        this.setState({loadingMore: true, noMore: false});
        this.loadData(this.state.page + 1, false).then(() => {
        });
        this.setState({page: this.state.page + 1});
    }

    onPullDownRefresh() {
        utils.showLoading();
        this.loadData(1, true).then(() => utils.hideLoading());
        this.setState({page: 1});
    }

    render() {
        const {list, noMore, loadingMore} = this.state;
        return (
            <PageLayout statusBarProps={{title: '参拍记录'}} enableReachBottom={true}>
                {list.length == 0 && <NoData/>}
                <View className={'grid grid-cols-1 gap-4 p-4'}>
                    {list.map((item) => {
                        let radius = 0;
                        return (
                            <Navigator url={`/pages/goods/detail?id=${item.goodsId}`} className={'flex bg-white rounded-lg shadow-lg p-4 space-x-4'}
                                       style={{borderRadius: Taro.pxTransform(radius)}}>
                                <View className={'w-20 h-20'}>
                                    <FallbackImage className={'w-full h-full'} mode={'aspectFill'} src={item.goods.listCover ? item.goods.listCover: item.goods.images.split(',')[0]} />
                                </View>
                                <View className={'flex-1 flex flex-col'}>
                                    <View className={'text-lg font-bold flex-1'}>{item.goodsName}</View>
                                    <View className={'text-gray-400 text-sm'}>
                                        出价时间：{item.offerTime}
                                    </View>
                                </View>
                                <View className={'flex flex-col items-center justify-center space-y-1'}>
                                    {item.status == 0 &&
                                        <View className={'font-bold text-lg'}>
                                            {item.price == item.goodsMaxOfferPrice && <View className={'text-indigo-500'}>领先</View>}
                                            {item.price < item.goodsMaxOfferPrice && <View className={'text-gray-400'}>出局</View>}
                                        </View>
                                    }
                                    {item.status == 1 &&
                                        <View className={'font-bold text-lg'}>
                                            <View className={'text-green-600'}>成交</View>
                                        </View>
                                    }
                                    {item.status == 2 &&
                                        <View className={'font-bold text-lg'}>
                                            <View className={'text-green-600'}>流拍</View>
                                        </View>
                                    }
                                    <View>￥{numeral(item.price).format('0,0.00')} </View>
                                </View>
                            </Navigator>
                        );
                    })}
                </View>
                {list.length > 0 && <LoadMore noMore={noMore} loading={loadingMore}/>}
            </PageLayout>
        );
    }
}
