import {Component, PropsWithChildren} from "react";
import Taro from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import {View, Text, Navigator, Button} from "@tarojs/components";
import {connect} from "react-redux";
import styles from './index.module.scss';
import classNames from "classnames";
import avatar from '../../assets/images/avatar.png';
import FallbackImage from "../../components/FallbackImage";
import request from "../../lib/request";
import {setUserInfo} from "../../store/actions";
import PageLoading from "../../components/pageloading";
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
export default class Index extends Component<PropsWithChildren<any>> {

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    componentDidShow() {
        request.get('/app/api/members/profile').then(res => {
            //刷新用户
            this.props.updateUserInfo(res.data.result);
        });
    }

    componentDidHide() {
    }

    render() {
        const {systemInfo, context} = this.props;
        const {userInfo} = context;

        if (userInfo == null) return <PageLoading/>;
        // 获取距上
        const barTop = systemInfo.statusBarHeight;
        const menuButtonInfo = Taro.getMenuButtonBoundingClientRect();
        // 获取导航栏高度
        const barHeight = menuButtonInfo.height + (menuButtonInfo.top - barTop) * 2

        // @ts-ignore
        return (
            <PageLayout showTabBar={true} showStatusBar={false} copyright={context.copyright}>
                <View
                    className={classNames('text-white flex flex-col px-4', styles.userProfile)}
                    style={{paddingTop: barTop + barHeight}}
                >
                    <View className={classNames('flex items-center justify-between space-x-2')}>
                        <View className={'flex items-center space-x-2'}>
                            <FallbackImage className={'rounded-full'} src={userInfo?.avatar} errorImage={avatar}
                                           style={{width: Taro.pxTransform(52), height: Taro.pxTransform(52)}}/>
                            <View className={'space-y-1 flex flex-col'}>
                                <Text>{userInfo?.realname || userInfo?.nickname || '微信用户'}</Text>
                                <Text>{userInfo?.phone}</Text>
                            </View>
                        </View>
                        <Navigator url={'profile'} openType={'navigate'}><Text className={'iconfont icon-31shezhi'}
                                                                               style={{fontSize: 24}}/></Navigator>
                    </View>
                    <View className={'grid grid-cols-4 gap-4 text-center mt-4'}>
                        <Navigator url={'offers'}>
                            <View className={'iconfont icon-paimai'} style={{fontSize: 24}}/>
                            <View>参拍</View>
                        </Navigator>
                        <Navigator url={'deposits'}>
                            <View className={'iconfont icon-baozhengjin'} style={{fontSize: 24}}/>
                            <View>保证金</View>
                        </Navigator>
                        <Navigator url={'follows'}>
                            <View className={'iconfont icon-31guanzhu1'} style={{fontSize: 24}}/>
                            <View>关注</View>
                        </Navigator>
                        <Navigator url={'views'}>
                            <View className={'iconfont icon-zuji'} style={{fontSize: 24}}/>
                            <View>足迹</View>
                        </Navigator>
                    </View>
                    <View className={'rounded-md bg-white mt-2 text-red-600 py-4 shadow-lg'}>
                        <View className={'grid grid-cols-5 gap-1 text-center'}>
                            <Navigator url={'orders?status=0'}>
                                <View className={'iconfont icon-daizhifudingdan'} style={{fontSize: 24}}/>
                                <View className={'text-gray-500 mt-1'}>待结算</View>
                            </Navigator>
                            <Navigator url={'orders?status=1'}>
                                <View className={'iconfont icon-daifahuo'} style={{fontSize: 24}}/>
                                <View className={'text-gray-500 mt-1'}>待发货</View>
                            </Navigator>
                            <Navigator url={'orders?status=2'}>
                                <View className={'iconfont icon-daishouhuo'} style={{fontSize: 24}}/>
                                <View className={'text-gray-500 mt-1'}>待收货</View>
                            </Navigator>
                            <Navigator url={'orders?status=3'}>
                                <View className={'iconfont icon-yiwancheng'} style={{fontSize: 24}}/>
                                <View className={'text-gray-500 mt-1'}>已完成</View>
                            </Navigator>
                            <Navigator url={'orders?status='} className={'border-l-1 border-gray-100'}>
                                <View className={'iconfont icon-quanbu'} style={{fontSize: 24}}/>
                                <View className={'text-gray-500 mt-1'}>全部</View>
                            </Navigator>
                        </View>
                    </View>

                </View>
                <View className={'mt-4 bg-white divide-y divide-gray-100 text-gray-600'}>
                    <View>
                        <Navigator url={'wallet'} className={'flex items-center justify-between p-4'}>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-qianbao'} style={{fontSize: 24}}/>
                                <View>我的余额</View>
                            </View>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'font-bold'}>
                                    RMB {userInfo.money}
                                </View>
                                <View className={'iconfont icon-youjiantou_huaban'}/>
                            </View>
                        </Navigator>
                    </View>

                    {/*<View className={'flex items-center justify-between p-4'}>*/}
                    {/*    <View className={'flex items-center space-x-2'}>*/}
                    {/*        <View className={'iconfont icon-zhuanzhang'} style={{fontSize: 24}}/>*/}
                    {/*        <View>转账记录</View>*/}
                    {/*    </View>*/}
                    {/*    <View className={'flex items-center space-x-2'}>*/}
                    {/*        <View className={'iconfont icon-youjiantou_huaban'}/>*/}
                    {/*    </View>*/}
                    {/*</View>*/}


                    <View>
                        <Navigator url={'addresses'} className={'flex items-center justify-between p-4'}>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-dizhiguanli'} style={{fontSize: 24}}/>
                                <View>地址管理</View>
                            </View>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-youjiantou_huaban'}/>
                            </View>
                        </Navigator>
                    </View>

                    <View>
                        <Navigator url={'qrcode'} className={'flex items-center justify-between p-4'}>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-quanbu'} style={{fontSize: 24}}/>
                                <View>我的二维码</View>
                            </View>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-youjiantou_huaban'}/>
                            </View>
                        </Navigator>
                    </View>


                    {/*<View className={'flex items-center justify-between p-4'}>*/}
                    {/*    <View className={'flex items-center space-x-2'}>*/}
                    {/*        <View className={'iconfont icon-shangchuan'} style={{fontSize: 24}}/>*/}
                    {/*        <View>我的送拍</View>*/}
                    {/*    </View>*/}
                    {/*    <View className={'flex items-center space-x-2'}>*/}
                    {/*        <View className={'iconfont icon-youjiantou_huaban'}/>*/}
                    {/*    </View>*/}
                    {/*</View>*/}

                    {/*<View className={'flex items-center justify-between p-4'}>*/}
                    {/*    <View className={'flex items-center space-x-2'}>*/}
                    {/*        <View className={'iconfont icon-kaipiaoxinxi'} style={{fontSize: 24}}/>*/}
                    {/*        <View>开具发票</View>*/}
                    {/*    </View>*/}
                    {/*    <View className={'flex items-center space-x-2'}>*/}
                    {/*        <View className={'iconfont icon-youjiantou_huaban'}/>*/}
                    {/*    </View>*/}
                    {/*</View>*/}


                    {/*<View className={'flex items-center justify-between p-4'}>*/}
                    {/*    <View className={'flex items-center space-x-2'}>*/}
                    {/*        <View className={'iconfont icon-zhanghu'} style={{fontSize: 24}}/>*/}
                    {/*        <View>公司账户</View>*/}
                    {/*    </View>*/}
                    {/*    <View className={'flex items-center space-x-2'}>*/}
                    {/*        <View className={'iconfont icon-youjiantou_huaban'}/>*/}
                    {/*    </View>*/}
                    {/*</View>*/}


                    <View>
                        <Navigator url={'/pages/articles/services'} className={'flex items-center justify-between p-4'}>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-bangzhuzhongxin'} style={{fontSize: 24}}/>
                                <View>帮助中心</View>
                            </View>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-youjiantou_huaban'}/>
                            </View>
                        </Navigator>
                    </View>

                    <View>
                        <Button plain={true} openType={'contact'} className={'flex items-center justify-between p-4'}>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-lianxikefu'} style={{fontSize: 24}}/>
                                <View>联系客服</View>
                            </View>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-youjiantou_huaban'}/>
                            </View>
                        </Button>
                    </View>

                </View>
            </PageLayout>
        )
    }
}

