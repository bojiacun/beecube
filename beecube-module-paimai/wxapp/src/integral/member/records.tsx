import React, {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {Cell, List, Loading, PullRefresh} from "@taroify/core";
import request from "../../lib/request";
import {View} from "@tarojs/components";
import utils from "../../lib/utils";
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
        request.get('/app/api/members/scores/records', {params: {pageNo: this.state.page, pageSize: 20}}).then(res => {
            // @ts-ignore
            this.refreshingRef.current = false;
            let list = res.data.result.records;
            list.forEach((item: any) => {
                newList.push(item);
            });
            this.setState({list: newList, loading: false, hasMore: list.length == 20});
        });
    }

    onRefresh() {
        // @ts-ignore
        this.setState({page: 1});
        this.refreshingRef.current = true;
        this.setState({loading: false});
        this.onLoad();
    }

    componentDidMount() {
    }

    render() {
        const {loading, hasMore, scrollTop, reachTop, list} = this.state;
        const top = utils.calcPageHeaderHeight(this.props.systemInfo);

        return (
            <PageLayout statusBarProps={{title: '积分明细'}} containerStyle={{height: `calc(100vh - ${top}px)`}}>
                <PullRefresh className={'min-h-full'} loading={this.refreshingRef.current} reachTop={reachTop} onRefresh={this.onRefresh}>
                    <List loading={loading} hasMore={hasMore} scrollTop={scrollTop} onLoad={this.onLoad}>
                        {list.map((item: any) => {
                            return (
                                <Cell key={item.id}>
                                    <View className={'flex items-center'}>
                                        <View className={'flex-1'}>
                                            <View className={'text-lg'}>{item.description}</View>
                                            <View className={'text-stone-400 text-xs'}>{item.createTime}</View>
                                        </View>
                                        {item.type == 1 ?
                                            <View className={'flex-none text-xl text-red-600'}>
                                                + {item.score}
                                            </View>
                                            :
                                            <View className={'flex-none font-bold text-xl text-green-400'}>
                                                - {item.score}
                                            </View>
                                        }
                                    </View>
                                </Cell>
                            );
                        })}
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
