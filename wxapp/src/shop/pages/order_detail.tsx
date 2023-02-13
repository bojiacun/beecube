import Taro, {useDidShow, useReady, useRouter} from '@tarojs/taro';
import {useState} from "react";
import request, {
    API_SHOP_GOODS_ORDERS_CANCEL,
    API_SHOP_GOODS_ORDERS_CONFIRM,
    API_SHOP_GOODS_ORDERS_INFO,
    API_SHOP_GOODS_PAYORDER,
    resolveUrl,
    SERVICE_WINKT_ORDER_HEADER
} from "../../utils/request";
import PageLayout from "../../layouts/PageLayout";
import {Button, Text, View, Navigator, Image} from "@tarojs/components";
import withLogin from "../../components/login/login";
import ContentLoading from "../../components/contentloading";
import moment from 'moment';
import {CountDown} from '../../components/CountDown';

const ShopOrderDetail = ({isIpx}) => {
    const [info, setInfo] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [posting, setPosting] = useState<boolean>(false);
    const [prices, setPrices] = useState<any[]>([]);
    const [qrcode, setQrcode] = useState<any>();
    const {params} = useRouter();


    const loadData = () => {
        request.get(API_SHOP_GOODS_ORDERS_INFO + '/' + params.id, SERVICE_WINKT_ORDER_HEADER, null, true).then(res => {
            let _info = res.data.data;
            _info.goods.forEach(g => {
                g.images = g.images.split(',');
            })
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
            return request.get("wxapp/subscribe/orders/qrcode/"+params.id, SERVICE_WINKT_ORDER_HEADER, null, true, 'arraybuffer').then(res => {
                setQrcode(Taro.arrayBufferToBase64(res.data));
            });
        });

    }

    useReady(() => {
        setLoading(true);
    })
    useDidShow(()=>{
        loadData();
    });

    if (loading || !info) {
        return (
            <PageLayout statusBarProps={{title: '商城订单详情'}}>
                <ContentLoading/>
            </PageLayout>
        );
    }

    const doPay = () => {
        setPosting(true);
        let data = {
            orderId: info.id,
            payType: info.paytype,
        };
        request.post(API_SHOP_GOODS_PAYORDER, SERVICE_WINKT_ORDER_HEADER, data, true).then((res) => {
            let data = res.data.data;
            if (data.paytype === 1) {
                data.pay.package = data.pay.packageValue;
                delete data.pay.packageValue;
                //需要微信支付
                Taro.requestPayment(data.pay).then(() => {
                    Taro.showToast({title: '支付成功！', icon: 'success'}).then(() => {
                        setTimeout(() => {
                            Taro.navigateBack().then()
                        }, 1000);
                    });
                })
            }
            if (data.paytype === 2) {
                //支付已经完成，提醒支付成功并返回上一页面
                Taro.showToast({title: '支付成功！', icon: 'success'}).then(() => {
                    setTimeout(() => {
                        Taro.navigateBack().then()
                    }, 1000);
                });
            }
            setPosting(false);
        }).catch(() => setPosting(false))
    }
    //确认收货
    const doConfirm = () => {
        setPosting(true);
        request.put(API_SHOP_GOODS_ORDERS_CONFIRM + '/' + info.id, SERVICE_WINKT_ORDER_HEADER, null, true).then(() => {
            loadData();
            setPosting(false);
        }).catch(() => setPosting(false))
    }
    //取消订单
    const doCancel = () => {
        Taro.showModal({
            title: '取消提醒', content: '确定要取消订单吗，取消后不可恢复', success(res) {
                if (res.confirm) {
                    setPosting(true);
                    request.put(API_SHOP_GOODS_ORDERS_CANCEL + '/' + info.id, SERVICE_WINKT_ORDER_HEADER, null, true).then(() => {
                        loadData();
                        setPosting(false);
                    }).catch(() => setPosting(false))
                }
            }
        });
    }

    return (
        <PageLayout statusBarProps={{title: '商城订单详情'}}>
            <View className="cu-card bg-white radius-lg margin">
                <View className="cu-bar">
                    <View className="action">
                        <Text className="cuIcon-titles text-orange"/>
                        <Text className="text-bold">门店信息</Text>
                    </View>
                </View>
                <View className="cu-list menu">
                    <View className="cu-item">
                        <View className="content">
                            <Text className="text-black">门店名称：{info.siteName}</Text>
                        </View>
                    </View>
                </View>
            </View>
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
                    </View>
                    <View className="cu-item">
                        <View className="content">
                            <Text className="text-black">
                                订单状态：
                                {info.status == 0 && <Text className="text-yellow">待支付</Text>}
                                {info.status == 1 && <Text className="text-orange">待发货</Text>}
                                {info.status == 2 && <Text className="text-red">待收货</Text>}
                                {info.status == 3 && <Text className="text-orange">已完成</Text>}
                                {info.status == -1 && <Text className="text-grey">已取消</Text>}
                            </Text>
                        </View>
                    </View>
                    <View className="cu-item">
                        <View className="content">
                            <Text className="text-black">
                                支付方式：
                                {info.payType == 1 && <Text className="text-green">微信支付</Text>}
                                {info.payType == 2 && <Text className="text-orange">余额支付</Text>}
                            </Text>
                        </View>
                    </View>
                    <View className="cu-item">
                        <View className="content">
                            <Text className="text-black">商品总额：{info.totalPrice.toFixed(2)}</Text>
                        </View>
                    </View>
                    <View className="cu-item">
                        <View className="content">
                            <Text className="text-black">实际支付：{info.actualPrice.toFixed(2)}</Text>
                        </View>
                    </View>
                    <View className="cu-item">
                        <View className="content">
                            <Text
                                className="text-black">下单时间：{moment(info.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
                        </View>
                    </View>
                    <View className="cu-item">
                        <View className="content">
                            <Text
                                className="text-black">支付时间：{info.payedAt ? moment(info.payedAt).format('YYYY-MM-DD HH:mm:ss') : ''}</Text>
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
                                className="text-black">完成时间：{info.completeAt && moment(info.completeAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View className="cu-card bg-white radius-lg margin" style={{marginTop: 0}}>
                <View className="cu-bar">
                    <View className="action">
                        <Text className="cuIcon-titles text-orange"/>
                        <Text className="text-bold">配送信息</Text>
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
                            </View>
                            <View className="cu-item">
                                <View className="content">
                                    <Text className="text-black">详细地址：{info.address}</Text>
                                </View>
                            </View>
                        </>
                    }
                    {info.deliveryType == 2 &&
                        <View className="cu-item">
                            <View className="content">
                                <Text className="text-black">自提时间：{info.selfTakeAt}</Text>
                            </View>
                        </View>
                    }
                </View>
            </View>
            {info.deliveryType == 2 && info.status == 1 &&
                <View className='cu-card bg-white radius-lg margin' style={{marginTop: 0}}>
                    <View className="cu-bar">
                        <View className="action">
                            <Text className="cuIcon-titles text-orange"/>
                            <Text className="text-bold">提货码</Text>
                        </View>
                    </View>
                    <View>
                        {qrcode && <Image src={'data:image/png;base64,'+qrcode} mode="widthFix" style={{width: '100%'}} />}
                    </View>
                </View>
            }

            <View className="cu-card bg-white radius-lg margin" style={{marginTop: 0}}>
                <View className="cu-bar">
                    <View className="action">
                        <Text className="cuIcon-titles text-orange"/>
                        <Text className="text-bold">商品信息</Text>
                    </View>
                </View>
                <View className="cu-list menu-avatar">
                    {info.goods.map((item: any) => {
                        return (
                            <View className="cu-item">
                                <View className="cu-avatar radius lg"
                                      style={{backgroundImage: 'url(' + resolveUrl(item.images[0]) + ')'}}/>
                                <View className="content">
                                    <View className="text-black text-cut">{item.name}</View>
                                    <View className="text-red">￥{item.price} X {item.count}</View>
                                </View>
                                <View className="action" style={{width: '180rpx'}}>
                                    <View className="text-gray">
                                        {item.count > item.afterCount && parseInt(info.status) == 3 &&
                                        <Navigator className='cu-btn sm round line-black' url={`new_service?id=${item.id}`}>售后</Navigator>
                                        }
                                    </View>
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
                {parseInt(info.status) === 0 &&
                    <Button
                        style={{paddingBottom: isIpx ? '40rpx' : 0, boxSizing: 'content-box', paddingTop: '10rpx'}}
                        onClick={doPay} disabled={posting} loading={posting}
                        className="cu-btn block xl flex-direction no-radius bg-gradual-green shadow">
                        <View>立即支付</View>
                        {info.cancelTime && <View className="text-sm margin-top-sm"><CountDown
                            endTime={moment(info.cancelTime).format('YYYY-MM-DD HH:mm:ss')}/></View>}
                    </Button>
                }
                {parseInt(info.status) === 1 &&
                    <Button style={{paddingBottom: isIpx ? '40rpx' : 0, boxSizing: 'content-box'}}
                            onClick={doCancel} disabled={posting} loading={posting}
                            className="cu-btn block xl no-radius bg-gradual-red shadow">取消订单</Button>}
                {parseInt(info.status) === 2 &&
                    <Button style={{paddingBottom: isIpx ? '40rpx' : 0, boxSizing: 'content-box'}}
                            onClick={doConfirm} disabled={posting} loading={posting}
                            className="cu-btn block xl no-radius bg-gradual-green shadow">确认收货</Button>}
            </View>
        </PageLayout>
    );
}


export default withLogin(ShopOrderDetail)
