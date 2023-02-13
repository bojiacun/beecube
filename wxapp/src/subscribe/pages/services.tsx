import {useDidShow, useReachBottom} from '@tarojs/taro';
import {Button, Navigator, Text, View} from "@tarojs/components";
import classNames from "classnames";
import {useState} from "react";
import PageLayout from "../../layouts/PageLayout";
import request, {
    resolveUrl,
    SERVICE_WINKT_ORDER_HEADER
} from "../../utils/request";
import withLogin from "../../components/login/login";
import Empty from "../../components/empty/empty";
import ContentLoading from "../../components/contentloading";
import moment from 'moment';


const SubscribeOrderServices = (props) => {
    const {checkLogin, makeLogin} = props;
    const [orders, setOrders] = useState<any[]>([]);
    const [over, setOver] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const isLogin = checkLogin();

    const loadData = (clear = false, page = 1) => {
        if (!isLogin) return;
        const _page = clear ? 1 : page;
        setPage(_page);
        request.get("wxapp/subscribe/orders", SERVICE_WINKT_ORDER_HEADER, {page: _page, tab: 10}, true).then(res => {
            setLoadingMore(false);
            let list = res.data.data.content;
            list.forEach(o => {
                o.goods.forEach(g=>{
                    g.images = g.images.split(',');
                });
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
            loadData(true);
        }
    });
    useReachBottom(() => {
        if (!over && isLogin) {
            setLoadingMore(true);
            loadData(false, page + 1);
        }
    })

    return (
        <PageLayout statusBarProps={{title: '损坏或丢失订单'}} showTabBar={false} loading={loading}>
            {loading && <ContentLoading height='calc(100vh - 218rpx)'/>}
            {
                !isLogin ?
                    <View className='flex flex-direction align-center justify-center'
                          style={{height: 'calc(100vh - 400rpx)'}}>
                        <Button className="cu-btn bg-gradual-orange block lg" style={{width: '80%'}}
                                onClick={() => makeLogin(() => loadData(true))}>登录查看</Button>
                    </View>
                    : (orders.length === 0 ?
                        <Empty title="暂无订单" height='calc(100vh - 400rpx)'/> :
                        <View className="cu-card article">{orders.map((item: any) => {
                            return (
                                <Navigator url={"order_detail?id=" + item.id} key={item.id} className="cu-item" style={{paddingBottom: 0}}>
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
                        })}</View>)
            }
            <View className={classNames("cu-load text-gray", over ? 'over' : (loadingMore ? 'loading' : ''))}/>
        </PageLayout>
    );
}


export default withLogin(SubscribeOrderServices);
