import withLogin from "../../components/login/login";
import {useEffect, useState} from "react";
import request, {API_SITES, SERVICE_WINKT_MEMBER_HEADER, SERVICE_WINKT_SYSTEM_HEADER} from "../../utils/request";
import PageLayout from "../../layouts/PageLayout";
import {Text, View} from "@tarojs/components";
import Empty from "../../components/empty/empty";
import classNames from "classnames";
import Taro, {usePullDownRefresh, useReachBottom, useRouter} from "@tarojs/taro";


const ChangeSiteList = (props: any) => {
    const {context, headerHeight, checkLogin} = props;
    const {position, userInfo} = context;
    const [sites, setSites] = useState<any[]>([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [over, setOver] = useState(false);
    const {params} = useRouter();
    let [page, setPage] = useState<number>(1);
    const isLogin = checkLogin();

    const loadSites = (pos: any = {lat: null, lng: null}, clear = true) => {
        request.put(API_SITES + `?page=${page}`, SERVICE_WINKT_SYSTEM_HEADER, {
            lat: pos?.lat,
            lng: pos?.lng
        }).then(res => {
            setLoadingMore(false);
            let list = res.data.data.content.map(item => {
                if (item.siteDistance) {
                    item.distance = '距离' + parseFloat(item.siteDistance).toFixed(2) + 'KM';
                } else {
                    item.distance = '';
                }
                return item;
            });
            //过滤掉当前用户所在门店
            if(isLogin && userInfo?.memberInfo?.siteId) {
                let siteId = parseInt(userInfo.memberInfo.siteId);
                list = list.filter(item=>parseInt(item.id) != siteId);
            }

            if (clear) {
                setOver(false);
                setSites(list);
            } else {
                if (!list || list.length === 0) {
                    setOver(true);
                } else {
                    setSites([...sites, ...list]);
                }
            }
        });
    }
    useReachBottom(() => {
        if (!over) {
            setLoadingMore(true);
            setPage(++page);
            loadSites(position, false);
        }
    });

    usePullDownRefresh(() => {
        setOver(false);
        page = 1;
        setPage(0);
        return loadSites(position, true);
    });

    useEffect(() => {
        //如果有定位信息则按照地理位置加载站点信息
        loadSites(position, true);

    }, [position]);

    const selectSite = (site) => {
        if (params.action === 'select') {
            //跳转到商城购物车页面
            Taro.navigateTo({url: `/shop/pages/cart?siteId=${site.id}&siteName=${site.name}&action=scan`}).then();
        } else if (params.action === 'bind') {
            Taro.showLoading({title: '查询中...'}).then();
            request.get("wxapp/member/children/default", SERVICE_WINKT_MEMBER_HEADER, null, true).then(res=>{
                if(!res.data.data) {
                    Taro.hideLoading();
                    //如果没有借阅人信息则跳转到借阅人页面创建借阅人
                    Taro.navigateTo({url: `/pages/my/children`}).then();
                }
                else {
                    //用户是不是可以切换门店
                    return request.put("wxapp/members/can/change/site", SERVICE_WINKT_MEMBER_HEADER, null, true);
                }
            }).then(res=>{
                if(!res.data.data) {
                    //如果用户能切换门店
                    Taro.hideLoading();
                    Taro.redirectTo({url: `vip?id=${site.id}`}).then();
                }
                else {
                    //如果不能切换门店则提示错误信息
                    Taro.showToast({title: '您在一年期内只能切换一次门店', icon: 'none', duration: 2000}).then();
                }
            }).catch(()=>Taro.hideLoading())
        }
    }

    return (
        <PageLayout statusBarProps={{title: '切换绑定门店'}}>
            {!position &&
                <View className='bg-red text-sm padding-xs margin-bottom'>无法获取您的定位信息，信息显示可能不准确，请确保你的手机开启了定位</View>}
            <View style={{paddingTop: '30rpx'}}>
                {sites.length === 0 &&
                    <Empty title="暂无门店，敬请期待" height={'calc(100vh - ' + headerHeight + 'px - 120rpx)'}/>}
                {
                    sites.length > 0 &&
                    sites.map((item: any) => {
                        return (
                            <View className="cu-list card-menu padding-top-sm padding-bottom-sm menu-avatar bg-white shadow-lg">
                                <View
                                    className={classNames("cu-item")}
                                    key={item.id}
                                    data-index={'touch-' + item.id}
                                    onClick={() => selectSite(item)}
                                    style={{height: 'auto'}}
                                >
                                    <View className="content flex-sub margin-right" style={{left: '30rpx', position: 'relative'}}>
                                        <View className="text-black text-lg">{item.name}</View>
                                        <View className="text-gray text">
                                            <View>
                                                <Text className="cuIcon-locationfill text-red"/>
                                                {item.address}
                                            </View>
                                        </View>
                                    </View>
                                    <View className="action">
                                        {item.distance}
                                    </View>
                                </View>
                            </View>
                        );
                    })
                }
                <View className={classNames("cu-load text-gray", over ? 'over' : (loadingMore ? 'loading' : ''))}/>
            </View>
        </PageLayout>
    );
}


export default withLogin(ChangeSiteList);
