import React, {Component} from "react";
import {View} from "@tarojs/components";
import {List, Loading} from "@taroify/core";
import {connect} from "react-redux";
import PageLayout from "../../../layouts/PageLayout";
import PageLoading from "../../../components/pageloading";
import request from "../../../lib/request";

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
        request.get('/paimai/api/members/withdraws', {params: {pageNo: this.state.page, pageSize: this.state.pageSize}}).then(res => {
            let records = res.data.result.records;
            records.forEach(item => newList.push(item));
            this.setState({list: newList, loading: false, hasMore: records.length >= this.state.pageSize, page: this.state.page + 1});
        });
    }

    onRefresh(showLoading = true) {
        this.setState({loading: showLoading, page: 1});
        const newList = [];
        request.get('/paimai/api/members/withdraws', {params: {pageNo: 1, pageSize: this.state.pageSize}}).then(res => {
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
            <PageLayout statusBarProps={{title: '提现记录'}} containerClassName={'p-4'}>
                <List className={''} loading={loading} hasMore={hasMore} scrollTop={scrollTop} onLoad={this.onLoad}>
                    {
                        list.map((item) => {
                            return (
                                <View className={'flex items-center mb-2 space-x-4 bg-white p-4'} key={item.id}>
                                    <View className={'flex-1'}>
                                        <View className={'text-lg'}>{item.performance.title}</View>
                                        <View className={'flex mt-2 text-stone-400'}>
                                            预计参展日期：{item.joinTime}
                                        </View>
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
