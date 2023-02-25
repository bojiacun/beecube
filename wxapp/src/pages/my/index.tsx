import {Component, PropsWithChildren} from "react";
import Taro from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import {View, Text, Navigator} from "@tarojs/components";
import {connect} from "react-redux";
import styles from './index.module.scss';
import classNames from "classnames";
import avatar from '../../assets/images/avatar.png';
import FallbackImage from "../../components/FallbackImage";
import LoginView from "../../components/login";
import request from "../../lib/request";
import {UserInfo} from "../../context";
import utils from "../../lib/utils";
// @ts-ignore
@connect((state: any) => (
    {
        systemInfo: state.context.systemInfo,
        settings: state.context.settings,
        context: state.context
    }
))
export default class Index extends Component<PropsWithChildren<any>> {
    state:MyIndexViewState = {
        userInfo : undefined,
    }

    componentWillMount() {
        this.setState({userInfo: this.props.context.userInfo});
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    componentDidShow() {
        utils.showLoading();
        request.get('/app/api/members/profile').then(res=>{
            this.setState({userInfo: res.data.result});
        })
    }

    componentDidHide() {
    }

    render() {
        const {systemInfo} = this.props;
        const {userInfo} = this.state;

        // @ts-ignore
        return (
            <PageLayout showTabBar={true} showStatusBar={false}>
                <LoginView refreshUserInfo={true}>
                    <View
                        className={classNames('text-white flex flex-col px-4', styles.userProfile)}
                        style={{paddingTop: Taro.pxTransform(systemInfo.safeArea.top + 40)}}
                    >
                        <View className={classNames('flex items-center justify-between space-x-2')}>
                            <View className={'flex items-center space-x-2'}>
                                <FallbackImage src={userInfo?.avatar} errorImage={avatar} style={{width: Taro.pxTransform(52), height: Taro.pxTransform(52)}}/>
                                <View className={'space-y-1 flex flex-col'}>
                                    <Text>{userInfo?.realname || userInfo?.nickname || '微信用户'}</Text>
                                    <Text>{userInfo?.username}</Text>
                                </View>
                            </View>
                            <Navigator url={'profile'} openType={'navigate'}><Text className={'iconfont icon-31shezhi'} style={{fontSize: 24}}/></Navigator>
                        </View>
                        <View className={'grid grid-cols-4 gap-4 text-center mt-4'}>
                            <View>
                                <View className={'iconfont icon-paimai'} style={{fontSize: 24}}/>
                                <View>参拍</View>
                            </View>
                            <View>
                                <View className={'iconfont icon-baozhengjin'} style={{fontSize: 24}}/>
                                <View>保证金</View>
                            </View>
                            <View>
                                <View className={'iconfont icon-31guanzhu1'} style={{fontSize: 24}}/>
                                <View>关注</View>
                            </View>
                            <View>
                                <View className={'iconfont icon-zuji'} style={{fontSize: 24}}/>
                                <View>足迹</View>
                            </View>
                        </View>
                        <View className={'rounded-md bg-white mt-2 text-blue-600 py-4 shadow-lg'}>
                            <View className={'grid grid-cols-5 gap-1 text-center'}>
                                <View>
                                    <View className={'iconfont icon-daizhifudingdan'} style={{fontSize: 24}}/>
                                    <View className={'text-gray-500 mt-1 text-sm'}>待结算</View>
                                </View>
                                <View>
                                    <View className={'iconfont icon-daifahuo'} style={{fontSize: 24}}/>
                                    <View className={'text-gray-500 mt-1'}>待发货</View>
                                </View>
                                <View>
                                    <View className={'iconfont icon-daishouhuo'} style={{fontSize: 24}}/>
                                    <View className={'text-gray-500 mt-1'}>待收货</View>
                                </View>
                                <View>
                                    <View className={'iconfont icon-yiwancheng'} style={{fontSize: 24}}/>
                                    <View className={'text-gray-500 mt-1'}>已完成</View>
                                </View>
                                <View className={'border-l-1 border-gray-100'}>
                                    <View className={'iconfont icon-quanbu'} style={{fontSize: 24}}/>
                                    <View className={'text-gray-500 mt-1'}>全部</View>
                                </View>
                            </View>
                        </View>

                    </View>
                    <View className={'mt-6 bg-white divide-y divide-gray-100 text-gray-600'}>
                        <View className={'flex items-center justify-between py-2.5 px-4'}>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-qianbao'} style={{fontSize: 24}}/>
                                <View>我的余额</View>
                            </View>
                            <View className={'flex items-center space-x-2'}>
                                <View>
                                    RMB 0
                                </View>
                                <View className={'iconfont icon-youjiantou_huaban'}/>
                            </View>
                        </View>

                        <View className={'flex items-center justify-between py-2.5 px-4'}>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-zhuanzhang'} style={{fontSize: 24}}/>
                                <View>转账记录</View>
                            </View>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-youjiantou_huaban'}/>
                            </View>
                        </View>


                        <View className={'flex items-center justify-between py-2.5 px-4'}>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-dizhiguanli'} style={{fontSize: 24}}/>
                                <View>地址管理</View>
                            </View>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-youjiantou_huaban'}/>
                            </View>
                        </View>

                        <View className={'flex items-center justify-between py-2.5 px-4'}>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-quanbu'} style={{fontSize: 24}}/>
                                <View>我的二维码</View>
                            </View>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-youjiantou_huaban'}/>
                            </View>
                        </View>


                        <View className={'flex items-center justify-between py-2.5 px-4'}>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-shangchuan'} style={{fontSize: 24}}/>
                                <View>我的送拍</View>
                            </View>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-youjiantou_huaban'}/>
                            </View>
                        </View>

                        <View className={'flex items-center justify-between py-2.5 px-4'}>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-kaipiaoxinxi'} style={{fontSize: 24}}/>
                                <View>开具发票</View>
                            </View>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-youjiantou_huaban'}/>
                            </View>
                        </View>


                        <View className={'flex items-center justify-between py-2.5 px-4'}>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-zhanghu'} style={{fontSize: 24}}/>
                                <View>公司账户</View>
                            </View>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-youjiantou_huaban'}/>
                            </View>
                        </View>


                        <View className={'flex items-center justify-between py-2.5 px-4'}>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-bangzhuzhongxin'} style={{fontSize: 24}}/>
                                <View>帮助中心</View>
                            </View>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-youjiantou_huaban'}/>
                            </View>
                        </View>


                        <View className={'flex items-center justify-between py-2.5 px-4'}>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-lianxikefu'} style={{fontSize: 24}}/>
                                <View>联系客服</View>
                            </View>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-youjiantou_huaban'}/>
                            </View>
                        </View>

                    </View>
                </LoginView>
            </PageLayout>
        )
    }
}

interface MyIndexViewState extends Partial<any> {
    userInfo?: UserInfo;
}
