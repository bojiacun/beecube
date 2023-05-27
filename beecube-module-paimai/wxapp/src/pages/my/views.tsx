import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request from "../../lib/request";
import utils from "../../lib/utils";
import {Navigator, Text, View} from "@tarojs/components";
import FallbackImage from "../../components/FallbackImage";
import Taro from "@tarojs/taro";
import NoData from "../../components/nodata";
import LoadMore from "../../components/loadmore";

const numeral = require('numeral');

export default class Index extends Component<any, any> {
    state: any = {
        page: 1,
        list: [],
        id: '',
        loadingMore: false,
        noMore: false,
    }

    componentDidMount() {
    }

    loadData(id, page, clear = false) {
        return request.get('/paimai/api/members/views', {params: {id: id, pageNo: page, column: 'createTime', order: 'desc'}}).then(res => {
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

    onLoad(options) {
        utils.showLoading();
        this.setState({id: options.id});
        this.loadData(options.id, 1, true).then(() => utils.hideLoading());
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

    render() {
        const {list, noMore, loadingMore} = this.state;
        return (
            <PageLayout statusBarProps={{title: '我的足迹'}} enableReachBottom={true}>
                {list.length == 0 && <NoData/>}
                <View className={'grid grid-cols-2 gap-4 p-4'}>
                    {list.map((item) => {
                        let radius = 8;
                        return (
                            <View className={'bg-white relative overflow-hidden'} style={{borderRadius: Taro.pxTransform(radius)}}>
                                <Navigator url={(item.type == 1 ? '/goods/pages/detail?id=' : '/goods/pages/detail2?id=') + item.id}>
                                    <View className={'relative'} style={{width: '100%', paddingTop: '100%'}}>
                                        <FallbackImage mode={'aspectFill'} className={'absolute z-0 inset-0 block w-full h-full'}
                                                       src={utils.resolveUrl(item.images.split(',')[0])}/>
                                    </View>
                                    <View className={'px-2 mt-2'}>{item.title}</View>
                                    <View className={'px-2 mb-2 text-sm'}>
                                        当前价 <Text className={'text-red-500'}>RMB</Text> <Text
                                        className={'text-red-500 text-lg'}>{numeral(item.currentPrice || item.startPrice).format('0,0.00')}</Text>
                                    </View>
                                </Navigator>
                            </View>
                        );
                    })}
                </View>
                {list.length > 0 && <LoadMore noMore={noMore} loading={loadingMore}/>}
            </PageLayout>
        );
    }
}
