import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request from "../../lib/request";
import PageLoading from "../../components/pageloading";
import {Navigator, View} from "@tarojs/components";
import {connect} from "react-redux";
import Taro from "@tarojs/taro";
import FallbackImage from "../../components/FallbackImage";
import utils from "../../lib/utils";
import LineTitle from "../../components/LineTitle";

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
        id: null,
        detail: null,
        goodsList: [],
        loadingMore: false,
        noMore: false,
        page: 1,
        posting: false,
    }

    constructor(props) {
        super(props);
    }


    loadData(id, page: number, clear = false) {
        return request.get('/paimai/api/auctions/performances', {params: {id: id, pageNo: page}}).then(res => {
            if (clear) {
                this.setState({goodsList: res.data.result, loadingMore: false, noMore: false});
            } else {
                let goodsList = this.state.goodsList;
                let newGoodsList = res.data.result;
                if (!newGoodsList || newGoodsList.length == 0) {
                    this.setState({noMore: true, loadingMore: false});
                } else {
                    this.setState({noMore: false, loadingMore: false, goodsList: [...goodsList, ...newGoodsList]});
                }
            }
        });
    }

    onLoad(options) {
        this.setState({id: options.id});
        request.get('/paimai/api/auctions/detail', {params: {id: options.id}}).then(res => {
            let detail = res.data.result;
            this.setState({detail: detail});
            return this.loadData(detail.id, 1, true);
        })
    }


    componentWillUnmount() {

    }


    render() {
        const {detail, goodsList} = this.state;


        if (!detail) return <PageLoading/>


        return (
            <PageLayout style={{backgroundColor: 'white'}} statusBarProps={{title: '拍卖会详情'}}>
                <View className={'p-4 space-y-2 bg-white'}>
                    <View className={'text-xl font-bold'}>{detail.title}</View>
                    <View className={'text-gray-600'}>拍卖时间: {detail.timeRange}</View>
                    <View className={'text-gray-600'}>拍卖地点: {detail.address}</View>
                    <LineTitle text={'共'+goodsList?.length+'场'} />
                </View>
                <View className={'p-4'}>
                    {goodsList?.map((item: any) => {
                        let radius = 8;
                        let link;
                        if(item.type == 1) {
                            link = '/pages/performance/detail?id='+item.id;
                        }
                        else {
                            link = '/pages/performance/detail2?id='+item.id;
                        }
                        return (
                            <View className={'bg-white shadow-outer overflow-hidden'} style={{borderRadius: Taro.pxTransform(radius)}}>
                                <Navigator url={link}>
                                    <View className={'relative'} style={{width: '100%'}}>
                                        <FallbackImage mode={'widthFix'} className={'block w-full'} src={utils.resolveUrl(item.preview)}/>
                                    </View>
                                    <View className={'p-4 text-xl font-bold'}>{item.title}</View>
                                </Navigator>
                            </View>
                        );
                    })}
                </View>
            </PageLayout>
        );
    }
}
