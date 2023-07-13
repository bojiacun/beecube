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

const ORDER_STATUS = {
    '0': '待支付',
    '1': '待发货',
    '2': '待收货',
    '3': '已完成',
    '4': '售后',
    '-1': '已取消',
}

export default class Index extends Component<any, any> {
    state: any = {
        tabs: [],
        status: null,
    }

    constructor(props) {
        super(props);
        this.renderTemplate = this.renderTemplate.bind(this);
        this.loadData = this.loadData.bind(this);
        this.renderOrderButtons = this.renderOrderButtons.bind(this);
        this.state.tabs = [
            {label: '全部', id: '', template: this.renderTemplate},
            {label: '待支付', id: '0', template: this.renderTemplate},
            {label: '待发货', id: '1', template: this.renderTemplate},
            {label: '待收货', id: '2', template: this.renderTemplate},
            {label: '已完成', id: '3', template: this.renderTemplate},
            {label: '售后', id: '4', template: this.renderTemplate},
            {label: '已取消', id: '-1', template: this.renderTemplate},
        ]
    }


    onLoad(options) {
        this.setState({status: options.status});
    }

    loadData(pageIndex: number, tab: ListViewTabItem) {
        let params: any = {column: 'createTime', order: 'desc', pageNo: pageIndex};
        if (tab.id != '') {
            params.status = tab.id;
        }
        return request.get('/paimai/api/members/orders', {params: params});
    }

    //@ts-ignore
    renderOrderButtons(data) {
        return <View className={'text-gray-400'}>{data.type_dictText}</View>;
    }

    renderTemplate(data: any) {
        return (
            <View className={classNames('bg-white rounded-lg overflow-hidden shadow-outer p-4 relative')}>
                <Navigator url={'/order/pages/orders/detail?id=' + data.id} className={'space-y-4'}>
                    <View className={'text-sm flex items-center justify-between'}>
                        <View className={'text-gray-400'}>
                            单号：{data.id}
                        </View>
                        {data.status == -1 && <View className={'text-gray-400 font-bold text-lg'}>{ORDER_STATUS[data.status]}</View>}
                        {data.status == 0 && <View className={'text-red-400 font-bold text-lg'}>{ORDER_STATUS[data.status]}</View>}
                        {data.status == 1 && <View className={'text-blue-400 font-bold text-lg'}>{ORDER_STATUS[data.status]}</View>}
                        {data.status == 2 && <View className={'text-red-400 font-bold text-lg'}>{ORDER_STATUS[data.status]}</View>}
                        {data.status == 3 && <View className={'text-gray-400 font-bold text-lg'}>{ORDER_STATUS[data.status]}</View>}
                        {data.status == 4 && <View className={'text-red-400 font-bold text-lg'}>{ORDER_STATUS[data.status]}</View>}
                    </View>
                    {data.orderGoods.map((item: any) => {
                        return (
                            <View className={'flex space-x-2 items-center'}>
                                <View className={'flex-none'}><FallbackImage style={{width: 50, height: 50}} className={'rounded block'}
                                                                             src={utils.resolveUrl(item.goodsImage)}/></View>
                                <View className={'flex-1'}>
                                    <View>{item.goodsName}</View>
                                    <View>{numeral(item.goodsPrice).format('0,0.00')} X {item.goodsCount}</View>
                                </View>
                                <View className={'font-bold'}>￥{numeral(item.goodsPrice * item.goodsCount).format('0,0.00')}</View>
                            </View>
                        );
                    })}
                    <View className={'flex justify-between space-x-4 text-sm'}>
                        <View className={'text-gray-400'}>下单时间：{data.createTime}</View>
                        {this.renderOrderButtons(data)}
                    </View>
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
        if (status === null) return <PageLoading/>;
        return (
            <PageLayout statusBarProps={{title: '我的订单'}} enableReachBottom={true}>
                <ListView autoRefresh={true} showBottomSpace={false} tabs={this.state.tabs} dataFetcher={this.loadData} defaultActiveKey={this.state.status} />
            </PageLayout>
        );
    }
}
