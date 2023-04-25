import {Component} from "react";
import request from "../../lib/request";
import PageLayout from "../../layouts/PageLayout";
import {Navigator, Text, View} from "@tarojs/components";
import FallbackImage from "../../components/FallbackImage";
import utils from "../../lib/utils";
import PageLoading from "../../components/pageloading";


export default class Index extends Component<any, any> {
    state: any = {
        id: null,
        detail: null,
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
        if (!detail) return <PageLoading/>;

        return (
            <PageLayout statusBarProps={{title: '预约报名'}}>
                <View className={'m-4 bg-white rounded-lg shadow-outer overflow-hidden'}>
                    <FallbackImage src={utils.resolveUrl(detail.preview)} mode={'widthFix'}
                                   className={'block w-full box-border'}/>
                    <View className={'p-4 space-y-4'}>
                        <View className={'text-lg font-bold'}>{detail.title}</View>
                        <View className={'space-x-4 text-sm text-gray-500'}>
                            <Text className={''}>拍卖地点</Text>
                            <Text>{detail.auctionAddress}</Text>
                        </View>
                        <View className={'space-x-4 text-gray-500 text-sm'}>
                            <Text className={''}>拍卖时间</Text>
                            <Text>{detail.auctionTimeRange || detail.startTime}</Text>
                        </View>
                        <View className={'border-t-1 pt-4 border-gray-200'}>
                            <Navigator className={'flex justify-between items-center'}
                                       url={'/pages/performance/detail' + (detail.type == 2 ? '2' : '') + '?id=' + detail.id}>
                                <View className={'title1'}>
                                    <Text>线上同步拍专场</Text>
                                </View>
                                <Text className={'font-bold iconfont icon-youjiantou_huaban text-red-600'}/>
                            </Navigator>
                        </View>
                    </View>
                </View>
            </PageLayout>
        );
    }
}
