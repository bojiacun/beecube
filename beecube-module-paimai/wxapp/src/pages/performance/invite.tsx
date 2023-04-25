import {Component} from "react";
import request from "../../lib/request";
import PageLayout from "../../layouts/PageLayout";
import {Text, View} from "@tarojs/components";
import FallbackImage from "../../components/FallbackImage";
import utils from "../../lib/utils";


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
        preOffered: false,
    }
    onLoad(options) {
        this.setState({id: options.id});
        request.get('/paimai/api/performances/detail', {params: {id: options.id}}).then(res => {
            let detail = res.data.result;
            this.setState({detail: detail});
        });
    }

    render() {
        const {detail} = this.state;

        return (
            <PageLayout statusBarProps={{title: '预约报名'}}>
                <View className={'p-4 m-4 bg-white rounded-lg shadow-outer space-y-4'}>
                    <View><FallbackImage src={utils.resolveUrl(detail.preview)} mode={'widthFix'} className={'block w-full box-border'} /></View>
                    <View className={'flex items-center justify-between'}>
                        <View className={'text-sm text-red-600 space-x-1'}>{detail.tags && detail.tags.split(',').map(item => <Text
                            className={'py-1 px-2 border border-1 border-solid border-red-500 rounded'}>{item}</Text>)}</View>
                        {detail.state == 0 && <View className={'text-gray-400 font-bold'}>未开始</View>}
                        {detail.state == 1 && <View className={'text-red-600 font-bold'}>进行中</View>}
                        {detail.state == 2 && <View className={'text-gray-400 font-bold'}>已结束</View>}
                    </View>
                    <View className={'font-bold text-lg'}>{detail.title}</View>
                    <View className={'space-x-4'}>
                        <Text className={'font-bold'}>拍卖地点</Text>
                        <Text>{detail.auctionAddress}</Text>
                    </View>
                    <View className={'space-x-4'}>
                        <Text className={'font-bold'}>拍卖时间</Text>
                        <Text>{detail.auctionTimeRange || detail.startTime}</Text>
                    </View>
                </View>
            </PageLayout>
        );
    }
}
