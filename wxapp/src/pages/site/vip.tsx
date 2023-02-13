import Taro, {useRouter} from "@tarojs/taro";
import {useEffect, useState} from "react";
import request, {
    API_MEMBER_INFO,
    API_SITES_INFO,
    SERVICE_WINKT_MEMBER_HEADER,
    SERVICE_WINKT_SYSTEM_HEADER
} from "../../utils/request";
import PageLayout from "../../layouts/PageLayout";
import {Button, Map, OfficialAccount, Radio, RichText, ScrollView, Text, View} from "@tarojs/components";
import withLogin from "../../components/login/login";
import {setUserInfo} from "../../store/actions";
import NotLogin from "../../components/notlogin";
import ContentLoading from "../../components/contentloading";
import moment from "moment";
import classNames from "classnames";
import IconFont from "../../components/iconfont";


const SiteVipPage = (props:any) => {
    const {makeLogin, dispatch, context, checkLogin, headerHeight} = props;
    const [site, setSite] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);
    const [levels, setLevels] = useState<any[]>([]);
    const [level, setLevel] = useState<any>();
    const [licenseVisible, setLicenseVisible] = useState(false);
    const [posting, setPosting] = useState<boolean>(false);
    const [agree, setAgree] = useState<boolean>(false);
    const {params} = useRouter();
    const isLogin = checkLogin();
    let checkTimer;
    const loadData = () => {
        if(params.id) {
            Taro.showLoading({title: '加载中...'}).then();
            request.get(API_SITES_INFO+"/"+params.id, SERVICE_WINKT_SYSTEM_HEADER, null, false).then(res=>{
                let _site = res.data.data;
                if(_site.borrowNotice) {
                    _site.borrowNotice = _site.borrowNotice.replace(/<img /ig, '<img style="max-width:100%;height:auto;display:block;margin:10px 0;" ');
                }
                setSite(_site);
                request.get("wxapp/levels/sites/"+_site.id, SERVICE_WINKT_MEMBER_HEADER, null, false).then(res=>{
                    setLevels(res.data.data);
                    setLoading(false);
                    Taro.hideLoading();
                });
            })
        }
    }

    const startNavigation = (site) => {
        Taro.openLocation({latitude: site.lat, longitude: site.lng}).then();
    }
    const closeLicense = () => {
        setLicenseVisible(false);
    }
    useEffect(()=>{
        loadData();
        return () => {
            clearInterval(checkTimer);
        }
    }, []);

    const toggleAgree = () => {
        setAgree(!agree);
    }
    const buyMemberLevel = () => {
        if(!level) {
            return Taro.showToast({title: '请选择要购买的会员', icon: 'none'}).then();
        }
        if(!agree) {
            return Taro.showToast({title: '请同意借阅须知', icon: 'none'}).then();
        }
        setPosting(true);
        makeLogin(()=>{
            request.post("wxapp/levels/buy/"+level.id, SERVICE_WINKT_MEMBER_HEADER, null, true).then(res=> {
                let data = res.data.data;
                data.package = data.packageValue;
                Taro.requestPayment(data).then(() => {
                    //支付已经完成，提醒支付成功并返回上一页面
                    Taro.showToast({title: '微信支付成功', duration: 2000}).then(() => {
                        setTimeout(() => {
                            Taro.showLoading({title: '验证中...'}).then();
                            checkTimer = setInterval(()=>{
                                //刷新会员信息
                                request.get(API_MEMBER_INFO, SERVICE_WINKT_MEMBER_HEADER, null, true).then(res=>{
                                    let memberInfo = res.data.data;
                                    if(parseInt(memberInfo.siteId)>0) {
                                        //成功绑定了会员
                                        context.userInfo.memberInfo = memberInfo;
                                        dispatch(setUserInfo(context.userInfo));
                                        Taro.setStorageSync("userInfo", context.userInfo);
                                        clearInterval(checkTimer);
                                        Taro.showToast({title: '绑定门店成功!', icon: 'success'}).then();
                                        setTimeout(()=>{
                                            Taro.navigateBack().then();
                                        }, 1000);
                                    }
                                })
                            }, 1000);
                        }, 1000);
                        setPosting(false);
                    });
                }).catch(()=>setPosting(false));
            }).catch(()=>setPosting(false));
        })
    }
    return (
        <PageLayout showStatusBar={true} statusBarProps={{title: '购买门店会员'}} showTabBar={false}>
            {!isLogin && <NotLogin onLogin={()=>loadData()} />}
            {isLogin && loading && <ContentLoading height='calc(100vh - 400rpx)' />}
            {isLogin && site && !loading &&
                <View className="bg-white" style={{height: 'calc(100vh - '+headerHeight+'px)', overflowY: 'auto', paddingBottom: 100}}>
                    <Map
                        latitude={site?.lat}
                        longitude={site?.lng}
                        style={{width: '100%', height: Taro.pxTransform(350), display: 'block'}}
                        markers={[
                            {
                                id: 1,
                                latitude: site?.lat,
                                longitude: site?.lng,
                                iconPath: '../../assets/images/user/address.png',
                                width: 32,
                                height: 32,
                                // @ts-ignore
                                callout: {
                                    content: site.name,
                                    display: 'ALWAYS',
                                    padding: 10,
                                    fontSize: 14
                                }
                            }
                        ]}
                    />
                    <View className="padding-left padding-right margin-top flex align-center"
                          style={{position: 'relative'}}>
                        <Text className="text-black text-bold text-xl margin-right">{site.name}</Text>
                        {site.status == 1 && (!!site.endAt || (!!site.endAt && site.endAt < moment().valueOf())) ?
                            <Text className="cu-tag line-green round">正常营业</Text> :
                            <Text className="cu-tag line-red round">暂停服务中</Text>}
                        <View style={{position: 'absolute', right: 10, top: 0}} onClick={() => startNavigation(site)}>
                            <IconFont name={'daohang'} size={32} color={'blue'} />
                        </View>
                    </View>
                    <View className="padding-left padding-right margin-top flex align-center text-lg">
                        <View className="margin-right-sm"><Text className="cuIcon-deliver"/></View>
                        <View>{site.address}</View>
                    </View>
                    <View className="padding-left padding-right margin-top flex align-center text-lg">
                        <Text className="cuIcon-mobilefill text-red"/>
                        {site.contactor}
                        <Button className="cu-btn bg-gradual-blue round margin-left-sm"
                                onClick={() => Taro.makePhoneCall({phoneNumber: site.contact})}>拨打电话</Button>
                    </View>
                    <View className={'padding-left padding-right margin-top-sm'}>
                    <View className={'text-black text-bold text-xl margin-right margin-bottom-sm'}>门店会员</View>
                    <ScrollView scrollX={true} style={{width: '100%', whiteSpace: 'nowrap'}}>
                        {levels.map((item: any)=>{
                            return (
                                <View onClick={()=>setLevel(item)} className={classNames('cu-tag flex-direction margin-right-sm radius justify-around padding-sm', level?.id==item.id? 'line-orange':'')} style={{height: Taro.pxTransform(100), display: 'inline-flex'}}>
                                    <View className={'text-lg'}>{item.name}</View>
                                    <View className={'text-gray'}>有效期：{item.days} 天</View>
                                    <View className={'text-gray'}>会员费：￥{item.price}</View>
                                    <View className={'text-gray'}>押金：￥{item.deposit}</View>
                                </View>
                            );
                        })}
                    </ScrollView>
                    </View>
                </View>
            }
            <OfficialAccount />
            <View className={'tabbar cu-bar flex-direction'} style={{position: 'fixed', bottom: 0, left: 0, right: 0, height: 90}}>
                <View className="padding-xs text-gray text-sm" onClick={toggleAgree}><Radio className={'orange small margin-right-xs'} checked={agree} />购买会员即是接受 <Text className="text-green" onClick={() => setLicenseVisible(true)}>《没大没小借阅须知》</Text></View>
                <Button onClick={buyMemberLevel} loading={posting} disabled={!level||posting} className={'cu-btn bg-orange lg block no-radius flex-sub'} style={{width: '100%'}}>{levels.length > 0 ?'购买门店会员':'门店暂无会员'}</Button>
            </View>
            <View className={classNames("cu-modal", licenseVisible ? 'show' : '')}>
                <View className="cu-dialog bg-white radius-lg">
                    <View className="cu-bar justify-end">
                        <View className="content">借阅须知</View>
                        <View className="action">
                            <Text className="cuIcon-close" onClick={closeLicense} />
                        </View>
                    </View>
                    <ScrollView scrollY className="padding-sm" style={{height: Taro.pxTransform(400)}}>
                        <RichText nodes={site?.borrowNotice} space={'nbsp'} />
                    </ScrollView>
                </View>
            </View>
        </PageLayout>
    );
}

export default withLogin(SiteVipPage);
