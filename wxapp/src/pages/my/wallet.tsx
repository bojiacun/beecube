import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {Navigator, Text, View} from "@tarojs/components";
import LoginView from "../../components/login";
import {connect} from "react-redux";
import ListView, {ListViewTabItem} from "../../components/listview";

// @ts-ignore
@connect((state: any) => (
    {
        context: state.context
    }
))
export default class Index extends Component<any, any> {
    constructor(props) {
        super(props);
        this.handleWithdraw = this.handleWithdraw.bind(this);
        this.loadData = this.loadData.bind(this);

    }

    tabs: [
        {label: '全部', id: ''}, {label: '支出', id: '1'}, {label: '收入', id: '2'},{label: '充值', id: '3'},{label: '提现', id: '4'}
    ]


    loadData(pageIndex: number, tab: ListViewTabItem, index: number) {

    }

    handleWithdraw() {

    }
    render() {
        const {context} = this.props;
        const {userInfo} = context;
        const money = userInfo?.money ? (userInfo.money + '') : '0.00';

        return (
            <PageLayout statusBarProps={{title: '我的余额'}}>
                <LoginView refreshUserInfo={true}>
                    <View className={'p-4 my-2 mx-4 text-white bg-gradient-to-r from-indigo-300 to-indigo-500 rounded space-y-2'}>
                        <View>余额（元）</View>
                        <View><Text className={'text-xl'}>{money.split('.')[0]}</Text><Text className={'text-sm'}>.{money.split('.')[0]}</Text></View>
                        <View className={'flex space-x-2'}>
                            <Navigator className={'bg-white text-indigo rounded-full text-indigo-500 py-1 px-4'}>充值</Navigator>
                            <Text onClick={this.handleWithdraw} className={'text-white border-solid border-1 border-white bg-indigo-400 py-1 px-4 rounded-full'}>提现</Text>
                        </View>
                    </View>

                    <ListView
                        tabs={this.tabs}
                        dataFetcher={}
                    />
                </LoginView>
            </PageLayout>
        );
    }
}
