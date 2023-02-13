import Taro, {useDidShow, useReachBottom, useRouter} from '@tarojs/taro';
import {Button, Navigator, ScrollView, Text, View} from "@tarojs/components";
import classNames from "classnames";
import {useState} from "react";
import PageLayout from "../../layouts/PageLayout";
import request, {
    API_SUBSCRIBE_GOODS_ORDERS,
    resolveUrl,
    SERVICE_WINKT_ORDER_HEADER
} from "../../utils/request";
import withLogin from "../../components/login/login";
import Empty from "../../components/empty/empty";
import ContentLoading from "../../components/contentloading";
import moment from 'moment';


const SubscribeOrders = (props) => {
    const {checkLogin, makeLogin} = props;
    const {params} = useRouter();
    const [currentTabIndex, setCurrentTabIndex] = useState<number>(params.tab ? parseInt(params.tab) : 1);
    const [orders, setOrders] = useState<any[]>([]);
    const [over, setOver] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [tips, setTips] = useState<any>({});
    const isLogin = checkLogin();
    const tabSelect = (index) => {
        setCurrentTabIndex(index)
        if (isLogin) {
            loadData(index, true);
        }
    }

    const loadData = (tabIndex, clear = false, page = 1) => {
        if (!isLogin) return;
        const _page = clear ? 1 : page;
        setPage(_page);
        request.get(API_SUBSCRIBE_GOODS_ORDERS, SERVICE_WINKT_ORDER_HEADER, {
            page: _page,
            tab: tabIndex
        }, true).then(res => {
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

    const loadTips = () => {
        request.get("wxapp/subscribe/orders/tips", SERVICE_WINKT_ORDER_HEADER, null, true).then(res=>{
            //设置标签
            let statuses = res.data.data;
            setTips(statuses);
        });
    }

    useDidShow(() => {
        if (isLogin) {
            loadData(currentTabIndex, true);
            loadTips();
        }
    });
    useReachBottom(() => {
        if (!over && isLogin) {
            setLoadingMore(true);
            loadData(currentTabIndex, false, page + 1);
        }
    })

    return (
        <PageLayout statusBarProps={{title: '我的借阅订单'}} showTabBar={false}>
            <ScrollView scrollX={true} scrollIntoView={`tab_${params.tab}`} className="bg-white nav">

                <View key={'tab_0'} id={'tab_0'}
                      className={classNames("cu-item flex-sub", currentTabIndex === 0 ? 'text-orange cur' : '')}
                      style={{position: 'relative'}}
                      onClick={() => tabSelect(0)}>
                    {tips['status-0'] && <View className='cu-tag badge' style={{top: Taro.pxTransform(5), right: Taro.pxTransform(5)}}>{tips['status-0']}</View>}
                    待支付
                </View>
                <View key={'tab_1'} id={'tab_1'}
                      className={classNames("cu-item flex-sub", currentTabIndex === 1 ? 'text-orange cur' : '')}
                      style={{position: 'relative'}}
                      onClick={() => tabSelect(1)}>
                    {tips['status-1'] && <View className='cu-tag badge' style={{top: Taro.pxTransform(5), right: Taro.pxTransform(5)}}>{tips['status-1']}</View>}
                    待出库
                </View>
                <View key={'tab_2'} id={'tab_2'}
                      className={classNames("cu-item flex-sub", currentTabIndex === 2 ? 'text-orange cur' : '')}
                      style={{position: 'relative'}}
                      onClick={() => tabSelect(2)}>
                    {tips['status-2'] && <View className='cu-tag badge' style={{top: Taro.pxTransform(5), right: Taro.pxTransform(5)}}>{tips['status-2']}</View>}
                    待收货
                </View>
                <View key={'tab_3'} id={'tab_3'}
                      className={classNames("cu-item flex-sub", currentTabIndex === 3 ? 'text-orange cur' : '')}
                      style={{position: 'relative'}}
                      onClick={() => tabSelect(3)}>
                    {tips['status-3'] && <View className='cu-tag badge' style={{top: Taro.pxTransform(5), right: Taro.pxTransform(5)}}>{tips['status-3']}</View>}
                    借阅中
                </View>
                <View key={'tab_4'} id={'tab_4'}
                      className={classNames("cu-item flex-sub", currentTabIndex === 4 ? 'text-orange cur' : '')}
                      style={{position: 'relative'}}
                      onClick={() => tabSelect(4)}>
                    {tips['status-4'] && <View className='cu-tag badge' style={{top: Taro.pxTransform(5), right: Taro.pxTransform(5)}}>{tips['status-4']}</View>}
                    归还中
                </View>
                <View key={'tab_5'} id={'tab_5'}
                      className={classNames("cu-item flex-sub", currentTabIndex === 5 ? 'text-orange cur' : '')}
                      style={{position: 'relative'}}
                      onClick={() => tabSelect(5)}>
                    {tips['status-5'] && <View className='cu-tag badge' style={{top: Taro.pxTransform(5), right: Taro.pxTransform(5)}}>{tips['status-5']}</View>}
                    已归还
                </View>
                <View key={'tab_6'} id={'tab_6'}
                      className={classNames("cu-item flex-sub", currentTabIndex === 6 ? 'text-orange cur' : '')}
                      style={{position: 'relative'}}
                      onClick={() => tabSelect(6)}>
                    {tips['status-6'] && <View className='cu-tag badge' style={{top: Taro.pxTransform(5), right: Taro.pxTransform(5)}}>{tips['status-6']}</View>}
                    损坏确认中
                </View>
                <View key={'tab_7'} id={'tab_7'}
                      className={classNames("cu-item flex-sub", currentTabIndex === 7 ? 'text-orange cur' : '')}
                      style={{position: 'relative'}}
                      onClick={() => tabSelect(7)}>
                    {tips['status-7'] && <View className='cu-tag badge' style={{top: Taro.pxTransform(5), right: Taro.pxTransform(5)}}>{tips['status-7']}</View>}
                    待赔付
                </View>
                <View key={'tab_8'} id={'tab_8'}
                      className={classNames("cu-item flex-sub", currentTabIndex === 8 ? 'text-orange cur' : '')}
                      style={{position: 'relative'}}
                      onClick={() => tabSelect(8)}>
                    {tips['status-8'] && <View className='cu-tag badge' style={{top: Taro.pxTransform(5), right: Taro.pxTransform(5)}}>{tips['status-8']}</View>}
                    已损坏
                </View>
                <View key={'tab_9'} id={'tab_9'}
                      className={classNames("cu-item flex-sub", currentTabIndex === 9 ? 'text-orange cur' : '')}
                      style={{position: 'relative'}}
                      onClick={() => tabSelect(9)}>
                    {tips['status-9'] && <View className='cu-tag badge' style={{top: Taro.pxTransform(5), right: Taro.pxTransform(5)}}>{tips['status-9']}</View>}
                    已丢失
                </View>
                <View key={'tab_-1'} id={'tab_-1'}
                      className={classNames("cu-item flex-sub", currentTabIndex === -1 ? 'text-orange cur' : '')}
                      style={{position: 'relative'}}
                      onClick={() => tabSelect(-1)}>
                    {tips['status--1'] && <View className='cu-tag badge' style={{top: Taro.pxTransform(5), right: Taro.pxTransform(5)}}>{tips['status--1']}</View>}
                    已取消
                </View>
            </ScrollView>
            {loading && <ContentLoading height='calc(100vh - 218rpx)'/>}
            {!isLogin && <View className='flex flex-direction align-center justify-center'
                               style={{height: 'calc(100vh - 400rpx)'}}>
                <Button className="cu-btn bg-gradual-orange block lg" style={{width: '80%'}}
                        onClick={() => makeLogin(() => loadData(currentTabIndex, true))}>登录查看</Button>
            </View>
            }
            {isLogin &&
                <View className="cu-card article">
                    {orders.length == 0 && <Empty title="暂无订单" height='calc(100vh - 400rpx)'/>}
                    {orders.length > 0 && orders.map((item: any) => {
                        return (
                            <Navigator url={"order_detail?id=" + item.id} key={item.id} className="cu-item"
                                       style={{paddingBottom: 0}}>
                                <View className="flex align-center padding solid-bottom text-gray justify-between">
                                    <Text> 单号：{item.ordersn} </Text>
                                    {item.status == -1 && <Text className="text-gray">已取消</Text>}
                                    {item.status == 0 && <Text className="text-red">待支付</Text>}
                                    {item.status == 1 && <Text className="text-orange">待发货</Text>}
                                    {item.status == 2 && <Text className="text-red">待收货</Text>}
                                    {item.status == 3 && <Text className='text-green'>借阅中</Text>}
                                    {item.status == 4 && <Text className='text-green'>归还中</Text>}
                                    {item.status == 5 && <Text className='text-gray'>已归还</Text>}
                                    {item.status == 6 && <Text className='text-orange'>损坏确认中</Text>}
                                    {item.status == 7 && <Text className='text-red'>待赔付</Text>}
                                    {item.status == 8 && <Text className='text-gray'>已损坏</Text>}
                                    {item.status == 9 && <Text className='text-gray'>已丢失</Text>}
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
                                <View className="flex solid-top padding text-gray justify-between align-center text-sm">
                                    <View>
                                        <View>{item.username}</View>
                                    </View>
                                    <View>下单时间：{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</View>
                                </View>
                            </Navigator>
                        );
                    })}</View>
            }
            <View className={classNames("cu-load text-gray", over ? 'over' : (loadingMore ? 'loading' : ''))}/>
        </PageLayout>
    );
}


export default withLogin(SubscribeOrders);
