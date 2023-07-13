import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {List, Loading} from "@taroify/core";
import request from "../../lib/request";
import {Navigator, Text, View} from "@tarojs/components";
import FallbackImage from "../../components/FallbackImage";
import utils from "../../lib/utils";
import numeral from 'numeral';
import {connect} from "react-redux";

const TABS = {
    "0": "未开始",
    "1": "进行中",
    '2': '已获拍',
    '3': '未获拍',
}
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
        list: [],
        hasMore: true,
        loading: false,
        scrollTop: 0,
        page: 1,
        options: {
            tab: 1,
        }
    }

    onLoad(options) {
        this.setState({options});
    }

    onPageScroll(scroll) {
        this.setState({scrollTop: scroll.scroll});
    }

    render() {
        const {list, loading, hasMore, scrollTop, page, options} = this.state;
        const {systemInfo} = this.props;
        let safeBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom;
        if (safeBottom > 10) safeBottom -= 10;


        return (
            <PageLayout statusBarProps={{title: `我的参拍 - ${TABS[options.tab]}`}}>
                <List
                    loading={loading}
                    hasMore={hasMore}
                    scrollTop={scrollTop}
                    offset={0}
                    onLoad={() => {
                        this.setState({loading: true});
                        request.get('/paimai/api/members/goods/my', {params: {tab: options.tab, pageSize: 20, pageNo: page}}).then(res => {
                            let records = res.data.result.records;
                            records.forEach(item => list.push(item));
                            this.setState({hasMore: records.length >= 20, loading: false, page: page + 1, list: list});
                        });
                    }}
                >
                    {
                        list.map((item: any) => (
                            <Navigator url={'/goods/pages/detail?id='+item.id}>
                                <View className={'m-4 flex bg-white rounded overflow-hidden'}>
                                    <View className={'flex-none'} style={{width: 60, height: 60}}>
                                        <FallbackImage mode={'aspectFill'} src={utils.resolveUrl(item.images.split(',')[0])} className={'w-full h-full'}/>
                                    </View>
                                    <View className={'flex-1 px-4 py-2'}>
                                        <View className={'text-lg font-bold'}>{item.title}</View>
                                        {item.state < 3 &&
                                            <View className={'text-gray-600 mt-2'}>
                                                <View className={'space-x-1'}>
                                                    估价 <Text className={'text-red-500 text-sm font-bold'}>RMB</Text>
                                                    <Text className={'text-lg font-bold'}>{item.evaluatePrice}</Text>
                                                </View>
                                                <View>
                                                    当前价 <Text className={'text-sm text-red-500 font-bold'}>RMB</Text> <Text
                                                    className={'text-lg text-red-500 font-bold'}>{numeral(item.currentPrice || item.startPrice).format('0,0.00')}</Text>
                                                </View>
                                            </View>
                                        }
                                        {item.state == 3 &&
                                            <View className={'text-gray-600 mt-2'}>
                                                落槌价 <Text className={'text-sm text-red-500 font-bold'}>RMB</Text> <Text
                                                className={'text-lg text-red-500 font-bold'}>{numeral(item.dealPrice).format('0,0.00')}</Text>
                                            </View>
                                        }
                                        {item.state == 4 &&
                                            <View className={'text-gray-600 mt-2'}>
                                                流拍
                                            </View>
                                        }
                                    </View>
                                </View>
                            </Navigator>
                        ))
                    }
                    <List.Placeholder>
                        {loading && <Loading>加载中...</Loading>}
                        {!hasMore && "没有更多了"}
                        <View style={{height: safeBottom + 56}}/>
                    </List.Placeholder>
                </List>
            </PageLayout>
        );
    }
}
