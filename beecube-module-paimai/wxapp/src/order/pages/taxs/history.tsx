import React, {Component} from "react";
import {View, Text} from "@tarojs/components";
import {List, Loading, PullRefresh} from "@taroify/core";
import numeral from 'numeral';
import {connect} from "react-redux";
import request from "../../../lib/request";
import PageLoading from "../../../components/pageloading";
import PageLayout from "../../../layouts/PageLayout";

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

    componentDidMount() {

    }

    onLoad() {
        this.setState({loading: true});
        const newList = this.state.list || [];
        request.get('/paimai/api/members/fapiao/history', {params: {pageNo: this.state.page, pageSize: this.state.pageSize}}).then(res => {
            this.refreshingRef.current = false;
            let records = res.data.result.records;
            records.forEach(item => newList.push(item));
            this.setState({list: newList, loading: false, hasMore: records.length >= this.state.pageSize, page: this.state.page + 1});
        });
    }

    onRefresh() {
        this.refreshingRef.current = true;
        this.setState({loading: true, page: 1});
        const newList = [];
        request.get('/paimai/api/members/fapiao/history', {params: {pageNo: 1, pageSize: this.state.pageSize}}).then(res => {
            this.refreshingRef.current = false;
            let records = res.data.result.records;
            records.forEach(item => newList.push(item));
            this.setState({list: newList, loading: false, hasMore: records.length >= this.state.pageSize, page: this.state.page + 1});
        });
    }

    render() {
        const {list, reachTop, scrollTop, hasMore, loading} = this.state;
        const {systemInfo} = this.props;
        if (!list) return <PageLoading/>;

        const refreshingRef = this.refreshingRef;
        let safeBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom;
        if (safeBottom > 10) safeBottom -= 10;

        return (
            <PageLayout statusBarProps={{title: '发票中心'}} containerClassName={'p-4'}>
                <View className={'item-title text-lg mb-4'}>开票记录</View>
                <PullRefresh loading={refreshingRef.current} reachTop={reachTop} onRefresh={this.onRefresh}>
                    <List className={'rounded-lg bg-white p-4'} loading={loading} hasMore={hasMore} scrollTop={scrollTop} onLoad={this.onLoad}>
                        {
                            list.map((item) => {
                                return (
                                    <View className={'flex items-center space-x-4 bg-none pb-2 mb-2 border-b border-gray-300'} key={item.id}>
                                        <View className={'flex-1 space-y-2'}>
                                            <View className={'text-stone-400'}>编号: {item.id}</View>
                                            <View className={'text-lg'}>开票金额: ￥{numeral(item.amount).format('0,0.00')}</View>
                                            <View className={'text-stone-400'}>包含{item.orderIds.split(',').length}个订单</View>
                                            <View className={'text-stone-400'}>{item.createTime}</View>
                                        </View>
                                        <View className={'text-xl flex-none'}>
                                            {item.status == 1 && <Text className={'text-orange-400'}>审核中</Text>}
                                            {item.status == 2 && <Text className={'text-green-400'}>已开票</Text>}
                                            {item.status == 0 && <Text className={'text-stone-400'}>已拒绝</Text>}
                                        </View>
                                    </View>
                                );
                            })
                        }
                    </List>
                    {!refreshingRef.current && (
                        <List.Placeholder>
                            {loading && <Loading>加载中...</Loading>}
                            {!hasMore && "没有更多了"}
                        </List.Placeholder>
                    )}
                </PullRefresh>
            </PageLayout>
        );
    }
}
