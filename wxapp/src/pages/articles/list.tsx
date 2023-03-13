import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request from "../../lib/request";
import utils from "../../lib/utils";
import {View, Navigator, Video} from "@tarojs/components";
import NoData from "../../components/nodata";
import LoadMore from "../../components/loadmore";

export default class Index extends Component<any, any> {
    state: any = {
        page: 1,
        list: [],
        loadingMore: false,
        noMore: false,
        options: {tag: '文章列表'},
    }

    componentDidMount() {
    }

    loadData(tag, page, clear = false) {
        return request.get('/paimai/api/articles/list', {
            params: {
                pageNo: page,
                column: 'createTime',
                order: 'desc',
                tag: decodeURIComponent(tag),
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
        this.loadData(options.tag, 1, true).then(() => utils.hideLoading());
    }

    onReachBottom() {
        this.setState({loadingMore: true, noMore: false});
        this.loadData(this.state.options.tag, this.state.page + 1, false).then(() => { });
        this.setState({page: this.state.page + 1});
    }

    onPullDownRefresh() {
        utils.showLoading();
        this.loadData(this.state.options.tag,1, true).then(() => utils.hideLoading());
        this.setState({page: 1});
    }

    render() {
        const {list, noMore, loadingMore, options} = this.state;
        return (
            <PageLayout statusBarProps={{title: decodeURIComponent(options.tag)}} enableReachBottom={true}>
                {list.length == 0 && <NoData/>}
                {list[0]?.type == 1 &&
                    <View className={'grid grid-cols-1 gap-4 p-4 divide-y divide-gray-200'}>
                        {list.map((item) => {
                            return (
                                <Navigator url={`/pages/articles/detail?id=${item.id}`} className={'bg-white p-4 flex '}>
                                    <View className={'flex-1 font-bold'}>
                                        {item.title}
                                    </View>
                                    <View className={'iconfont icon-youjiantou_huaban w-20 text-right'}/>
                                </Navigator>
                            );
                        })}
                    </View>
                }
                {list[0]?.type == 2 &&
                    <View className={'p-4 space-y-4'}>
                        {list.map((item) => {
                            return (
                                <View className={'bg-white space-y-2 p-4 rounded shadow-outer'}>
                                    <View className={'flex-1 font-bold'}>
                                        <Video src={item.video}  controls={true} />
                                    </View>
                                    <View className={'font-bold'}>{item.title}</View>
                                </View>
                            );
                        })}
                    </View>
                }
                {list.length > 0 && <LoadMore noMore={noMore} loading={loadingMore}/>}
            </PageLayout>
        );
    }
}
