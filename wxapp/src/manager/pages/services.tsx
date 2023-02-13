import {useDidShow, useReachBottom} from '@tarojs/taro';
import {Button, Input, Navigator, Text, View} from "@tarojs/components";
import classNames from "classnames";
import {useState} from "react";
import PageLayout from "../../layouts/PageLayout";
import request, {resolveUrl, SERVICE_WINKT_ORDER_HEADER} from "../../utils/request";
import withLogin from "../../components/login/login";
import Empty from "../../components/empty/empty";
import ContentLoading from "../../components/contentloading";
import moment from 'moment';
import util from "../../utils/we7/util";


const ShopOrderServices = (props) => {
    const {checkLogin, makeLogin} = props;
    const [orders, setOrders] = useState<any[]>([]);
    const [over, setOver] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchKey, setSearchKey] = useState<string>('');
    const isLogin = checkLogin();

    const loadData = (clear = false, page = 1, params:any = {}) => {
        if (!isLogin) return;
        const _page = clear ? 1 : page;
        setPage(_page);
        request.get("wxapp/manager/shop/after/orders", SERVICE_WINKT_ORDER_HEADER, {page: _page, ...params}, true).then(res => {
            setLoadingMore(false);
            let list = res.data.data.content;
            list.forEach(o => {
                if(o.shopOrderGoods.images) {
                    o.shopOrderGoods.images = o.shopOrderGoods.images.split(',');
                }
                else {
                    o.shopOrderGoods.images = [];
                }
            })
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
        if (isLogin) {
            loadData(true, 1, {key: searchKey});
        }
    });
    useReachBottom(() => {
        if (!over && isLogin) {
            setLoadingMore(true);
            loadData(false, page + 1, {key: searchKey});
        }
    })
    const doSearch = util.debounce(loadData, 500);
    const handleSearchInput = (e) => {
        let key = e.detail.value;
        setSearchKey(key);
        doSearch(true, 1, {key: key});
    }
    return (
        <PageLayout statusBarProps={{title: '商城售后订单'}} showTabBar={false} loading={loading}>
            <View className="cu-bar search bg-white">
                <View className="search-form round">
                    <Text className="cuIcon-search"/>
                    <Input type="text" onInput={handleSearchInput} placeholder="搜索订单号、收货人、电话" confirm-type="search"/>
                </View>
            </View>
            {loading && <ContentLoading height='calc(100vh - 218rpx)'/>}
            {
                !isLogin ?
                    <View className='flex flex-direction align-center justify-center'
                          style={{height: 'calc(100vh - 400rpx)'}}>
                        <Button className="cu-btn bg-gradual-orange block lg" style={{width: '80%'}}
                                onClick={() => makeLogin(() => loadData(true))}>登录查看</Button>
                    </View>
                    : (orders.length === 0 ?
                        <Empty title="暂无售后订单" height='calc(100vh - 464rpx)'/> :
                        <View className="cu-card article">{orders.map((item: any) => {
                            return (
                                <Navigator url={`service_check?id=${item.id}`} className="cu-item"
                                           style={{paddingBottom: 0}}>
                                    <View className="flex align-center padding solid-bottom text-gray justify-between">
                                        <Text> 单号：{item.shopOrderGoods.shopOrder.ordersn} </Text>
                                        {item.status == 0 && <Text className="text-gray">已拒绝</Text>}
                                        {item.status == 1 && <Text className="text-orange">审核中</Text>}
                                        {item.status == 2 && <Text className="text-green">审核通过</Text>}
                                    </View>
                                    <View className="cu-list menu-avatar">
                                        <View className="cu-item">
                                            <View className="cu-avatar radius lg"
                                                  style={{backgroundImage: 'url(' + resolveUrl(item.shopOrderGoods.images[0]) + ')'}}/>
                                            <View className="content" style={{display: 'block', padding: 0}}>
                                                <View className="text-black">
                                                    <Text className="text-cut">{item.shopOrderGoods.name}</Text>
                                                </View>
                                            </View>
                                            <View className="action" style={{width: '160rpx'}}>
                                                <View className="text-gray">X {item.count}</View>
                                            </View>
                                        </View>

                                    </View>
                                    <View className="flex solid-top padding text-gray justify-between align-center">
                                        <View
                                            className="text-gray text-sm">申请时间：{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</View>
                                    </View>
                                </Navigator>
                            );
                        })}</View>)
            }
            <View className={classNames("cu-load text-gray", over ? 'over' : (loadingMore ? 'loading' : ''))}/>
        </PageLayout>
    );
}


export default withLogin(ShopOrderServices);
