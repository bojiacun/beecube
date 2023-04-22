import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import ListView, {ListViewTabItem} from "../../components/listview";
import {Navigator, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import FallbackImage from "../../components/FallbackImage";
import utils from "../../lib/utils";
import request from "../../lib/request";

const tabs: ListViewTabItem[] = [
    {
        label: '竞拍中',
        id: 1,
        template: data => {
            let radius = 8;
            return (
                <View className={'bg-white overflow-hidden shadow-outer'} style={{borderRadius: Taro.pxTransform(radius)}}>
                    <Navigator url={'/pages/auction/detail?id=' + data.id}>
                        <View className={'relative'} style={{width: '100%'}}>
                            <FallbackImage mode={'widthFix'} className={'block w-full'} src={utils.resolveUrl(data.preview)}/>
                        </View>
                        <View className={'p-4 text-lg font-bold'}>
                            {data.title}
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
                    <Navigator url={'/pages/auction/detail?id=' + data.id}>
                        <View className={'relative'} style={{width: '100%'}}>
                            <FallbackImage mode={'widthFix'} className={'block w-full'} src={utils.resolveUrl(data.preview)}/>
                        </View>
                        <View className={'p-4 divide-y divide-gray-100'}>
                            {data.title}
                        </View>
                    </Navigator>
                </View>
            );
        }
    },
];

export default class Index extends Component<any, any> {
    loadData(page: number, tab: ListViewTabItem) {
        return request.get('/paimai/api/auctions/list', {params: {source: tab.id, pageNo: page}});
    }
    render() {
        return (
            <PageLayout statusBarProps={{title: '拍卖会'}} enableReachBottom={true}>
                <ListView tabs={tabs} dataFetcher={this.loadData}  tabStyle={2} />
            </PageLayout>
        );
    }
}
