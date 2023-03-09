import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {Navigator, Text, View} from "@tarojs/components";
import {connect} from "react-redux";
import ListView, {ListViewTabItem} from "../../components/listview";
import request from "../../lib/request";

// @ts-ignore
@connect((state: any) => (
    {
        context: state.context
    }
))
export default class Index extends Component<any, any> {
    template: any;
    tabs: ListViewTabItem[];

    constructor(props) {
        super(props);
        this.handleWithdraw = this.handleWithdraw.bind(this);
        this.loadData = this.loadData.bind(this);
        this.template = (data: any) => {
            let money = data.money + '';
            return (
                <View className={'bg-white px-4 py-2'}>
                    <View className={'flex justify-between'}>
                        <Text>{data.descripiton}</Text>
                        <View className={'text-gray-800'}>
                            <Text className={'text-lg'}>{money.split('.')[0]}</Text>
                            <Text className={'text-sm'}>.{money.split(',')[1]}</Text>
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


    loadData(pageIndex: number, tab: ListViewTabItem) {
        return request.get('/app/api/members/money/records', {params: {page: pageIndex, type: tab.id}});
    }

    handleWithdraw() {

    }

    render() {
        const {context} = this.props;
        const {userInfo} = context;
        const money = userInfo?.money ? (userInfo.money + '') : '0.00';

        return (
            <PageLayout statusBarProps={{title: '我的余额'}}>
                <View className={'p-4 my-2 mx-4 text-white bg-gradient-to-r from-indigo-300 to-indigo-500 rounded space-y-2'}>
                    <View>余额（元）</View>
                    <View><Text className={'text-xl'}>{money.split('.')[0]}</Text><Text className={'text-sm'}>.{money.split('.')[0]}</Text></View>
                    <View className={'flex space-x-2'}>
                        <Navigator className={'bg-white text-indigo rounded-full text-indigo-500 py-1 px-4'}>充值</Navigator>
                        <Text onClick={this.handleWithdraw}
                              className={'text-white border-solid border-1 border-white bg-indigo-400 py-1 px-4 rounded-full'}>提现</Text>
                    </View>
                </View>

                <ListView
                    tabs={this.tabs}
                    dataFetcher={this.loadData}
                    tabStyle={2}
                />
            </PageLayout>
        );
    }
}
