import React, {Component} from "react";
import PageLoading from "../../components/pageloading";
import PageLayout from "../../layouts/PageLayout";
import request from "../../lib/request";
import {View} from "@tarojs/components";
import {Cell, List, Loading, PullRefresh} from "@taroify/core";


export default class Index extends Component<any, any> {
    state:any = {
        list: [],
        loading: false,
        hasMore: true,
        scrollTop: 0,
        reachTop: true,
        page: 1,
        pageSize: 10,
    }
    refreshingRef = React.createRef<boolean>();

    constructor(props) {
        super(props);
        this.onLoad = this.onLoad.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
    }


    componentDidMount() {

    }
    onLoad () {
        this.setState({loading: true});
        const newList = this.refreshingRef.current ? [] : this.state.list;
        request.get('/paimai/api/member/fapiao/orders', {params: {status: 0, pageNo: this.state.page, pageSize: this.state.pageSize}}).then(res=>{
            this.refreshingRef.current = false;
            let records = res.data.result.records;
            records.forEach(item=>newList.push(item));
            this.setState({list:newList, loading: false, hasMore: records.length >= this.state.pageSize});
        });
    }
    onRefresh() {
        this.refreshingRef.current = true
        this.setState({loading: false});
        this.onLoad();
    }
    render() {
        const {list, reachTop, scrollTop, hasMore, loading} = this.state;
        if(list.length == 0) return <PageLoading />;

        const refreshingRef = this.refreshingRef;


        return (
            <PageLayout statusBarProps={{title: '发票中心'}}>
                <View></View>
                <PullRefresh loading={refreshingRef.current} reachTop={reachTop} onRefresh={this.onRefresh}>
                    <List loading={loading} hasMore={hasMore} scrollTop={scrollTop} onLoad={this.onLoad}>
                        {
                            list.map((item) => (
                                <Cell key={item}>{item}</Cell>
                            ))
                        }
                        {!refreshingRef.current && (
                            <List.Placeholder>
                                {loading && <Loading>加载中...</Loading>}
                                {!hasMore && "没有更多了"}
                            </List.Placeholder>
                        )}
                    </List>
                </PullRefresh>
            </PageLayout>
        );
    }
}
