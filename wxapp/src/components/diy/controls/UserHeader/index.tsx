import {Image, View, Navigator} from "@tarojs/components";
import withLogin from "../../../login/login";
import request, {
    API_MEMBER_CHILDREN_DEFAULT, API_MEMBER_INFO,
    API_SITES_INFO,
    resolveUrl, SERVICE_WINKT_MEMBER_HEADER,
    SERVICE_WINKT_SYSTEM_HEADER
} from "../../../../utils/request";
import util from "../../../../utils/we7/util";
import {useEffect, useState} from "react";
import Taro, {useDidShow} from "@tarojs/taro";
import {getSiteVip, refreshMemberInfo} from "../../../../global";
import moment from "moment";
import IconFont from "../../../iconfont/index.weapp";


const UserHeader = (props: any) => {
    const {data, style, basic, headerHeight, checkLogin, context, logout, makeLogin, ...rest} = props;
    const {userInfo} = context;
    const [site, setSite] = useState<any>();
    const [memberSiteLevel, setMemberSiteLevel] = useState<any>();
    const [child, setChild] = useState<any>();
    const isLogin = checkLogin();

    const loadData = (userInfo) => {
        if(userInfo?.memberInfo?.siteId) {
            request.get(API_SITES_INFO+"/"+userInfo.memberInfo.siteId, SERVICE_WINKT_SYSTEM_HEADER, null, false).then(res=>{
                setSite(res.data.data);
            });
            getSiteVip(userInfo.memberInfo.siteId, function(res){
                setMemberSiteLevel(res);
            });
        }
        else {
            setSite(null);
            setMemberSiteLevel(null);
        }
        if(userInfo?.memberInfo) {
            request.get(API_MEMBER_CHILDREN_DEFAULT, SERVICE_WINKT_MEMBER_HEADER, null, true).then(res => {
                setChild(res.data.data);
            });
        }
    }

    useEffect(()=>{
        loadData(userInfo);
    },[])

    useDidShow(()=>{
        //重新加载用户信息哦
        if(userInfo?.memberInfo) {
            request.get(API_MEMBER_INFO, SERVICE_WINKT_MEMBER_HEADER, null, true).then(res=>{
                let newInfo = refreshMemberInfo(res.data.data);
                loadData(newInfo);
            });
        }
    })

    const doLogin = () => {
        makeLogin((userInfo) => {
            //刷新用户
            loadData(userInfo);
        });
    }

    //跳转到管理中心
    const jumpManagerCenter = () => {
        if(userInfo?.memberInfo?.groupId) {
            Taro.navigateTo({url: '/manager/pages/index'}).then();
        }
    }

    return (
        <View {...rest} style={{...style, position: 'relative', paddingTop: headerHeight}}>
            <Image src={resolveUrl(basic.image)} mode="aspectFill" style={{
                height: '75%',
                width: '100%',
                display: 'block',
                zIndex: 0,
                position: 'absolute',
                top: 0,
                left: 0
            }}/>
            <View style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                position: 'relative',
                zIndex: 1,
            }}>
                <View style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    color: 'white',
                    marginTop: '48rpx',
                    marginBottom: '40rpx',
                    position: 'relative'
                }}>
                    {!isLogin &&
                        <>
                            <View style={{marginRight: util.px2rpx(10)}} >
                                <Image src={'../../assets/images/user/no-avatar.png'} mode="widthFix" style={{
                                    width: '128rpx',
                                    height: '128rpx',
                                    display: 'block',
                                    borderRadius: '50%'
                                }}/>
                            </View>
                            <View style={{color: 'white'}} onClick={doLogin}>
                                <View className="text-lg" style={{color: 'white'}}>
                                    点击登录
                                </View>
                            </View>
                        </>
                    }
                    {isLogin &&
                        <>
                            <View style={{marginRight: util.px2rpx(10)}} onClick={jumpManagerCenter}>
                                <Image src={userInfo?.memberInfo.avatar} mode="widthFix" style={{
                                    width: '128rpx',
                                    height: '128rpx',
                                    display: 'block',
                                    borderRadius: '50%'
                                }}/>
                            </View>
                            <View className={'flex-sub'} style={{color: 'white'}}>
                                <Navigator url={'/pages/my/children'} className="text-lg" style={{color: 'white'}}>
                                    {child ? child.name : userInfo?.memberInfo.nickname}
                                </Navigator>
                                <View className='margin-top-sm' style={{color: 'white'}}>
                                    {child && child.schoolClass ? `${child.schoolClass.level.school.name} ${child.schoolClass.level.name} ${child.schoolClass.name}`: ''}
                                </View>
                            </View>
                            <View onClick={logout}> <IconFont name='tuichu' color={'white'} size={28} /> </View>
                        </>
                    }

                </View>
                <View style={{width: '100%', borderRadius: '20rpx', overflow: 'hidden'}}>
                    <View style={{
                        padding: '20rpx',
                        backgroundImage: 'linear-gradient(90deg, #ffe9c2, #f2cb84)',
                        color: '#8c5d26',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <View style={{display: 'flex', alignItems: 'center'}}>
                            <Image src={'../../assets/images/designer/vip.png'} mode='widthFix'
                                   style={{width: '44rpx', maxHeight: '44rpx', marginRight: '20rpx'}}/>
                            会员中心
                        </View>
                        {(()=>{
                            if(isLogin) {
                                if(memberSiteLevel) {
                                    return <View>{moment(memberSiteLevel.endAt).format("yyyy-MM-DD")}日到期</View>;
                                }
                                else if(site){
                                    return <Navigator url={`/pages/site/vip?id=${site.id}`}>已过期点击续费</Navigator>;
                                }
                                else {
                                    return <></>;
                                }
                            }
                            else {
                                return <></>;
                            }
                        })()}
                    </View>
                    <View style={{display: 'flex', backgroundColor: 'white', alignItems: 'center'}}>
                        <View style={{
                            width: '48rpx',
                            fontSize: '24rpx',
                            backgroundColor: '#ca8d4b',
                            color: 'white',
                            textAlign: 'center',
                            padding: '6rpx'
                        }}>我的书店</View>
                        {isLogin && site &&
                            <Navigator url={`/pages/site/detail?id=${site.id}`} style={{flex: 1, padding: '0px 20rpx'}}>
                                <View className="text-lg margin-bottom-sm">{site.name}</View>
                                <View style={{color: 'gray'}}>地址：{site.address}</View>
                            </Navigator>
                        }
                        {(!isLogin || !site) &&
                            <View style={{flex: 1, padding: '0px 20rpx'}}>
                                <View className="text-lg margin-bottom-sm">请选择书店</View>
                            </View>
                        }
                        {isLogin && site &&
                            <Navigator url='/pages/site/change?action=bind' style={{width: '100rpx'}}>
                                <Image src={'../../assets/images/designer/qiehuan.png'} mode={'widthFix'}
                                       style={{width: '60rpx', height: '60rpx'}}/>
                                <View>切换</View>
                            </Navigator>
                        }
                    </View>
                </View>
            </View>
        </View>
    );
}

export default withLogin(UserHeader);
