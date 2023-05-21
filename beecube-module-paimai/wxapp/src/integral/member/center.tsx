import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {Navigator, ScrollView, Text, View} from "@tarojs/components";
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
import moment from "moment";
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
        signins: null,
    }

    constructor(props) {
        super(props);
        this.handleSignin = this.handleSignin.bind(this);
    }

    componentDidUpdate(prevProps: Readonly<any>) {
        if(prevProps.settings?.signinCycle && !this.state.signins) {
            request.get('/app/api/signin/info').then(res=>{
                const {settings} = this.props;
                let cycles = settings.signinCycle.split(',').map(integral => ({integral: integral, active: false}));
                res.data.result.forEach((msignin: any) => {
                    cycles[msignin.dayIndex - 1].active = true;
                });
                this.setState({signins: cycles});
            });
        }
    }

    componentDidMount() {
        Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: 'transparent'}).then();
    }

    handleSignin() {

    }

    render() {
        const {systemInfo, context, settings} = this.props;
        const {userInfo} = context;
        if (userInfo == null || !this.state.signins) return <PageLoading/>;


        const barTop = systemInfo.statusBarHeight;
        const menuButtonInfo = Taro.getMenuButtonBoundingClientRect();
        // 获取导航栏高度
        const barHeight = menuButtonInfo.height + (menuButtonInfo.top - barTop) * 2;
        const signins = this.state.signins.filter(s => s.active);
        const signInToday = signins.length > 0 && moment(signins[signins.length - 1].createTime).day() == moment().day();

        return (
            <PageLayout showStatusBar={false}>
                <View className={classNames('text-white flex flex-col px-4', styles.userProfile)} style={{paddingTop: barTop}}>
                    <View className={'flex items-center justify-center text-lg relative'} style={{height: barHeight}}>
                        积分中心
                        <Text className={'fa fa-chevron-left absolute left-0'} onClick={() => utils.navigateBack()}/>
                    </View>
                    <View className={classNames('flex flex-col items-center justify-center space-x-2')}>
                        <View className={'text-6xl text-center'}>{numeral(userInfo.score).format('0.00')}</View>
                        <Navigator url={'records'}>积分明细</Navigator>
                    </View>
                    <View className={'rounded-md bg-white text-gray-800 mt-8 p-4'}>
                        <View className={'flex justify-between items-center mb-4'}>
                            <View className={'font-bold text-lg'}>签到赚积分</View>
                            <View className={''}>已签{signins.length}/{this.state.signins.length}</View>
                        </View>
                        <ScrollView scrollX={true} type={'custom'}>
                        <View className={'grid grid-cols-7 gap-2'}>
                            {this.state.signins.map((signin:any, index) => {
                                if(signin.active) {
                                    return (
                                        <View className={'flex flex-col items-center justify-center'}>
                                            <View className={'bg-orange-100 flex flex-col items-center relative py-2 px-1 rounded text-red-600'}>
                                                <Text className={'font-bold text-lg'}>{signin.integral}</Text>
                                                <Text className={'text-sm'}>积分</Text>
                                                <Text className={'fa fa-check-circle absolute'} style={{right: 3, top: 3}}/>
                                            </View>
                                            <View className={'mt-2'}>第{index+1}天</View>
                                        </View>
                                    );
                                }
                                return (
                                    <View className={'flex flex-col items-center justify-center'}>
                                        <View className={'bg-stone-200 flex flex-col items-center relative py-2 px-1 rounded text-stone-600'}>
                                            <Text className={'font-bold text-lg'}>{signin.integral}</Text>
                                            <Text className={'text-sm'}>积分</Text>
                                        </View>
                                        <View className={'mt-2'}>第{index+1}天</View>
                                    </View>
                                );
                            })}
                        </View>
                        </ScrollView>
                        <View className={'mt-4 flex flex-col justify-center items-center space-y-4'}>
                            {signInToday ?
                                <Button color={'danger'} shape={'round'} disabled>今日已签到</Button>
                                :
                                <Button color={'danger'} shape={'round'} onClick={this.handleSignin} block>签到获得积分</Button>
                            }
                            <View className={'text-stone-400'}>签到7天为一个周期，断签重新开始</View>
                        </View>
                    </View>

                </View>
                <View className={'rounded-md bg-white text-gray-800 mt-2 p-4 mx-4 space-y-4'}>
                    <View className={'flex justify-between items-center'}>
                        <View className={'font-bold text-lg'}>做任务赚积分</View>
                    </View>
                    <View className={'flex items-center space-x-2'}>
                        <View style={{width: 50, height: 50}} className={'flex items-center justify-center bg-orange-100 text-red-600 rounded-full text-3xl'}>
                            <Text className={'fa fa-user-plus'}/>
                        </View>
                        <View className={'space-y-2 flex-1'}>
                            <View className={'font-bold'}>邀请新用户</View>
                            <View className={'text-stone-400 text-sm'}>成功邀请1位新用户，积分<Text className={'text-red-600 font-bold'}>+{settings.newMemberIntegral}</Text></View>
                        </View>
                        <View>
                            <Button color={'danger'} size={'small'} shape={'round'}>邀请好友</Button>
                        </View>
                    </View>
                    <View className={'flex items-center space-x-2'}>
                        <View style={{width: 50, height: 50}} className={'flex items-center justify-center bg-orange-100 text-red-600 rounded-full text-3xl'}>
                            <Text className={'fa fa-share-alt'}/>
                        </View>
                        <View className={'space-y-2 flex-1'}>
                            <View className={'font-bold'}>分享页面到朋友圈</View>
                            <View className={'text-stone-400 text-sm'}>单次分享积分<Text className={'text-red-600 font-bold'}>+{settings.shareIntegral}</Text></View>
                        </View>
                        <View onClick={() => Taro.reLaunch({url: '/pages/index/index'})}>
                            <Button color={'danger'} size={'small'} shape={'round'}>去分享</Button>
                        </View>
                    </View>
                    {settings.consumeIntegral == '1' &&
                        <View className={'flex items-center space-x-2'}>
                            <View style={{width: 50, height: 50}} className={'flex items-center justify-center bg-orange-100 text-red-600 rounded-full text-3xl'}>
                                <Text className={'fa fa-shopping-cart'}/>
                            </View>
                            <View className={'space-y-2 flex-1'}>
                                <View className={'font-bold'}>商城下单购物</View>
                                <View className={'text-stone-400 text-sm'}>下单即可获得积分</View>
                            </View>
                            <View onClick={() => Taro.reLaunch({url: '/pages/index/index'})}>
                                <Button color={'danger'} size={'small'} shape={'round'}>去下单</Button>
                            </View>
                        </View>
                    }
                    <View className={'flex items-center space-x-2'}>
                        <View style={{width: 50, height: 50}} className={'flex items-center justify-center bg-orange-100 text-red-600 rounded-full text-3xl'}>
                            <Text className={'fa fa-id-card-o'}/>
                        </View>
                        <View className={'space-y-2 flex-1'}>
                            <View className={'font-bold'}>实名认证</View>
                            <View className={'text-stone-400 text-sm'}>完成实名认证，积分<Text className={'text-red-600 font-bold'}>+{settings.authRealIntegral}</Text></View>
                        </View>
                        <View onClick={() => Taro.navigateTo({url: '/pages/my/profile'})}>
                            <Button color={'danger'} size={'small'} shape={'round'}>去认证</Button>
                        </View>
                    </View>
                    <View className={'flex items-center space-x-2'}>
                        <View style={{width: 50, height: 50}} className={'flex items-center justify-center bg-orange-100 text-red-600 rounded-full text-3xl'}>
                            <Text className={'fa fa-money'}/>
                        </View>
                        <View className={'space-y-2 flex-1'}>
                            <View className={'font-bold'}>余额充值</View>
                            <View className={'text-stone-400 text-sm'}>每日首次充值，积分<Text className={'text-red-600 font-bold'}>+{settings.rechargeIntegral}</Text></View>
                        </View>
                        <View onClick={() => Taro.navigateTo({url: '/pages/my/wallet'})}>
                            <Button color={'danger'} size={'small'} shape={'round'}>去充值</Button>
                        </View>
                    </View>
                </View>
            </PageLayout>
        );
    }
}
