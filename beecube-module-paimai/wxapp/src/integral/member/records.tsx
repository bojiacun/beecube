import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {Cell, List, Loading} from "@taroify/core";
import request from "../../lib/request";
import {View} from "@tarojs/components";
import {connect} from "react-redux";
import PageLoading from "../../components/pageloading";

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
        pageSize: 30,
        reachTop: true,
    }

    constructor(props) {
        super(props);
        this.onLoad = this.onLoad.bind(this);
        this.onPageScroll = this.onPageScroll.bind(this);
    }


    onPageScroll({scrollTop}) {
        this.setState({scrollTop, reachTop: scrollTop === 0});
    }

    onLoad() {
        this.setState({loading: true});
        const newList = this.state.list || [];
        request.get('/app/api/members/scores/records', {params: {pageNo: this.state.page, pageSize: this.state.pageSize}}).then(res => {
            let list = res.data.result.records;
            list.forEach((item: any) => {
                newList.push(item);
            });
            this.setState({list: newList, loading: false, hasMore: list.length >= this.state.pageSize, page: this.state.page + 1});
        });
    }

    render() {
        const {loading, hasMore, scrollTop, list} = this.state;
        const {systemInfo} = this.props;
        if (!list) return <PageLoading/>;

        let safeBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom;
        if (safeBottom > 10) safeBottom -= 10;


        return (
            <PageLayout statusBarProps={{title: '积分明细'}} enableReachBottom={true}>
                <List loading={loading} hasMore={hasMore} scrollTop={scrollTop} onLoad={this.onLoad} offset={0}>
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
