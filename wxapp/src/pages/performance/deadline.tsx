import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import ListView, {ListViewTabItem} from "../../components/listview";
import {Navigator, Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import FallbackImage from "../../components/FallbackImage";
import utils from "../../lib/utils";
import TimeCountDowner from "../../components/TimeCountDowner";
import request from "../../lib/request";

const tabs: ListViewTabItem[] = [
    {
        label: '竞拍中',
        id: 1,
        template: data => {
            let radius = 0;
            return (
                <View className={'bg-white relative overflow-hidden shadow-outer'} style={{borderRadius: Taro.pxTransform(radius)}}>
                    <Navigator url={'/pages/performance/detail?id=' + data.id}>
                        <View className={'relative'} style={{width: '100%'}}>
                            <FallbackImage mode={'widthFix'}
                                           className={'block w-full'} src={utils.resolveUrl(data.preview)}/>
                        </View>
                        <View className={'p-4 space-y-2 divide-y divide-gray-100'}>
                            <View className={'space-y-1'}>
                                <View className={'font-bold text-lg'}>
                                    {data.title}
                                </View>
                                <TimeCountDowner className={'flex text-sm text-gray-400'} endTime={data.endTime}
                                                 startTime={data.startTime}/>
                            </View>
                            <View className={'flex pt-2 space-x-4'}>
                                <Text>报名{data.depositCount}人</Text>
                                <Text>围观{data.viewCount}人</Text>
                                <Text>出价{data.offerCount}次</Text>
                            </View>
                        </View>
                    </Navigator>
                </View>
            );
        }
    },
    {
        label: '已结束',
        id: 2,
        template: data => {
            let radius = 0;
            return (
                <View className={'bg-white overflow-hidden shadow-outer'} style={{borderRadius: Taro.pxTransform(radius)}}>
                    <Navigator url={'/pages/performance/detail?id=' + data.id}>
                        <View className={'relative'} style={{width: '100%'}}>
                            <FallbackImage mode={'widthFix'}
                                           className={'block w-full'} src={utils.resolveUrl(data.preview)}/>
                        </View>
                        <View className={'p-4 divide-y divide-gray-100'}>
                            <View className={'space-y-1'}>
                                <View className={'font-bold text-lg'}>
                                    {data.title}
                                </View>
                                <TimeCountDowner className={'flex text-sm'} endTime={data.endTime} startTime={data.startTime}/>
                            </View>
                            <View className={'flex space-x-4'}>
                                <Text>报名{data.depositCount}人</Text>
                                <Text>围观{data.viewCount}人</Text>
                                <Text>出价{data.offerCount}次</Text>
                            </View>
                        </View>
                    </Navigator>
                </View>
            );
        }
    },
];

export default class Index extends Component<any, any> {
    loadData(page: number, tab: ListViewTabItem) {
        return request.get('/paimai/api/performances/list', {params: {type: 1, source: tab.id, pageNo: page}});
    }

    render() {
        return (
            <PageLayout statusBarProps={{title: '限时拍'}} enableReachBottom={true}>
                <ListView tabs={tabs} dataFetcher={this.loadData} tabStyle={2}/>
            </PageLayout>
        );
    }
}
