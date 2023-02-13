import {useDidShow, useReachBottom, useRouter} from '@tarojs/taro';
import {Button, Navigator, ScrollView, Text, View} from "@tarojs/components";
import classNames from "classnames";
import {useState} from "react";
import PageLayout from "../../layouts/PageLayout";
import request, {API_SHOP_GOODS_ORDERS, resolveUrl, SERVICE_WINKT_ORDER_HEADER} from "../../utils/request";
import withLogin from "../../components/login/login";
import Empty from "../../components/empty/empty";
import ContentLoading from "../../components/contentloading";
import moment from 'moment';
import {CountDown} from '../../components/CountDown';


const ShopOrders = (props) => {
    const {checkLogin, makeLogin} = props;
    const {params} = useRouter();
    const [currentTabIndex, setCurrentTabIndex] = useState<number>(params.tab ? parseInt(params.tab) : 0);
    const [orders, setOrders] = useState<any[]>([]);
    const [over, setOver] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const isLogin = checkLogin();
    const tabSelect = (index) => {
        setCurrentTabIndex(index)
        if (isLogin) {
            setLoading(true);
            setLoading(true);
            loadData(index, true);
        }
    }

    const loadData = (tabIndex, clear = false, page = 1) => {
        if (!isLogin) return;
        const _page = clear ? 1 : page;
        setPage(_page);
        request.get(API_SHOP_GOODS_ORDERS, SERVICE_WINKT_ORDER_HEADER, {page: _page, tab: tabIndex}, true).then(res => {
            setLoadingMore(false);
            let list = res.data.data.content;
            list.forEach(o => {
                o.goods.forEach(g => {
                    g.images = g.images.split(',');
                })
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
            loadData(currentTabIndex, true);
        }
    });
    useReachBottom(() => {
        if (!over && isLogin) {
            setLoadingMore(true);
            loadData(currentTabIndex, false, page + 1);
        }
    })

    return (
        <PageLayout statusBarProps={{title: '商城订单'}} showTabBar={false}>
            <ScrollView scrollX={true} className="bg-white nav">
                <View className="flex text-center">
                    <View className={classNames("cu-item flex-sub", currentTabIndex === 0 ? 'text-orange cur' : '')}
                          onClick={() => tabSelect(0)}>
                        待支付
                    </View>
                    <View className={classNames("cu-item flex-sub", currentTabIndex === 1 ? 'text-orange cur' : '')}
                          onClick={() => tabSelect(1)}>
                        待发货
                    </View>
                    <View className={classNames("cu-item flex-sub", currentTabIndex === 2 ? 'text-orange cur' : '')}
                          onClick={() => tabSelect(2)}>
                        待收货
                    </View>
                    <View className={classNames("cu-item flex-sub", currentTabIndex === 3 ? 'text-orange cur' : '')}
                          onClick={() => tabSelect(3)}>
                        已完成
                    </View>
                </View>
            </ScrollView>
            {loading && <ContentLoading height='calc(100vh - 218rpx)'/>}
            {
                !isLogin ?
                    <View className='flex flex-direction align-center justify-center'
                          style={{height: 'calc(100vh - 400rpx)'}}>
                        <Button className="cu-btn bg-gradual-orange block lg" style={{width: '80%'}}
                                onClick={() => makeLogin(() => loadData(currentTabIndex, true))}>登录查看</Button>
                    </View>
                    : (orders.length === 0 ?
                        <Empty title="暂无订单" height='calc(100vh - 400rpx)'/> :
                        <View className="cu-card article">{orders.map((item: any) => {
                            return (
                                <Navigator url={`order_detail?id=${item.id}`} className="cu-item" style={{paddingBottom: 0}}>
                                    <View className="flex align-center padding solid-bottom text-gray justify-between">
                                        <Text> 编号：{item.ordersn} </Text>
                                        {item.status == -1 && <Text className="text-gray">已取消</Text>}
                                        {item.status == 0 && <Text className="text-yellow">待支付</Text>}
                                        {item.status == 1 && <Text className="text-orange">待发货</Text>}
                                        {item.status == 2 && <Text className="text-red">待收货</Text>}
                                        {item.status == 3 && <Text>已完成</Text>}

                                    </View>
                                    <View className="cu-list menu-avatar">
                                        {item.goods.map((g: any) => {
                                            return (
                                                <View className="cu-item">
                                                    <View className="cu-avatar radius lg"
                                                          style={{backgroundImage: 'url(' + resolveUrl(g.images[0]) + ')'}}/>
                                                    <View className="content" style={{display: 'block', padding: 0}}>
                                                        <View className="text-black">
                                                            <Text className="text-cut">{g.name}</Text>
                                                        </View>
                                                        <View className="text-gray text-sm flex">
                                                            <text className="text-cut">￥{g.price.toFixed(2)}</text>
                                                        </View>
                                                    </View>
                                                    <View className="action" style={{width: '160rpx'}}>
                                                        <View className="text-gray">X {g.count}</View>
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </View>
                                    <View className="flex solid-top padding text-gray justify-between align-center">
                                        <View>
                                            {parseInt(item.status) === 0 ?
                                                <View className="margin-right-sm">需支付：<Text
                                                    className="text-red text-bold">￥{item.actualPrice.toFixed(2)}</Text></View>
                                                :
                                                <View className="margin-right-sm">已支付：<Text
                                                    className="text-red text-bold">￥{item.actualPrice.toFixed(2)}</Text></View>
                                            }
                                        </View>
                                        <View>
                                            <View
                                                className="text-gray text-sm">下单时间：{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</View>
                                            {item.cancelTime && parseInt(item.status) === 0 &&
                                            <View className="text-gray text-sm">剩余支付时间：<CountDown
                                                endTime={moment(item.cancelTime).format('YYYY-MM-DD HH:mm:ss')}/></View>
                                            }
                                        </View>
                                    </View>
                                </Navigator>
                            );
                        })}</View>)
            }
            <View className={classNames("cu-load text-gray", over ? 'over' : (loadingMore ? 'loading' : ''))}/>
        </PageLayout>
    );
}


export default withLogin(ShopOrders);
