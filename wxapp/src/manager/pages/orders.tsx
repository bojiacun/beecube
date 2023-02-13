import Taro, {useDidShow, useReachBottom} from '@tarojs/taro';
import {Button, ScrollView, Text, View, Input} from "@tarojs/components";
import classNames from "classnames";
import util from '../../utils/we7/util';
import {useState} from "react";
import PageLayout from "../../layouts/PageLayout";
import request, {
    resolveUrl, SERVICE_WINKT_ORDER_HEADER,
} from "../../utils/request";
import withLogin from "../../components/login/login";
import Empty from "../../components/empty/empty";
import ContentLoading from "../../components/contentloading";
import moment from 'moment';


const ShopOrders = (props) => {
    const {checkLogin, makeLogin} = props;
    const [currentTabIndex, setCurrentTabIndex] = useState(0);
    const [orders, setOrders] = useState<any[]>([]);
    const [shopStatuses, setShopStatuses] = useState<any>({});
    const [over, setOver] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState(1);
    const [searchKey, setSearchKey] = useState<string>('');
    const isLogin = checkLogin();
    const tabSelect = (index) => {
        setCurrentTabIndex(index)
        setLoading(true);
        loadData(index, true, 1, {key: searchKey});
    }


    const loadData = (tabIndex, clear = false, page = 1, params = {}) => {
        if (!isLogin) return;
        const _page = clear ? 1 : page;
        setPage(_page);
        request.get("wxapp/manager/shop/orders", SERVICE_WINKT_ORDER_HEADER, {
            ...params,
            page: _page,
            tab: tabIndex
        }, true).then(res => {
            setLoadingMore(false);
            let list = res.data.data.content;
            if (clear) {
                setOver(false);
                setOrders(list);
            } else {
                if (!list || list.length === 0) {
                    setOver(true);
                } else {
                    setOrders([...orders, ...list]);
                }
            }
            setLoading(false);
        }).catch(() => {
            setLoadingMore(false);
            setLoading(false);
        })
    }

    useDidShow(() => {
        loadData(currentTabIndex, true, 1, {key: searchKey});
        if(isLogin) {
            request.get("wxapp/manager/shop/orders/tips", SERVICE_WINKT_ORDER_HEADER, null, true).then(res=>{
                //设置标签
                let statuses = res.data.data;
                setShopStatuses(statuses);
            });
        }
    });
    useReachBottom(() => {
        if (!over) {
            setLoadingMore(true);
            loadData(currentTabIndex, false, page + 1, {key: searchKey});
        }
    })

    const doSearch = util.debounce(loadData, 500);
    const handleSearchInput = (e) => {
        let key = e.detail.value;
        setSearchKey(key);
        doSearch(currentTabIndex, true, 1, {key: key});
    }


    return (
        <PageLayout statusBarProps={{title: '商城订单'}} showTabBar={false}>
            <View className="cu-bar search bg-white">
                <View className="search-form round">
                    <Text className="cuIcon-search"/>
                    <Input type="text" onInput={handleSearchInput} placeholder="搜索下单人姓名、手机号、订单号" confirm-type="search"/>
                </View>
            </View>
            <ScrollView scrollX={true} className="bg-white nav">
                <View className="flex text-center">
                    <View className={classNames("cu-item flex-sub", currentTabIndex === 0 ? 'text-orange cur' : '')}
                          style={{position: 'relative'}}
                          onClick={() => tabSelect(0)}>
                        {shopStatuses['status-0'] && <View className='cu-tag badge' style={{top: Taro.pxTransform(5), right: Taro.pxTransform(5)}}>{shopStatuses['status-0']}</View>}
                        待支付
                    </View>
                    <View className={classNames("cu-item flex-sub", currentTabIndex === 1 ? 'text-orange cur' : '')}
                          style={{position: 'relative'}}
                          onClick={() => tabSelect(1)}>
                        {shopStatuses['status-1'] && <View className='cu-tag badge' style={{top: Taro.pxTransform(5), right: Taro.pxTransform(5)}}>{shopStatuses['status-1']}</View>}
                        待发货
                    </View>
                    <View className={classNames("cu-item flex-sub", currentTabIndex === 2 ? 'text-orange cur' : '')}
                          style={{position: 'relative'}}
                          onClick={() => tabSelect(2)}>
                        {shopStatuses['status-2'] && <View className='cu-tag badge' style={{top: Taro.pxTransform(5), right: Taro.pxTransform(5)}}>{shopStatuses['status-2']}</View>}
                        待收货
                    </View>
                    <View className={classNames("cu-item flex-sub", currentTabIndex === 3 ? 'text-orange cur' : '')}
                          style={{position: 'relative'}}
                          onClick={() => tabSelect(3)}>
                        {shopStatuses['status-3'] && <View className='cu-tag badge' style={{top: Taro.pxTransform(5), right: Taro.pxTransform(5)}}>{shopStatuses['status-3']}</View>}
                        已完成
                    </View>
                </View>
            </ScrollView>
            {loading && <ContentLoading height='calc(100vh - 464rpx)'/>}
            {
                !isLogin ?
                    <View className='flex flex-direction align-center justify-center'
                          style={{height: 'calc(100vh - 464rpx)'}}>
                        <Button className="cu-btn bg-gradual-green block lg" style={{width: '80%'}}
                                onClick={() => makeLogin(() => loadData(currentTabIndex, true))}>登录查看</Button>
                    </View>
                    : (loading || orders.length === 0 ?
                        <Empty title="暂无订单" height='calc(100vh - 464rpx)'/> :
                        <View className="cu-card article">{orders.map((item: any) => {
                            return (
                                <View className="cu-item" style={{paddingBottom: 0}}
                                      onClick={() => Taro.navigateTo({url: 'order_detail?id=' + item.id})}>
                                    <View className="flex align-center padding solid-bottom text-black justify-between">
                                        <Text> 单号：{item.ordersn} </Text>
                                        {item.status == 0 && <Text className="text-orange">待支付</Text>}
                                        {item.status == 1 && <Text className="text-red">待发货</Text>}
                                        {item.status == 2 && <Text className="text-orange">待收货</Text>}
                                        {item.isServicing && <Text className="text-red">待处理</Text>}
                                        {item.status == 3 && <Text className={'text-gray'}>已完成</Text>}
                                    </View>
                                    <View className="cu-list menu-avatar">
                                        {item.goods?.map((g: any) => {
                                            return (
                                                <View className="cu-item">
                                                    <View className="cu-avatar radius lg"
                                                          style={{backgroundImage: 'url(' + resolveUrl(g.images.split(',')[0]) + ')'}}/>
                                                    <View className="content" style={{display: 'block', padding: 0}}>
                                                        <View className="text-black">
                                                            <Text className="text-cut">{g.name}</Text>
                                                        </View>
                                                        <View className="text-gray text-sm flex">
                                                            <text className="text-red">￥{g.price}</text>
                                                        </View>
                                                    </View>
                                                    <View className="action">
                                                        <View className="text-gray"> X {g.count}</View>
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </View>
                                    <View className="flex solid-top padding justify-between align-center text-sm text-gray">
                                        <View>
                                            {item.username} {item.mobile}
                                        </View>
                                        <View>
                                            {moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                                        </View>
                                    </View>
                                </View>
                            );
                        })}</View>)
            }
            <View className={classNames("cu-load text-gray", over ? 'over' : (loadingMore ? 'loading' : ''))}/>
        </PageLayout>
    );
}


export default withLogin(ShopOrders);
