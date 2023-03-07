import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import ListView, {ListViewTabItem} from "../../components/listview";
import request from "../../lib/request";
import classNames from "classnames";
import {Navigator, View} from "@tarojs/components";
const numeral = require('numeral');

export default class Index extends Component<any, any> {
    state = {
        tabs: [
            {label: '全部', id: '', template: this.renderTemplate},
            {label: '待支付', id: '0', template: this.renderTemplate},
            {label: '待发货', id: '1', template: this.renderTemplate},
            {label: '待收货', id: '2', template: this.renderTemplate},
            {label: '已完成', id: '3', template: this.renderTemplate},
            {label: '售后', id: '4', template: this.renderTemplate},
        ],
        status: '',
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
        let params: any = {type: 1, column: 'create_time', orderBy: 'desc', pageNo: pageIndex};
        if (tab.id != '') {
            params.status = tab.id;
        }
        return request.get('/paimai/api/goods/orders', {params: params});
    }

    renderTemplate(data: any) {
        return (
            <View className={classNames('bg-white rounded-lg overflow-hidden shadow-outer')}>
                <Navigator url={'/pages/my/orders/detail?id=' + data.id}>

                </Navigator>
            </View>
        );
    }

    componentDidMount() {

    }

    onPullDownRefresh() {

    }

    render() {
        return (
            <PageLayout statusBarProps={{title: '我的订单'}} enableReachBottom={true}>
                <ListView tabs={this.state.tabs} dataFetcher={this.loadData} defaultActiveKey={this.state.status} />
            </PageLayout>
        );
    }
}
