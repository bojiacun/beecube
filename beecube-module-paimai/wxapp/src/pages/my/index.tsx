import {Component, PropsWithChildren} from "react";
import Taro from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import {Button, Navigator, Text, View} from "@tarojs/components";
import {Button as TaroifyButton} from '@taroify/core';
import {connect} from "react-redux";
import styles from './index.module.scss';
import classNames from "classnames";
import avatar from '../../assets/images/avatar.png';
import FallbackImage from "../../components/FallbackImage";
import request from "../../lib/request";
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
export default class Index extends Component<PropsWithChildren<any>> {
    state: any = {
        liveRoom: null,
        badges: null
    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    componentDidShow() {
        request.get('/app/api/members/profile').then(res => {
            this.props.updateUserInfo(res.data.result);
            //刷新订单角标提醒
            request.get('/paimai/api/members/quotas').then(res => {
                this.setState({badges: res.data.result})
            });
        });
    }

    componentDidHide() {
    }

    render() {
        const {systemInfo, context} = this.props;
        const {userInfo} = context;
        const {badges} = this.state;

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
                    className={classNames('text-white flex flex-col p-4', styles.userProfile)}
                    style={{paddingTop: barTop + barHeight}}
                >
                    <View className={classNames('flex items-center justify-between space-x-2 mt-4')}>
                        <View className={'flex items-center space-x-2'}>
                            <FallbackImage className={'rounded-full'} src={userInfo?.avatar} errorImage={avatar}
                                           style={{width: Taro.pxTransform(52), height: Taro.pxTransform(52)}}/>
                            <View className={'space-y-1 flex flex-col'}>
                                <View className={'text-lg'}>{userInfo?.realname || userInfo?.nickname || '微信用户'}</View>
                                <View className={'text-yellow-400'}><Text className={'iconfont icon-wodejifen1'} />我的积分：{userInfo?.score}</View>
                            </View>
                        </View>
                        <Navigator url={'/integral/member/center'} openType={'navigate'}>
                            <TaroifyButton size={'small'} shape={'round'} style={{ background: "linear-gradient(to right, #e2a786, #d0231c)", color: "#fff", border: 'none' }}>
                                <Text>
                                    每日签到
                                </Text>
                                <Text className={'iconfont icon-youjiantou_huaban'} />
                            </TaroifyButton>
                        </Navigator>
                    </View>
                    <View className={'grid grid-cols-4 my-4 divide-x divide-red-900'}>
                        <View className={'text-center'}>
                            <Navigator className={'w-full'} url={'coupons'}>
                                <View className={'text-xl'}>{badges?.ticketCount}</View>
                                <View>优惠券</View>
                            </Navigator>
                        </View>
                        <View className={'text-center'}>
                            <Navigator url={'wallet'}>
                                <View className={'text-xl'}>{numeral(userInfo?.money).format('0,0.00')}</View>
                                <View>我的钱包</View>
                            </Navigator>
                        </View>
                        <View className={'text-center'}>
                            <Navigator url={'follows'}>
                                <View className={'text-xl'}>{badges?.goodsFollowCount}</View>
                                <View>收藏</View>
                            </Navigator>
                        </View>
                        <View className={'text-center'}>
                            <Navigator url={'views'}>
                                <View className={'text-xl'}>{badges?.goodsViewCount}</View>
                                <View>浏览足迹</View>
                            </Navigator>
                        </View>
                    </View>
                    <View className={'rounded-md bg-white mt-2 py-4 text-black'}>
                        <View className={'item-title font-bold text-lg ml-4 mb-4'}>我的参拍</View>
                        <View className={'grid grid-cols-5 gap-1 text-center'}>
                            <Navigator url={'goods?tab=0'} className={'relative'}>
                                <View className={'iconfont icon-daikaishi'} style={{fontSize: 24}}/>
                                <View className={'mt-2'}>待开始</View>
                            </Navigator>
                            <Navigator url={'goods?tab=1'} className={'relative'}>
                                <View className={'iconfont icon-canpaizhong1'} style={{fontSize: 24}}/>
                                <View className={'mt-2'}>参拍中</View>
                            </Navigator>
                            <Navigator url={'goods?tab=2'} className={'relative'}>
                                <View className={'iconfont icon-yihuopai1'} style={{fontSize: 24}}/>
                                <View className={'mt-2'}>已获拍</View>
                            </Navigator>
                            <Navigator url={'goods?tab=3'}>
                                <View className={'iconfont icon-weihuopai1'} style={{fontSize: 24}}/>
                                <View className={'mt-2'}>未获拍</View>
                            </Navigator>
                            <Navigator url={'deposits'} className={'border-l-1 border-gray-100'}>
                                <View className={'iconfont icon-baozhengjin2'} style={{fontSize: 24}}/>
                                <View className={'mt-2'}>保证金</View>
                            </Navigator>
                        </View>
                    </View>
                </View>

                <View className={'rounded-md bg-white mx-4 py-4'}>
                    <View className={'item-title font-bold text-lg ml-4 text-black mb-4'}>我的订单</View>
                    <View className={'grid grid-cols-5 gap-1 text-center'}>
                        <Navigator url={'/order/pages/orders?status=0'} className={'relative'}>
                            <View className={'iconfont icon-daifukuan1'} style={{fontSize: 24}}/>
                            <View className={'mt-2'}>待结算</View>
                            {badges?.payCount ? <Text className={'badge'}>{badges.payCount}</Text> : <></>}
                        </Navigator>
                        <Navigator url={'/order/pages/orders?status=1'} className={'relative'}>
                            <View className={'iconfont icon-daifahuo2'} style={{fontSize: 24}}/>
                            <View className={'mt-2'}>待发货</View>
                            {badges?.deliveryCount ? <Text className={'badge'}>{badges.deliveryCount}</Text> : <></>}
                        </Navigator>
                        <Navigator url={'/order/pages/orders?status=2'} className={'relative'}>
                            <View className={'iconfont icon-daishouhuo2'} style={{fontSize: 24}}/>
                            <View className={'mt-2'}>待收货</View>
                            {badges?.confirmDeliveryCount ? <Text className={'badge'}>{badges.confirmDeliveryCount}</Text> : <></>}
                        </Navigator>
                        <Navigator url={'/order/pages/orders?status=3'}>
                            <View className={'iconfont icon-yiwancheng2'} style={{fontSize: 24}}/>
                            <View className={'mt-2'}>已完成</View>
                        </Navigator>
                        <Navigator url={'/order/pages/orders?status='} className={'border-l-1 border-gray-100'}>
                            <View className={'iconfont icon-quanbudingdan1'} style={{fontSize: 24}}/>
                            <View className={'mt-2'}>全部</View>
                        </Navigator>
                    </View>
                </View>
                <View className={'m-4 bg-white divide-y divide-gray-100 text-black'}>
                    <View>
                        <Navigator url={'addresses'} className={'flex items-center justify-between p-4'}>
                            <View className={'flex items-center space-x-2'}>
                                <View>地址管理</View>
                            </View>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-youjiantou_huaban'}/>
                            </View>
                        </Navigator>
                    </View>
                    <View>
                        <Navigator url={'/order/pages/taxs'} className={'flex items-center justify-between p-4'}>
                            <View className={'flex items-center space-x-2'}>
                                <View>发票管理</View>
                            </View>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-youjiantou_huaban'}/>
                            </View>
                        </Navigator>
                    </View>
                    <View>
                        <Navigator url={'/integral/member/center'} className={'flex items-center justify-between p-4'}>
                            <View className={'flex items-center space-x-2'}>
                                <View>积分中心</View>
                            </View>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-youjiantou_huaban'}/>
                            </View>
                        </Navigator>
                    </View>
                    <View>
                        <Navigator url={'qrcode'} className={'flex items-center justify-between p-4'}>
                            <View className={'flex items-center space-x-2'}>
                                <View>我的二维码</View>
                            </View>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-youjiantou_huaban'}/>
                            </View>
                        </Navigator>
                    </View>
                    <View>
                        <Navigator url={'/article/pages/services'} className={'flex items-center justify-between p-4'}>
                            <View className={'flex items-center space-x-2'}>
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
                                <View>联系客服</View>
                            </View>
                            <View className={'flex items-center space-x-2'}>
                                <View className={'iconfont icon-youjiantou_huaban'}/>
                            </View>
                        </Button>
                    </View>

                    {/*{this.state.liveRoom &&*/}
                    {/*    <View>*/}
                    {/*        <Navigator url={`/live/pages/room?roomId=${this.state.liveRoom.id}&loginType=anchor&roomName=${this.state.liveRoom.title}`} className={'flex items-center justify-between p-4'}>*/}
                    {/*            <View className={'flex items-center space-x-2'}>*/}
                    {/*                <View className={'fa fa-video-camera'} style={{fontSize: 18}}/>*/}
                    {/*                <View>{this.state.liveRoom.title}</View>*/}
                    {/*            </View>*/}
                    {/*            <View className={'flex items-center space-x-2'}>*/}
                    {/*                <View className={'iconfont icon-youjiantou_huaban'}/>*/}
                    {/*            </View>*/}
                    {/*        </Navigator>*/}
                    {/*    </View>*/}
                    {/*}*/}
                </View>
            </PageLayout>
        )
    }
}

