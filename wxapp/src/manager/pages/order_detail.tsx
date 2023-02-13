import Taro, {useRouter} from '@tarojs/taro';
import {useEffect, useRef, useState} from "react";
import request, {
    SERVICE_WINKT_ORDER_HEADER,
    resolveUrl
} from "../../utils/request";
import PageLayout from "../../layouts/PageLayout";
import {Button, Form, Text, View, Textarea} from "@tarojs/components";
import NotLogin from "../../components/notlogin";
import Empty from "../../components/empty/empty";
import withLogin from "../../components/login/login";
import ContentLoading from "../../components/contentloading";
import moment from 'moment';

const ShopOrderDetail = (props: any) => {
    const {checkLogin, headerHeight, isIpx} = props;
    const [loading, setLoading] = useState<boolean>(false);
    const [posting, setPosting] = useState<boolean>(false);
    const [info, setInfo] = useState<any>(null);
    const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
    const [prices, setPrices] = useState<any[]>([]);
    const timer = useRef<any>();
    const {params} = useRouter();
    const isLogin = checkLogin();

    const loadData = () => {
        if (isLogin) {
            setLoading(true);
            Promise.all([request.get("wxapp/manager/shop/orders/" + params.id, SERVICE_WINKT_ORDER_HEADER, null, true)]).then((reses: any[]) => {
                let _info = reses[0].data.data;
                setInfo(_info);
                let prices = [];
                if (_info.children == null || _info.children.length == 0) {
                    prices = _info.prices;
                } else {
                    _info.children.forEach((o: any) => {
                        // @ts-ignore
                        prices = prices.concat(o.prices);
                    })
                }
                const result = Object.values(prices.reduce((acc, {amount, description}) => {
                    // @ts-ignore
                    acc[description] = {description, amount: (acc[description] ? acc[description].amount : 0) + amount};
                    return acc;
                }, {}));
                setPrices(result);
                setLoading(false);
            });
        }
    }

    useEffect(() => {
        loadData();
        return () => {
            clearInterval(timer.current);
        }
    }, []);


    if (!isLogin) {
        return (
            <PageLayout statusBarProps={{title: '订单详情'}}>
                <NotLogin height={'calc(100vh - ' + headerHeight + 'px)'} onLogin={loadData}/>
            </PageLayout>
        );
    }
    if (loading) {
        return (
            <PageLayout statusBarProps={{title: '订单详情'}}>
                <ContentLoading/>
            </PageLayout>
        );
    }
    if (!loading && !info) {
        return (
            <PageLayout statusBarProps={{title: '订单详情'}}>
                <Empty title="暂无数据" height={'calc(100vh - ' + headerHeight + 'px)'}/>
            </PageLayout>
        );
    }
    const confirmOrder = (e) => {
        let data = e.detail.value;
        setPosting(true);
        request.put("wxapp/manager/shop/orders/" + info.id + "/delivery", SERVICE_WINKT_ORDER_HEADER, data.deliveryNumber, true).then((res) => {
            setInfo(res.data.data);
            setConfirmVisible(false);
            setPosting(false);
        }).catch(() => setPosting(false));
    }


    const doCopy = (info) => {
        Taro.setClipboardData({data: info.ordersn}).then(() => {
            Taro.showToast({title: '复制成功', icon: 'none'}).then();
        })
    }
    const startNavigation = (order) => {
        Taro.openLocation({latitude: order.lat, longitude: order.lng}).then();
    }
    return (
        <PageLayout statusBarProps={{title: '订单详情'}}>
            <View className="cu-card bg-white radius-lg margin">
                <View className="cu-bar">
                    <View className="action">
                        <Text className="cuIcon-titles text-orange"/>
                        <Text className="text-bold">基本信息</Text>
                    </View>
                </View>
                <View className="cu-list menu">
                    <View className="cu-item">
                        <View className="content">
                            <Text className="text-black">订单编号：{info.ordersn}</Text>
                        </View>
                        <View className="action">
                            <Button className="cu-btn sm bg-orange shadow" onClick={() => doCopy(info)}>复制</Button>
                        </View>
                    </View>
                    <View className="cu-item">
                        <View className="content">
                            <Text className="text-black">订单总价：{info.totalPrice.toFixed(2)}</Text>
                        </View>
                    </View>
                    <View className="cu-item">
                        <View className="content">
                            <Text className="text-black">实际支付：{info.actualPrice.toFixed(2)}</Text>
                        </View>
                    </View>
                    {parseInt(info.status) == 3 &&
                        <View className="cu-item">
                            <View className="content">
                                <Text className="text-black">支付方式：
                                    {info.payType == 1 && '微信支付'}
                                    {info.payType == 2 && '余额支付'}
                                </Text>
                            </View>
                        </View>
                    }
                    <View className="cu-item">
                        <View className="content">
                            <Text className="text-black">订单状态：
                                {info.status == -1 && <Text className="text-gray">已取消</Text>}
                                {info.status == 0 && <Text className="text-red">待支付</Text>}
                                {info.status == 1 && <Text className="text-orange">待发货</Text>}
                                {info.status == 2 && <Text className="text-red">待收货</Text>}
                                {info.status == 3 && <Text className={'text-gray'}>已完成</Text>}
                            </Text>
                        </View>
                    </View>
                    <View className="cu-item">
                        <View className="content">
                            <Text
                                className="text-black">下单时间：{moment(info.createdAt).format("YYYY-MM-DD HH:mm:ss")}</Text>
                        </View>
                    </View>
                    <View className="cu-item">
                        <View className="content">
                            <Text
                                className="text-black">支付时间：{info.payedAt && moment(info.payedAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
                        </View>
                    </View>
                    <View className="cu-item">
                        <View className="content">
                            <Text
                                className="text-black">发货时间：{info.deliveryAt && moment(info.deliveryAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
                        </View>
                    </View>
                    <View className="cu-item">
                        <View className="content">
                            <Text
                                className="text-black">收货时间：{info.confirmedAt && moment(info.confirmedAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
                        </View>
                    </View>
                    <View className="cu-item">
                        <View className="content">
                            <Text
                                className="text-black">取消时间：{info.canceledAt && moment(info.canceledAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View className="cu-card bg-white radius-lg margin" style={{marginTop: 0}}>
                <View className="cu-bar">
                    <View className="action">
                        <Text className="cuIcon-titles text-orange"/>
                        <Text className="text-bold">物流信息</Text>
                    </View>
                </View>
                <View className="cu-list menu">
                    <View className="cu-item">
                        <View className="content">
                            <Text className="text-black">配送方式：{info.deliveryType == 1 ? '快递配送' : '上门自提'}</Text>
                        </View>
                    </View>
                    {info.deliveryType == 1 &&
                        <>
                            <View className="cu-item">
                                <View className="content">
                                    <Text className="text-black">快递单号：{info.deliveryNumber}</Text>
                                </View>
                            </View>
                            <View className="cu-item">
                                <View className="content">
                                    <Text className="text-black">收货人：{info.username}</Text>
                                </View>
                            </View>
                            <View className="cu-item">
                                <View className="content">
                                    <Text className="text-black">联系电话：{info.mobile}</Text>
                                </View>
                                {info.mobile &&
                                    <View className="action">
                                        <Text className="cuIcon-dianhua text-orange" style={{fontSize: '48rpx'}}
                                              onClick={() => Taro.makePhoneCall({phoneNumber: info.mobile})}/>
                                    </View>
                                }
                            </View>
                            <View className="cu-item">
                                <View className="content">
                                    <Text className="text-black">详细地址：{info.province} {info.city} {info.district} {info.address}</Text>
                                </View>
                                <View className="action">
                                    <Text className="cuIcon-locationfill text-orange" style={{fontSize: '48rpx'}}
                                          onClick={() => startNavigation(info)}/>
                                </View>
                            </View>
                        </>
                    }
                    {info.deliveryType == 2 &&
                        <View className="cu-item">
                            <View className="content">
                                <Text className="text-black">自提时间：{info.salfTakeAt}</Text>
                            </View>
                        </View>
                    }
                </View>
            </View>

            <View className="cu-card bg-white radius-lg margin" style={{marginTop: 0}}>
                <View className="cu-bar">
                    <View className="action">
                        <Text className="cuIcon-titles text-orange"/>
                        <Text className="text-bold">商品信息</Text>
                    </View>
                </View>
                <View className="cu-list menu-avatar">
                    {info.goods?.map((g: any) => {
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
            </View>


            <View className="cu-card bg-white radius-lg margin" style={{marginTop: 0}}>
                <View className="cu-bar">
                    <View className="action">
                        <Text className="cuIcon-titles text-orange"/>
                        <Text className="text-bold">结算信息</Text>
                    </View>
                </View>
                <View className="cu-list menu">
                    {prices && prices.length > 0 &&
                        <View className="cu-item">
                            <View className="content">
                                实际支付<Text style={{color: 'red'}}>￥{info?.actualPrice.toFixed(2)}</Text> = 商品总价<Text
                                style={{color: 'red'}}>￥{info?.totalPrice.toFixed(2)}</Text>
                                {prices.map((item: any) => {
                                    return item.amount < 0 ?
                                        <> - {item.description}<Text
                                            style={{color: 'red'}}>￥{Math.abs(item.amount.toFixed(2))}</Text></> :
                                        <> + {item.description}<Text
                                            style={{color: 'red'}}>￥{item.amount.toFixed(2)}</Text></>;
                                })}
                            </View>
                        </View>
                    }
                </View>
            </View>

            <View style={{height: '140rpx'}}/>
            <View style={{position: 'fixed', bottom: 0, width: '100%'}}>
                {parseInt(info.status) === 1 &&
                    <View className="flex" style={{width: '100%'}}>
                        <Button style={{paddingBottom: isIpx ? '40rpx' : 0, boxSizing: 'content-box'}}
                                onClick={() => setConfirmVisible(true)} disabled={posting} loading={posting}
                                className="flex-sub cu-btn bg-gradual-orange shadow block xl no-radius">确认发货</Button>
                    </View>
                }
            </View>

            {confirmVisible &&
                <View className="cu-modal show">
                    <Form onSubmit={confirmOrder}>
                        <View className="cu-dialog">
                            <View className="cu-bar bg-white justify-end">
                                <View className="content">确认发货</View>
                                <View className="action" onClick={() => setConfirmVisible(false)}>
                                    <Text className="cuIcon-close text-red"/>
                                </View>
                            </View>
                            <View className="padding bg-white">
                                <View className="cu-form-group align-start">
                                    <View className="title text-bold">快递单号</View>
                                    <Textarea name="deliveryNumber" style={{textAlign: 'left', height: '200rpx'}}
                                              maxlength={-1}
                                              placeholder="输入快递单号并发货"/>
                                </View>
                            </View>
                            <View className="cu-bar bg-white justify-end">
                                <View className="action">
                                    <Button className="cu-btn line-orange text-orange"
                                            onClick={() => setConfirmVisible(false)}>取消</Button>
                                    <Button formType={'submit'} loading={posting} disabled={posting}
                                            className="cu-btn bg-orange margin-left">确定</Button>
                                </View>
                            </View>
                        </View>
                    </Form>
                </View>
            }


        </PageLayout>
    );
}


export default withLogin(ShopOrderDetail)
