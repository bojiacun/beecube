import React, {Component} from "react";
import PageLoading from "../../components/pageloading";
import PageLayout from "../../layouts/PageLayout";
import request from "../../lib/request";
import {View} from "@tarojs/components";
import {List, Loading} from "@taroify/core";
import numeral from 'numeral';
import {connect} from "react-redux";

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
        list: null,
        loading: false,
        hasMore: true,
        scrollTop: 0,
        reachTop: true,
        page: 1,
        pageSize: 20,
        selected: [],
    }
    refreshingRef = React.createRef<boolean>();

    constructor(props) {
        super(props);
        this.onLoad = this.onLoad.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.onPageScroll = this.onPageScroll.bind(this);
    }

    onPageScroll({scrollTop}) {
        this.setState({scrollTop});
    }

    componentDidShow() {
        this.onRefresh(false);
    }

    onLoad() {
        this.setState({loading: true});
        const newList = this.state.list || [];
        request.get('/paimai/api/members/invites/all', {params: {pageNo: this.state.page, pageSize: this.state.pageSize}}).then(res => {
            let records = res.data.result.records;
            records.forEach(item => newList.push(item));
            this.setState({list: newList, loading: false, hasMore: records.length >= this.state.pageSize, page: this.state.page + 1});
        });
    }

    onRefresh(showLoading = true) {
        this.setState({loading: showLoading, page: 1});
        const newList = [];
        request.get('/paimai/api/members/invites/all', {params: {pageNo: 1, pageSize: this.state.pageSize}}).then(res => {
            let records = res.data.result.records;
            // @ts-ignore
            records.forEach(item => newList.push(item));
            this.setState({list: newList, loading: false, hasMore: records.length >= this.state.pageSize, page: this.state.page + 1});
        });
    }

    render() {
        const {list, scrollTop, hasMore, loading} = this.state;
        const {systemInfo} = this.props;
        if (!list) return <PageLoading/>;

        const refreshingRef = this.refreshingRef;
        let safeBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom;
        if (safeBottom > 10) safeBottom -= 10;

        return (
            <PageLayout statusBarProps={{title: '我的参展'}} containerClassName={'p-4'}>
                <List className={''} loading={loading} hasMore={hasMore} scrollTop={scrollTop} onLoad={this.onLoad}>
                    {
                        list.map((item) => {
                            return (
                                <View className={'flex items-center space-x-4 bg-none pb-2 mb-2 border-b border-gray-300'} key={item.id}>
                                    <View className={'flex-1'}>
                                        <View className={'text-sm text-stone-400'}>订单编号 | {item.id}</View>
                                        <View className={'flex mt-2'}>
                                            {
                                                item.orderGoods.map(item => {
                                                    return (
                                                        <View className={'space-y-1'}>
                                                            <View>{item.goodsName}</View>
                                                            <View>{item.goodsPrice} X {item.goodsCount}</View>
                                                        </View>
                                                    );
                                                })
                                            }
                                        </View>
                                    </View>
                                    <View className={'text-xl font-bold text-red-600 flex-none'}>
                                        ￥{numeral(item.payedPrice).format('0,0.00')}
                                    </View>
                                </View>
                            );
                        })
                    }
                    {!refreshingRef.current && (
                        <List.Placeholder>
                            {loading && <Loading>加载中...</Loading>}
                            {!hasMore && "没有更多了"}
                        </List.Placeholder>
                    )}
                    <View style={{height: safeBottom + 56}}/>
                </List>
            </PageLayout>
        );
    }
}
