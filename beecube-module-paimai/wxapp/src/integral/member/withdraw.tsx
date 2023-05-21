import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {Input, Navigator, Text, View} from "@tarojs/components";
import classNames from "classnames";
import styles from './center.module.scss';
import Taro from "@tarojs/taro";
import {connect} from "react-redux";
import {setUserInfo} from "../../store/actions";
import PageLoading from "../../components/pageloading";
import numeral from 'numeral';
import {Button} from "@taroify/core";
import utils from "../../lib/utils";
import request from "../../lib/request";
// @ts-ignore
@connect((state: any) => (
    {
        systemInfo: state.context.systemInfo,
        settings: state.context.settings,
        context: state.context
    }
), (dispatch) => {
    return {
        updateUserInfo(userInfo) {
            dispatch(setUserInfo(userInfo));
        }
    }
})
export default class Index extends Component<any, any> {
    state:any = {
        posting: false,
        amount: null,
    }

    constructor(props) {
        super(props);
        this.inputAll = this.inputAll.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate() {
    }

    componentDidMount() {
        Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: 'transparent'}).then();
    }

    inputAll() {
        const {userInfo} = this.props.context;
        // @ts-ignore
        this.setState({amount: userInfo.score});
    }
    handleInput(e) {
        this.setState({amount: e.detail.value});
    }

    handleSubmit() {
        this.setState({posting: true});
        request.post('/app/api/members/scores/withdraw', {amount: this.state.amount}).then(()=>{
            utils.showSuccess(true, '申请成功，等待审核');
        });
    }

    render() {
        const {systemInfo, context, settings} = this.props;
        const {userInfo} = context;
        if (userInfo == null) return <PageLoading/>;


        const barTop = systemInfo.statusBarHeight;
        const menuButtonInfo = Taro.getMenuButtonBoundingClientRect();
        // 获取导航栏高度
        const barHeight = menuButtonInfo.height + (menuButtonInfo.top - barTop) * 2;

        return (
            <PageLayout showStatusBar={false}>
                <View className={classNames('text-white flex flex-col px-4 relative', styles.userProfile)} style={{paddingTop: barTop}}>
                    <View className={'flex items-center justify-center text-lg relative'} style={{height: barHeight}}>
                        积分提现
                        <Text className={'fa fa-chevron-left absolute left-0'} onClick={() => utils.navigateBack()}/>
                    </View>
                    <View className={classNames('mt-6 relative flex flex-col justify-center space-x-2')}>
                        <Navigator url={'records'}>当前可用积分</Navigator>
                        <View className={'mt-2'}>
                            <Text className={'fa fa-diamond'} />
                            <Text className={'text-4xl ml-4'}>
                                {numeral(userInfo.score).format('0.00')}
                            </Text>
                        </View>
                    </View>
                    <View className={'rounded-md bg-white text-gray-800 mt-8 p-4'}>
                        <View className={'flex justify-between items-center mb-4'}>
                            <View className={'font-bold text-lg'}>提现积分</View>
                        </View>
                        <View className={'flex justify-between items-center mb-4 space-x-4 text-lg'}>
                            <View className={'font-bold flex-none text-3xl'}>￥</View>
                            <Input value={this.state.amount} onInput={this.handleInput} className={'flex-1'} placeholder={`满${settings.minWithdrawIntegral}积分方可提现`} />
                            <View className={'font-bold flex-none text-red-600'} onClick={this.inputAll}>全部提现</View>
                        </View>
                        <View className={'flex justify-between items-center mb-4'}>
                            <View className={'font-bold'}>提现至</View>
                            <View className={'font-bold'}>我的零钱</View>
                        </View>
                        <View className={'mt-4 flex flex-col justify-center space-y-4'}>
                            <Button onClick={this.handleSubmit} disabled={!this.state.amount} color={'danger'} shape={'round'} block loading={this.state.posting}>立即提现</Button>
                            <View className={'text-stone-400'}>
                                <View>提现规则：</View>
                                <View>1、{settings.integralToMoney.split(':')[0]}积分={settings.integralToMoney.split(':')[1]}元（人民币）</View>
                                <View>2、单次提现积分需大于等于{settings.minWithdrawIntegral}积分</View>
                            </View>
                        </View>
                    </View>
                </View>
            </PageLayout>
        );
    }
}
