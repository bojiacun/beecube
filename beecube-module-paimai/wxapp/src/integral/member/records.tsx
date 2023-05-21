import React, {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {List, Loading, PullRefresh} from "@taroify/core";
import request from "../../lib/request";


export default class Index extends Component<any, any> {
    state:any = {
        list: [],
        hasMore: false,
        loading: false,
        scrollTop: 0,
        page: 1,
        reachTop: true,
    }

    refreshingRef = React.createRef<any>();

    constructor(props) {
        super(props);
        this.onLoad = this.onLoad.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
    }


    onPageScroll(res) {
        this.setState({scrollTop: res.scrollTop, reachTop: res.scrollTop == 0});
    }

    onLoad() {
        this.setState({loading: true});
        const newList = this.refreshingRef.current ? [] : this.state.list;
        request.get('/app/api/members/scores/records', {params: {pageNo: this.state.page, pageSize: 20}}).then(res=>{
            // @ts-ignore
            this.refreshingRef.current = false;
            let list = res.data.result.records;
            list.forEach((item:any)=>{
                newList.push(item);
            });
            this.setState({list: newList, loading: false, hasMore: list.length == 20});
        });
    }
    onRefresh() {
        // @ts-ignore
        this.refreshingRef.current = true;
        this.setState({loading: false});
        this.onLoad();
    }

    componentDidMount() {
    }

    render() {
        const {loading, hasMore, scrollTop, reachTop} = this.state;

        return (
            <PageLayout statusBarProps={{title: '积分明细'}}>
                <PullRefresh loading={this.refreshingRef.current} reachTop={reachTop} onRefresh={this.onRefresh}>
                    <List loading={loading} hasMore={hasMore} scrollTop={scrollTop} onLoad={this.onLoad}>

                    </List>
                    {!this.refreshingRef.current && (
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
