import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {Navigator, Text, View} from "@tarojs/components";
import {connect} from "react-redux";
import ListView, {ListViewTabItem} from "../../components/listview";
import request from "../../lib/request";
import Taro from "@tarojs/taro";
import utils from "../../lib/utils";

const numeral = require('numeral');

// @ts-ignore
@connect((state: any) => (
    {
        context: state.context,
        systemInfo: state.context.systemInfo,
    }
))
export default class Index extends Component<any, any> {
    state: any = {
        userInfo: null,
    }
    template: any;
    tabs: ListViewTabItem[];

    constructor(props) {
        super(props);
        this.handleWithdraw = this.handleWithdraw.bind(this);
        this.loadData = this.loadData.bind(this);
        this.template = (data: any) => {
            let money = numeral(data.money).format('0.00');
            return (
                <View className={'bg-white px-4 py-2'}>
                    <View className={'flex justify-between'}>
                        <Text>{data.description}</Text>
                        <View className={'text-gray-800 font-bold'}>
                            <Text className={'text-lg'}>{money.split('.')[0]}</Text>
                            <Text className={'text-sm'}>.{money.split('.')[1]}</Text>
                        </View>
                    </View>
                    <View className={'text-sm text-gray-300'}>{data.createTime}</View>
                </View>
            )
        };
        this.tabs = [
            {label: '全部', id: '', template: this.template},
            {label: '支出', id: '1', template: this.template},
            {label: '收入', id: '2', template: this.template},
            {label: '充值', id: '3', template: this.template},
            {label: '提现', id: '4', template: this.template}
        ];
    }

    types: {
        1: '支出',
        2: "收入",
        3: '充值',
        4: '提现'
    }


    componentDidShow() {
        //刷新余额
        request.get('/app/api/members/profile').then(res => {
            this.setState({userInfo: res.data.result});
        });
    }


    loadData(pageIndex: number, tab: ListViewTabItem) {
        return request.get('/app/api/members/money/records', {params: {pageNo: pageIndex, type: tab.id, status: 1}});
    }

    handleWithdraw() {
        Taro.navigateTo({url: '/pages/my/wallet/withdraw'}).then();
    }

    render() {
        const {userInfo} = this.state;
        const {systemInfo} = this.props;
        const money = userInfo?.money ? numeral(userInfo.money).format('0.00') : '0.00';
        const barTop = systemInfo.statusBarHeight;
        const menuButtonInfo = Taro.getMenuButtonBoundingClientRect();
        // 获取导航栏高度
        const barHeight = menuButtonInfo.height + (menuButtonInfo.top - barTop) * 2;
        return (
            <PageLayout showStatusBar={false} style={{background: 'url(https://static.winkt.cn/wallet-bg.png) no-repeat top', backgroundSize: 'contain'}}>
                <View className={'flex items-center justify-center text-lg relative text-white'} style={{height: barHeight + barTop, paddingTop: barTop}}>
                    我的钱包
                    <Text className={'fa fa-chevron-left absolute left-5'} onClick={() => utils.navigateBack()}/>
                </View>
                <View className={'p-4 my-2 mx-4 rounded space-y-2'}>
                    <View>我的余额（元）</View>
                    <View>
                        <Text className={'text-sm'}>￥</Text>
                        <Text className={'text-4xl'}>{money.split('.')[0]}</Text>
                        <Text className={'text-sm'}>.{money.split('.')[1]}</Text>
                    </View>
                    <View className={'flex space-x-2'}>
                        <Navigator url={'/pages/my/wallet/charge'} className={'bg-white rounded-full text-yellow-800 text-lg py-2 px-6'}>充值</Navigator>
                        <Text onClick={this.handleWithdraw}
                              className={'text-white bg-yellow-800 py-2 px-6 rounded-full text-lg'}>提现</Text>
                    </View>
                </View>
                <View className={'m-4 rounded-lg bg-white overflow-hidden'}>
                    <ListView
                        tabs={this.tabs}
                        dataFetcher={this.loadData}
                        tabStyle={2}
                        fixed={false}
                        autoRefresh={true}
                    />
                </View>
            </PageLayout>
        );
    }
}
