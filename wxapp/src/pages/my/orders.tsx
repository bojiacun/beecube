import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import ListView, {ListViewTabItem} from "../../components/listview";
import request from "../../lib/request";
import classNames from "classnames";
import {Navigator, View} from "@tarojs/components";
import PageLoading from "../../components/pageloading";
import FallbackImage from "../../components/FallbackImage";
import utils from "../../lib/utils";
const numeral = require('numeral');

export default class Index extends Component<any, any> {
    state:any = {
        tabs: [
            {label: '全部', id: '', template: this.renderTemplate},
            {label: '待支付', id: '0', template: this.renderTemplate},
            {label: '待发货', id: '1', template: this.renderTemplate},
            {label: '待收货', id: '2', template: this.renderTemplate},
            {label: '已完成', id: '3', template: this.renderTemplate},
            {label: '售后', id: '4', template: this.renderTemplate},
        ],
        status: false,
    }

    constructor(props) {
        super(props);
        this.renderTemplate = this.renderTemplate.bind(this);
        this.loadData = this.loadData.bind(this);
    }


    onLoad(options) {
        if(options.status) {
            this.setState({status: options.status});
        }
    }

    loadData(pageIndex: number, tab: ListViewTabItem) {
        let params: any = {column: 'create_time', orderBy: 'desc', pageNo: pageIndex};
        if (tab.id != '') {
            params.status = tab.id;
        }
        return request.get('/paimai/api/members/orders', {params: params});
    }

    renderTemplate(data: any) {
        return (
            <View className={classNames('bg-white rounded-lg overflow-hidden shadow-outer p-4')}>
                <Navigator url={'/pages/my/orders/detail?id=' + data.id}>
                    {data.orderGoods.map((item:any)=>{
                        return (
                            <View className={'flex'}>
                                <View className={'w-12'}><FallbackImage className={'rounded'} src={utils.resolveUrl(item.goodsImage)} /></View>
                                <View className={'flex-1'}>
                                    <View>{item.goodsName}</View>
                                    <View>{numeral(item.goodsPrice).format('0,0.00')} X {item.goodsCount}</View>
                                </View>
                                <View className={'font-bold'}>￥{numeral(item.goodsPrice*item.goodsCount).format('0,0.00')}</View>
                            </View>
                        );
                    })}
                </Navigator>
            </View>
        );
    }

    componentDidMount() {

    }

    onPullDownRefresh() {

    }

    render() {
        const {status} = this.state;
        if(status === false) return <PageLoading />;
        return (
            <PageLayout statusBarProps={{title: '我的订单'}} enableReachBottom={true}>
                <ListView tabs={this.state.tabs} dataFetcher={this.loadData} defaultActiveKey={this.state.status} tabStyle={2} />
            </PageLayout>
        );
    }
}
