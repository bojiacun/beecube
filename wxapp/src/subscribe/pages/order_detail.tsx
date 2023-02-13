import Taro, {useDidShow, useRouter} from '@tarojs/taro';
import {useState} from "react";
import request, {
    API_SITES_INFO,
    API_SUBSCRIBE_GOODS_ORDERS,
    API_SUBSCRIBE_GOODS_ORDERS_CANCEL,
    API_SUBSCRIBE_GOODS_ORDERS_CONFIRM, API_SUBSCRIBE_GOODS_PAYLOSSORDER, API_SUBSCRIBE_GOODS_PAYORDER,
    resolveUrl,
    SERVICE_WINKT_ORDER_HEADER, SERVICE_WINKT_SYSTEM_HEADER
} from "../../utils/request";
import PageLayout from "../../layouts/PageLayout";
import {Button, Text, View, Navigator, Image} from "@tarojs/components";
import withLogin from "../../components/login/login";
import ContentLoading from "../../components/contentloading";
import moment from 'moment';

const SubscribeOrderDetail = () => {
    const [info, setInfo] = useState<any>(null);
    const [site, setSite] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);
    const [posting, setPosting] = useState<boolean>(false);
    const [qrcode, setQrcode] = useState<any>();
    const {params} = useRouter();


    const loadData = () => {
        request.get(API_SUBSCRIBE_GOODS_ORDERS + '/' + params.id, SERVICE_WINKT_ORDER_HEADER, null, true).then(res => {
            setLoading(false);
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
            request.get("wxapp/subscribe/orders/qrcode/" + params.id, SERVICE_WINKT_ORDER_HEADER, null, true, 'arraybuffer').then(res => {
                setQrcode(Taro.arrayBufferToBase64(res.data));
            });
            request.get(API_SITES_INFO + "/" + _info.siteId, SERVICE_WINKT_SYSTEM_HEADER, null, false).then(res => {
                setSite(res.data.data);
            });
        });

    }


    useDidShow(() => {
        loadData();
    });

    if (loading || !info) {
        return (
            <PageLayout statusBarProps={{title: '借阅订单详情'}}>
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
        request.post(API_SUBSCRIBE_GOODS_PAYORDER, SERVICE_WINKT_ORDER_HEADER, data, true).then((res) => {
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

    const doLossPay = () => {
        setPosting(true);
        let data = {
            orderId: info.id,
            payType: 1,
        };
        request.post(API_SUBSCRIBE_GOODS_PAYLOSSORDER, SERVICE_WINKT_ORDER_HEADER, data, true).then((res) => {
            let data = res.data.data;
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
            setPosting(false);
        }).catch(() => setPosting(false))
    }
    //确认收货
    const doConfirm = () => {
        setPosting(true);
        request.put(API_SUBSCRIBE_GOODS_ORDERS_CONFIRM + '/' + info.id, SERVICE_WINKT_ORDER_HEADER, null, true).then(() => {
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
                    request.put(API_SUBSCRIBE_GOODS_ORDERS_CANCEL + '/' + info.id, SERVICE_WINKT_ORDER_HEADER, null, true).then(() => {
                        loadData();
                        setPosting(false);
                    }).catch(() => setPosting(false))
                }
            }
        });
    }

    return (
        <PageLayout statusBarProps={{title: '借阅订单详情'}}>
            <View className="cu-card bg-white radius-lg margin">
                <View className="cu-bar">
                    <View className="action">
                        <Text className="cuIcon-titles text-orange"/>
                        <Text className="text-bold">门店信息</Text>
                    </View>
                </View>
                {site &&
                    <View className={'cu-list menu'}>
                        <View className="cu-item">
                            <View className="content padding-top-sm padding-bottom-sm">
                                <View>借阅门店：{site.name}</View>
                            </View>
                        </View>
                        <View className='cu-item'>
                            <View className="content">
                                <View>门店地址：{site.address}</View>
                            </View>
                        </View>
                        <View className='cu-item'>
                            <View className="content">
                                <View>门店联系人：{site.contactor}</View>
                            </View>
                        </View>
                        <View className='cu-item'>
                            <View className="content">
                                <View>联系电话：{site.contact}</View>
                            </View>
                        </View>
                        <View className='cu-item'>
                            <View className="content">
                                <View>借阅时长：{site.subscribeDays} 天</View>
                            </View>
                        </View>
                        <View className='cu-item'>
                            <View className="content">
                                <View>滞纳金：{site.lateFee}元 本/天</View>
                            </View>
                        </View>
                    </View>
                }
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
                                {info.status == -1 && <Text className="text-gray">已取消</Text>}
                                {info.status == 0 && <Text className="text-yellow">待支付</Text>}
                                {info.status == 1 && <Text className="text-orange">待出库</Text>}
                                {info.status == 2 && <Text className="text-red">待收货</Text>}
                                {info.status == 3 && <Text className="text-green">借阅中</Text>}
                                {info.status == 4 && <Text className="text-gray">归还中</Text>}
                                {info.status == 5 && <Text className="text-gray">已归还</Text>}
                                {info.status == 6 && <Text className="text-orange">损坏确认中</Text>}
                                {info.status == 7 && <Text className="text-red">待赔付</Text>}
                                {info.status == 8 && <Text className="text-gray">已损坏</Text>}
                                {info.status == 9 && <Text className="text-gray">已丢失</Text>}
                            </Text>
                        </View>
                    </View>
                    <View className="cu-item">
                        <View className="content">
                            <Text className="text-black">已支付：{info.actualPrice.toFixed(2)}</Text>
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
                    {info.deliveryType == 1 &&
                        <>
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
                        </>
                    }
                    {info.deliveryType == 2 &&
                        <>
                            <View className="cu-item">
                                <View className="content">
                                    <Text
                                        className="text-black">取书时间：{info.confirmedAt && moment(info.confirmedAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
                                </View>
                            </View>
                        </>
                    }
                    <View className="cu-item">
                        <View className="content">
                            <Text
                                className="text-black">归还时间：{info.completeAt && moment(info.completeAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View className="cu-card bg-white radius-lg margin">
                <View className="cu-bar">
                    <View className="action">
                        <Text className="cuIcon-titles text-orange"/>
                        <Text className="text-bold">借阅人信息</Text>
                    </View>
                </View>
                <View className="cu-list menu">
                    <View className="cu-item">
                        <View className="content">
                            <Text className="text-black">姓名：{info.borrowerName}</Text>
                        </View>
                    </View>
                    {info.schoolId &&
                        <>
                            <View className="cu-item">
                                <View className="content">
                                    <Text className="text-black">学校：{info.schoolName}</Text>
                                </View>
                            </View>
                            <View className="cu-item">
                                <View className="content">
                                    <Text className="text-black">年级：{info.schoolLevel}</Text>
                                </View>
                            </View>
                            <View className="cu-item">
                                <View className="content">
                                    <Text className="text-black">班级：{info.schoolClass}</Text>
                                </View>
                            </View>
                        </>
                    }
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
                        {qrcode &&
                            <Image src={'data:image/png;base64,' + qrcode} mode="widthFix" style={{width: '100%'}}/>}
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
                <View className="cu-list menu-avatar margin-bottom-sm">
                    {info.goods.map((item: any) => {
                        return (
                            <View className="cu-item">
                                <View className="cu-avatar radius lg"
                                      onClick={()=>Taro.navigateTo({url: `detail?id=${item.goodsId}`}).then()}
                                      style={{backgroundImage: 'url(' + resolveUrl(item.images[0]) + ')'}}/>
                                <View className="content">
                                    <View className="text-black text-cut"
                                          onClick={()=>Taro.navigateTo({url: `detail?id=${item.goodsId}`}).then()}
                                    >{item.name}</View>
                                    <View className="text-red">￥{item.price} X {item.count}</View>
                                </View>
                                <View className="action">
                                    {info.status == 3 && <Navigator className='cu-btn sm round line-black' url={`new_service?id=${item.id}`}>损坏或丢失</Navigator>}
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>

            {info.status >= 7 &&
                <View className='cu-card bg-white radius-lg margin' style={{marginTop: 0}}>
                    <View className="cu-bar">
                        <View className="action">
                            <Text className="cuIcon-titles text-orange"/>
                            <Text className="text-bold">赔付信息</Text>
                        </View>
                    </View>
                    <View className="cu-list menu">
                        <View className="cu-item">
                            <View className="content">
                                <Text className="text-black">赔付类型：{info.lossType == 1 ? '图书损坏' : '图书丢失'}</Text>
                            </View>
                        </View>
                        <View className="cu-item">
                            <View className="content">
                                <Text className="text-black">赔付金额：￥{(info.lateFee + info.lossFee)} =
                                    滞纳金￥{info.lateFee} + 图书成本￥{info.lossFee}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            }

            <View style={{height: '140rpx'}}/>
            <View className={'flex'} style={{position: 'fixed', bottom: 0, width: '100%'}}>
                {info.status == 0 &&
                    <Button style={{boxSizing: 'content-box', paddingTop: '10rpx'}}
                            onClick={doPay} disabled={posting} loading={posting}
                            className="cu-btn block xl flex-direction no-radius bg-gradual-green shadow">
                        <View>立即支付</View>
                    </Button>
                }
                {parseInt(info.status) === 1 &&
                    <Button onClick={doCancel}
                            disabled={posting} loading={posting}
                            className="cu-btn block flex-sub xl no-radius bg-red safe-bottom">取消订单</Button>}
                {parseInt(info.status) === 2 &&
                    <Button onClick={doConfirm}
                            disabled={posting} loading={posting}
                            className="cu-btn block flex-sub xl no-radius bg-green safe-bottom">确认收货</Button>}
                {parseInt(info.status) === 3 &&
                    <Navigator className={'cu-btn safe-bottom flex-sub block xl no-radius bg-green'}
                               url={`giveback?id=${info?.id}`}>去归还</Navigator>}
                {parseInt(info.status) === 7 && <Button onClick={doLossPay} disabled={posting} loading={posting}
                                                        className="cu-btn block flex-sub xl no-radius bg-red safe-bottom">立即赔付</Button>}
            </View>
        </PageLayout>
    );
}


export default withLogin(SubscribeOrderDetail)
