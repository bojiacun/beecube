import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {Button, List, Loading} from "@taroify/core";
import request from "../../lib/request";
import {Navigator, Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import FallbackImage from "../../components/FallbackImage";
import utils from "../../lib/utils";

const TABS = {
    "0": "未开始",
    "1": "进行中",
    '2': '已获拍',
    '3': '未获拍',
}

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

        return (
            <PageLayout statusBarProps={{title: `我的参拍 - ${TABS[options.tab]}`}}>
                <List
                    loading={loading}
                    hasMore={hasMore}
                    scrollTop={scrollTop}
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
                                    <View className={'flex-1 p-4'}>
                                        <View>{item.title}</View>
                                    </View>
                                </View>
                            </Navigator>
                        ))
                    }
                    <List.Placeholder>
                        {loading && <Loading>加载中...</Loading>}
                        {!hasMore && "没有更多了"}
                    </List.Placeholder>
                </List>
            </PageLayout>
        );
    }
}
