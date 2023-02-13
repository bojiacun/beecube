import Taro,{useReachBottom, useDidShow} from '@tarojs/taro';
import {Button, ScrollView, Text, View} from "@tarojs/components";
import classNames from "classnames";
import {useState} from "react";
import PageLayout from "../../layouts/PageLayout";
import request, {API_APPOINTMENT_LIST, resolveUrl, SERVICE_WINKT_ORDER_HEADER} from "../../utils/request";
import withLogin from "../../components/login/login";
import Empty from "../../components/empty/empty";
import ContentLoading from "../../components/contentloading";
import moment from 'moment';


const Index = (props) => {
    const {checkLogin, makeLogin} = props;
    const [currentTabIndex, setCurrentTabIndex] = useState(0);
    const [orders, setOrders] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [over, setOver] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const isLogin = checkLogin();
    const tabSelect = (index) => {
        setCurrentTabIndex(index);
        if(isLogin) {
            setLoading(true);
            loadData(index, true);
        }
    }

    const loadData = (tabIndex, clear = false, page = 1) => {
        const _page = clear ? 1 : page;
        setPage(_page);
        request.get(API_APPOINTMENT_LIST, SERVICE_WINKT_ORDER_HEADER, {page: _page, tab: tabIndex}, true).then(res => {
            setLoadingMore(false);
            let list = res.data.data.content;
            if (clear) {
                setOver(false);
                setOrders(list);
            } else {
                if(!list || list.length === 0) {
                    setOver(true);
                }
                else {
                    setOrders([...orders, ...list]);
                }
            }
            setLoading(false);
        }).catch(()=>{
            setLoadingMore(false)
            setLoading(false);
        });
    }

    useDidShow(()=>{
        if(isLogin) {
            loadData(currentTabIndex, true);
        }
    });

    useReachBottom(()=>{
        if(!over && isLogin) {
            setLoadingMore(true);
            loadData(currentTabIndex, false, page+1);
        }
    });

    return (
        <PageLayout statusBarProps={{title: '订单'}} showTabBar={true}>
            <ScrollView scrollX={true} className="bg-white nav">
                <View className="flex text-center">
                    <View className={classNames("cu-item flex-sub", currentTabIndex === 0 ? 'text-green cur' : '')}
                          onClick={() => tabSelect(0)}>
                        待接单
                    </View>
                    <View className={classNames("cu-item flex-sub", currentTabIndex === 1 ? 'text-green cur' : '')}
                          onClick={() => tabSelect(1)}>
                       待上门 
                    </View>
                    <View className={classNames("cu-item flex-sub", currentTabIndex === 2 ? 'text-green cur' : '')}
                          onClick={() => tabSelect(2)}>
                       历史记录
                    </View>
                </View>
            </ScrollView>
            {isLogin && loading && <ContentLoading height='calc(100vh - 316rpx)' />}
            {
                !isLogin ?
                    <View className='flex flex-direction align-center justify-center'
                          style={{height: 'calc(100vh - 400rpx)'}}>
                        <Button className="cu-btn bg-gradual-green block lg" style={{width: '80%'}}
                                onClick={() => makeLogin(() => loadData(currentTabIndex, true))}>登录查看</Button>
                    </View>
                    : (orders.length === 0 ?
                        <Empty title="暂无订单" height='calc(100vh - 400rpx)'/> :
                        <View className="cu-card article">{orders.map((item: any) => {
                            return (
                                <View className="cu-item" style={{paddingBottom: 0}}
                                      onClick={() => Taro.navigateTo({url: 'detail?id=' + item.id})}>
                                    <View className="flex align-center padding solid-bottom text-gray justify-between">
                                        <Text> 编号：{item.ordersn} </Text>
                                        {item.status == -1 && <Text className="text-red">已取消</Text>}
                                        {item.status == 0 && <Text className="text-yellow">待接单</Text>}
                                        {item.status == 1 && <Text className="text-green">待上门</Text>}
                                        {item.status == 2 && <Text className="text-red">待支付</Text>}
                                        {item.status == 3 && <Text>已完成</Text>}
                                    </View>
                                    <View className="cu-list menu-avatar">
                                        {item.wastes.map((g: any) => {
                                            return (
                                                <View className="cu-item">
                                                    <View className="cu-avatar radius lg"
                                                          style={{backgroundImage: 'url(' + resolveUrl(g.classImage) + ')'}}/>
                                                    <View className="content" style={{display: 'block', padding: 0}}>
                                                        <View className="text-black">
                                                            <Text className="text-cut">{g.name} x {g.count} {g.unit}</Text>
                                                        </View>
                                                        {item.status < 3 ?
                                                            <View className="text-gray text-sm flex">
                                                                <text className="text-cut">{g.postWeight}</text>
                                                            </View>
                                                            :
                                                            <View className="text-gray text-sm flex">
                                                                <text className="text-cut">{g.weight>0?g.weight:g.count} {item.unit}</text>
                                                            </View>
                                                        }
                                                    </View>
                                                    {g.price > 0 &&
                                                    <View className="action">
                                                        <View className="text-grey">￥{g.price}</View>
                                                    </View>
                                                    }
                                                </View>
                                            );
                                        })}
                                    </View>
                                    <View className="flex solid-top padding text-gray justify-between align-center">
                                        <View>
                                            {item.status === 3 &&
                                            <View className="margin-bottom-sm"><Text
                                                className="text-bold text-lg text-black">{item.weight>0?item.weight:item.count}</Text>{item.unit}<Text
                                                className="text-bold text-lg text-black">￥{item.price}</Text></View>
                                            }
                                            <View
                                                className="text-gray text-sm">{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</View>
                                        </View>
                                        <View>
                                            {item.status >= 1 &&
                                                <Button className="cu-btn bg-green sm no-radius" onClick={(e)=>{
                                                    e.stopPropagation();
                                                    Taro.makePhoneCall({phoneNumber: item.recyclerMobile}).then();
                                                }}>联系回收员</Button>
                                            }
                                        {item.memberGrade == null && item.status === 3 &&
                                        <Button className="cu-btn bg-red sm no-radius" onClick={(e) => {
                                            e.stopPropagation();
                                            Taro.navigateTo({url: 'grade?id=' + item.id}).then()
                                        }}>评分</Button>}
                                        </View>
                                    </View>
                                </View>
                            );
                        })}</View>)
            }
            <View className={classNames("cu-load text-gray", over ? 'over': (loadingMore ? 'loading': ''))} />
            <View style={{height: '198rpx'}} />
        </PageLayout>
    );
}


export default withLogin(Index);
