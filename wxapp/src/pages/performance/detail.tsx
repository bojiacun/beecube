import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request from "../../lib/request";
import PageLoading from "../../components/pageloading";
import FallbackImage from "../../components/FallbackImage";
import utils from "../../lib/utils";
import {Text, View} from "@tarojs/components";
import TimeCountDowner from "../../components/TimeCountDowner";

const numeral = require('numeral');

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
        })
    }


    componentWillUnmount() {

    }


    render() {
        const {detail} = this.state;

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
                    <View></View>
                </View>
            </PageLayout>
        );
    }
}
