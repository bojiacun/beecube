import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {Navigator, Text, View} from "@tarojs/components";
import classNames from "classnames";
import styles from './center.module.scss';
import Taro from "@tarojs/taro";
import {connect} from "react-redux";
import {setUserInfo} from "../../store/actions";
import PageLoading from "../../components/pageloading";
import numeral from 'numeral';
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

    componentDidMount() {
        Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: 'transparent'}).then();
    }

    render() {
        const {systemInfo, context} = this.props;
        const {userInfo} = context;
        if (userInfo == null) return <PageLoading/>;
        const barTop = systemInfo.statusBarHeight;
        const menuButtonInfo = Taro.getMenuButtonBoundingClientRect();
        // 获取导航栏高度
        const barHeight = menuButtonInfo.height + (menuButtonInfo.top - barTop) * 2
        return (
            <PageLayout showStatusBar={false}>
                <View className={classNames('text-white flex flex-col px-4', styles.userProfile)} style={{paddingTop: barTop}}>
                    <View className={'text-center text-lg'} style={{height: barHeight}}>积分中心</View>
                    <View className={classNames('flex flex-col items-center justify-center space-x-2')}>
                        <View className={'text-6xl text-center'}>{numeral(userInfo.score).format('0.00')}</View>
                        <Navigator url={'records'}>积分明细</Navigator>
                    </View>
                    <View className={'rounded-md bg-white text-gray-800 mt-8 p-4'}>
                        <View className={'flex justify-between items-center'}>
                            <View className={'font-bold text-lg'}>签到赚积分</View>
                            <View className={''}>已签2/7</View>
                        </View>
                    </View>
                    <View className={'rounded-md bg-white text-gray-800 mt-2 p-4'}>
                        <View className={'flex justify-between items-center'}>
                            <View className={'font-bold text-lg'}>做任务赚积分</View>
                        </View>
                    </View>
                </View>

            </PageLayout>
        );
    }
}
