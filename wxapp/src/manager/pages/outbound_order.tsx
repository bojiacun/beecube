import {useDidShow, useReachBottom} from "@tarojs/taro";
import {View, Navigator, Button, Text} from '@tarojs/components';
import PageLayout from "../../layouts/PageLayout";
import request, {
    API_APPOINTMENT_OUTBOUND,
    resolveUrl, SERVICE_WINKT_ORDER_HEADER,
} from "../../utils/request";
import classNames from "classnames";
import {useState} from "react";
import ContentLoading from "../../components/contentloading";
import Empty from "../../components/empty/empty";
import moment from "moment";
import withLogin from "../../components/login/login";


const OutboundOrder = (props: any) => {
    const {checkLogin, makeLogin} = props;
    const [outbounds, setOutBounds] = useState<any[]>([]);
    const [over, setOver] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const isLogin = checkLogin();


    const loadData = (clear = false, page = 1) => {
        if (!isLogin) return;
        const _page = clear ? 1 : page;
        setPage(_page);
        request.get(API_APPOINTMENT_OUTBOUND, SERVICE_WINKT_ORDER_HEADER, {
            page: _page,
            tab: 1
        }, true).then(res => {
            setLoadingMore(false);
            let list = res.data.data.content;
            if (clear) {
                setOver(false);
                setOutBounds(list);
            } else {
                if (!list || list.length === 0) {
                    setOver(true);
                } else {
                    setOutBounds([...outbounds, ...list]);
                }
            }
            setLoading(false);
        }).catch(() => {
            setLoadingMore(false);
            setLoading(false);
        })

    }
    useDidShow(() => {
        loadData(true);
    });
    useReachBottom(() => {
        if (!over) {
            setLoadingMore(true);
            loadData(false, page + 1);
        }
    })
    return (
        <PageLayout statusBarProps={{title: '我的出库单'}} showTabBar={false}>
            {loading && <ContentLoading height='calc(100vh - 318rpx)'/>}
            {!isLogin &&
                <View className='flex flex-direction align-center justify-center'
                      style={{height: 'calc(100vh - 400rpx)'}}>
                    <Button className="cu-btn bg-gradual-green block lg" style={{width: '80%'}}
                            onClick={() => makeLogin(() => loadData(true))}>登录查看</Button>
                </View>
            }
            {isLogin && outbounds.length === 0 &&
                <Empty title="暂无出库单" height='calc(100vh - 400rpx)'/>}
            {isLogin && outbounds.length > 0 &&
                <View className="cu-card">
                    {outbounds.map((item: any) => {
                        return (
                            <View className="cu-item">
                                <View className="flex align-center padding solid-bottom justify-between">
                                    <Text> 出库单号：{item.ordersn} </Text>
                                    {item.status == 0 && <Text className="text-yellow">已出库</Text>}
                                    {item.status == 1 && <Text className="text-green">已入库</Text>}
                                </View>
                                {item.wastes.map((g: any) => {
                                    return (
                                        <View className="cu-list menu-avatar">
                                            <View className="cu-item">
                                                <View className="cu-avatar radius lg"
                                                      style={{backgroundImage: 'url(' + resolveUrl(g.classImage) + ')'}}/>
                                                <View className="content"
                                                      style={{display: 'block', padding: 0}}>
                                                    <View className="text-black">
                                                        <Text className="text-cut">{g.name}</Text>
                                                    </View>
                                                    <View className="text-gray text-sm flex">
                                                        <text className="text-cut">{g.count} {g.unit}</text>
                                                    </View>
                                                </View>
                                                {g.price > 0 &&
                                                    <View className="action">
                                                        <View className="text-grey">￥{g.price}</View>
                                                    </View>
                                                }
                                            </View>
                                        </View>
                                    );
                                })}
                                <View className="flex solid-top padding justify-between align-center">
                                    <View className="text-gray text-sm">{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</View>
                                </View>
                            </View>
                        );
                    })}
                </View>
            }
            <View className={classNames("cu-load text-gray", over ? 'over' : (loadingMore ? 'loading' : ''))}/>
            <View style={{height: '140rpx'}}/>
            <View className="cu-bar tabbar" style={{position: 'fixed', bottom: 0, width: '100%'}}>
                <Navigator url="outbound_new" className="cu-btn block xl no-radius bg-gradual-green shadow"
                           style={{width: '100%'}}>
                    新建出库单
                </Navigator>
            </View>
        </PageLayout>
    );
}

export default withLogin(OutboundOrder);
