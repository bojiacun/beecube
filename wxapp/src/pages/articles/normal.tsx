import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request from "../../lib/request";
import utils from "../../lib/utils";
import {View, Navigator} from "@tarojs/components";
import NoData from "../../components/nodata";
import LoadMore from "../../components/loadmore";
import FallbackImage from "../../components/FallbackImage";

export default class Index extends Component<any, any> {
    state: any = {
        page: 1,
        list: [],
        loadingMore: false,
        noMore: false,
        classId: undefined,
        className: undefined
    }

    componentDidMount() {
    }

    loadData(page, clear = false, classId) {
        request.get('/paimai/api/articles/list', {
            params: {
                classId: classId,
                pageNo: page,
                column: 'createTime',
                order: 'desc',
                type: 1,
            }
        }).then(res => {
            utils.hideLoading();
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
        this.setState({classId: options.id});
        utils.showLoading();
        request.get("/paimai/api/articles/classes/detail", {params:{id: options.id}}).then(res=>{
            this.setState({className: res.data.result?.name});
        })
        this.loadData(1, true, options.id);
    }

    onReachBottom() {
        this.setState({loadingMore: true, noMore: false});
        this.loadData(this.state.page + 1, false, this.state.classId);
        this.setState({page: this.state.page + 1});
    }

    onPullDownRefresh() {
        utils.showLoading();
        this.loadData(1, true, this.state.classId);
        this.setState({page: 1});
    }

    render() {
        const {list, noMore, loadingMore, className} = this.state;
        return (
            <PageLayout
                statusBarProps={{title: className, className: 'border-0 border-b-1 border-gray-200 bg-white border-solid'}}
                enableReachBottom={true}>
                {list.length == 0 && <NoData/>}
                <View className={'grid grid-cols-1 px-4 divide-y divide-gray-100'}>
                    {list.map((item) => {
                        return (
                            <View>
                                <Navigator url={`/pages/articles/detail?id=${item.id}`} className={'bg-white space-x-4 py-4 flex items-center'}>
                                    <View style={{height: 60}} className={'overflow-hidden'}>
                                        <FallbackImage mode={'aspectFill'} src={utils.resolveUrl(item.preview)} style={{width: 60, height: 60}} />
                                    </View>
                                    <View style={{height: 60}} className={'flex flex-col justify-between'}>
                                        <View className={'font-bold'}>{item.title}</View>
                                        <View className={'flex justify-between text-sm'}>
                                            <View className={'text-gray-400'}>{item.createTime}</View>
                                            <View>{item.views}</View>
                                        </View>
                                    </View>
                                </Navigator>
                            </View>
                        );
                    })}
                </View>
                {list.length > 0 && <LoadMore noMore={noMore} loading={loadingMore}/>}
            </PageLayout>
        );
    }
}
