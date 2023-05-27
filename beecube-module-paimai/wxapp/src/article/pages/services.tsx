import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request from "../../lib/request";
import utils from "../../lib/utils";
import {View, Navigator, Button, Text} from "@tarojs/components";
import NoData from "../../components/nodata";
import LoadMore from "../../components/loadmore";
import {connect} from "react-redux";

//@ts-ignore
@connect((state: any) => (
    {
        systemInfo: state.context.systemInfo,
    }
))
export default class Index extends Component<any, any> {
    state: any = {
        page: 1,
        list: [],
        loadingMore: false,
        noMore: false,
    }

    componentDidMount() {
    }

    loadData(page, clear = false) {
        return request.get('/paimai/api/articles/list', {
            params: {
                pageNo: page,
                column: 'createTime',
                order: 'desc',
                type: 3,
            }
        }).then(res => {
            if (clear) {
                this.setState({list: res.data.result.records, loadingMore: false, noMore: false});
            } else {
                let list = this.state.list;
                let newList = res.data.result.records;
                if (!newList || newList.length == 0) {
                    this.setState({noMore: true, loadingMore: false});
                } else {
                    this.setState({noMore: false, loadingMore: false, list: [...list, ...newList]});
                }
            }
        });
    }

    onLoad(options: any) {
        this.setState({options: options})
        utils.showLoading();
        this.loadData(1, true).then(() => utils.hideLoading());
    }

    onReachBottom() {
        this.setState({loadingMore: true, noMore: false});
        this.loadData(this.state.page + 1, false).then(() => {
        });
        this.setState({page: this.state.page + 1});
    }

    onPullDownRefresh() {
        utils.showLoading();
        this.loadData(1, true).then(() => utils.hideLoading());
        this.setState({page: 1});
    }

    render() {
        const {list, noMore, loadingMore} = this.state;
        const {systemInfo} = this.props;
        const safeBottom = utils.calcSafeBottom(systemInfo) + 30;
        return (
            <PageLayout
                statusBarProps={{title: '服务指南', className: 'border-0 border-b-1 border-gray-200 bg-white border-solid'}}
                enableReachBottom={true}>
                {list.length == 0 && <NoData/>}
                <View className={'grid grid-cols-1 px-4 divide-y divide-gray-100'}>
                    {list.map((item) => {
                        return (
                            <View>
                                <Navigator url={`/articles/pages/detail?id=${item.id}`} className={'bg-white py-4 flex items-center'}>
                                    <View className={'flex-1 font-bold'}>
                                        {item.title}
                                    </View>
                                    <View className={'iconfont icon-youjiantou_huaban w-20 text-right'}/>
                                </Navigator>
                            </View>
                        );
                    })}
                </View>
                {list.length > 0 && <LoadMore noMore={noMore} loading={loadingMore}/>}
                <View className={'p-4 text-center absolute w-full'} style={{bottom:safeBottom}}><Button className={'btn btn-outline text-lg'} openType={'contact'}><Text className={'fa fa-commenting-o mr-2'} />联系客服</Button></View>
            </PageLayout>
        );
    }
}
