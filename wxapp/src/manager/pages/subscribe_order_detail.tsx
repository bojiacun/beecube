import Taro, {useReady, useRouter} from '@tarojs/taro';
import {useState} from "react";
import request, {
    API_SUBSCRIBE_GOODS_ORDERS,
    API_SUBSCRIBE_GOODS_PAYORDER,
    resolveUrl,
    SERVICE_WINKT_ORDER_HEADER
} from "../../utils/request";
import PageLayout from "../../layouts/PageLayout";
import {Button, Text, View, Form, Textarea, Navigator} from "@tarojs/components";
import withLogin from "../../components/login/login";
import ContentLoading from "../../components/contentloading";
import moment from 'moment';

const SubscribeOrderDetail = ({isIpx}) => {
    const [info, setInfo] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [posting, setPosting] = useState<boolean>(false);
    const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
    const {params} = useRouter();


    const loadData = () => {
        setLoading(true);
        request.get(API_SUBSCRIBE_GOODS_ORDERS + '/' + params.id, SERVICE_WINKT_ORDER_HEADER, null, true).then(res => {
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
            setLoading(false);
        });
    }

    useReady(() => {
        loadData();
    })

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

    //快递发货
    const confirmOrder = (e) => {
        let data = e.detail.value;
        setPosting(true);
        request.put("wxapp/manager/subscribe/orders/" + info.id + "/delivery", SERVICE_WINKT_ORDER_HEADER, data.deliveryNumber, true).then((res) => {
            setInfo(res.data.data);
            setConfirmVisible(false);
            setPosting(false);
        }).catch(() => setPosting(false));
    }
    //扫码核销
    const scanConfirm = () => {
        Taro.showModal({title: '友情提醒', content: '确定要核销该订单吗？'}).then(res => {
            if (res.confirm) {
                setPosting(true);
                request.put("wxapp/manager/subscribe/orders/" + info.id + "/scan_confirm", SERVICE_WINKT_ORDER_HEADER, null, true).then((res) => {
                    setInfo(res.data.data);
                    setPosting(false);
                }).catch(() => setPosting(false));
            }
        });
    }
    //上门自提确认出库
    const deliveryConfirm = () => {
        Taro.showModal({title: '友情提醒', content: '确定要执行出库操作吗？'}).then(res => {
            if (res.confirm) {
                setPosting(true);
                request.put("wxapp/manager/subscribe/orders/" + info.id + "/delivery", SERVICE_WINKT_ORDER_HEADER, null, true).then((res) => {
                    setInfo(res.data.data);
                    setPosting(false);
                }).catch(() => setPosting(false));
            }
        });
    }
    //确认归还无误
    const confirmGiveback = () => {
        Taro.showModal({title: '友情提醒', content: '确定要归还该订单吗?'}).then(res => {
            if (res.confirm) {
                setPosting(true);
                request.put("wxapp/manager/subscribe/orders/" + info.id + "/giveback", SERVICE_WINKT_ORDER_HEADER, null, true).then((res) => {
                    setInfo(res.data.data);
                    setPosting(false);
                }).catch(() => setPosting(false));
            }
        });
    }


    return (
        <PageLayout statusBarProps={{title: '借阅订单详情'}}>
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
                            <Text className="text-black">滞纳金：{info.actualPrice.toFixed(2)}</Text>
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
                                        className="text-black">发货人：{info.deliveryMemberName}</Text>
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
                                        className="text-black">确认收货人：{info.confirmMemberName}</Text>
                                </View>
                            </View>
                        </>
                    }
                    {info.deliveryType == 2 &&
                        <>
                            <View className="cu-item">
                                <View className="content">
                                    <Text
                                        className="text-black">出库时间：{info.deliveryAt && moment(info.deliveryAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
                                </View>
                            </View>
                            <View className="cu-item">
                                <View className="content">
                                    <Text
                                        className="text-black">出库人：{info.deliveryMemberName}</Text>
                                </View>
                            </View>
                            <View className="cu-item">
                                <View className="content">
                                    <Text
                                        className="text-black">核销时间：{info.confirmedAt && moment(info.confirmedAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
                                </View>
                            </View>
                            <View className="cu-item">
                                <View className="content">
                                    <Text
                                        className="text-black">核销人：{info.confirmMemberName}</Text>
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
                    <View className="cu-item">
                        <View className="content">
                            <Text
                                className="text-black">确认归还人：{info.completeOperatorName}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View className="cu-card bg-white radius-lg margin">
                <View className="cu-bar">
                    <View className="action">
                        <Text className="cuIcon-titles text-orange"/>
                        <Text className="text-bold">下单人信息</Text>
                    </View>
                </View>
                <View className="cu-list menu-avatar">
                    <View className="cu-item">
                        <View className={'cu-avatar rouond'}
                              style={{backgroundImage: 'url(' + resolveUrl(info.memberAvatar) + ')'}}/>
                        <View className="content">
                            <Text>{info.memberNickname}</Text>
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
                    {info.schoolClass &&
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
                            <Navigator url={`subscribe_detail?id=${item.goodsId}`} className="cu-item">
                                <View className="cu-avatar radius lg"
                                      style={{backgroundImage: 'url(' + resolveUrl(item.images[0]) + ')'}}/>
                                <View className="content">
                                    <View className="text-black text-cut">{item.name}</View>
                                    <View className="text-red">￥{item.price}</View>
                                </View>
                                <View className="action" style={{width: '180rpx'}}>
                                    <View className="text-gray"> X {item.count}</View>
                                </View>
                            </Navigator>
                        );
                    })}
                </View>
            </View>

            {info.status == 4 &&
                <View className="cu-card bg-white radius-lg margin" style={{marginTop: 0}}>
                    <View className="cu-bar">
                        <View className="action">
                            <Text className="cuIcon-titles text-orange"/>
                            <Text className="text-bold">归还信息</Text>
                        </View>
                    </View>
                    <View className="cu-list menu">
                        <View className="cu-item">
                            <View className="content">
                                <Text className="text-black">归还方式：{info.refundType == 1 ? '快递配送' : '上门归还'}</Text>
                            </View>
                        </View>
                        {info.refundType == 1 &&
                            <>
                                <View className="cu-item">
                                    <View className="content">
                                        <Text className="text-black">快递单号：{info.refundDeliveryNumber}</Text>
                                    </View>
                                </View>
                            </>
                        }
                    </View>
                </View>
            }

            <View style={{height: '140rpx'}}/>
            <View className={'flex'} style={{position: 'fixed', bottom: 0, width: '100%'}}>
                {info.requirePay &&
                    <Button style={{boxSizing: 'content-box', paddingTop: '10rpx'}}
                            onClick={doPay} disabled={posting} loading={posting}
                            className="cu-btn block xl flex-direction no-radius bg-gradual-green shadow">
                        <View>立即支付</View>
                    </Button>
                }
                {/*快递发货*/}
                {parseInt(info.status) === 1 && parseInt(info.deliveryType) === 1 &&
                    <View className="flex" style={{width: '100%'}}>
                        <Button style={{paddingBottom: isIpx ? '40rpx' : 0, boxSizing: 'content-box'}}
                                onClick={() => setConfirmVisible(true)} disabled={posting} loading={posting}
                                className="flex-sub cu-btn bg-orange shadow block xl no-radius">确认发货</Button>
                    </View>
                }
                {/*确认出库*/}
                {parseInt(info.status) === 1 && parseInt(info.deliveryType) === 2 &&
                    <View className="flex" style={{width: '100%'}}>
                        <Button style={{paddingBottom: isIpx ? '40rpx' : 0, boxSizing: 'content-box'}}
                                onClick={deliveryConfirm} disabled={posting} loading={posting}
                                className="flex-sub cu-btn bg-orange shadow block xl no-radius">确认出库</Button>
                    </View>
                }
                {/*扫码核销*/}
                {parseInt(info.status) === 2 && parseInt(info.deliveryType) === 2 &&
                    <View className="flex" style={{width: '100%'}}>
                        <Button style={{paddingBottom: isIpx ? '40rpx' : 0, boxSizing: 'content-box'}}
                                onClick={scanConfirm} disabled={posting} loading={posting}
                                className="flex-sub cu-btn bg-orange shadow block xl no-radius">确认核销</Button>
                    </View>
                }
                {(parseInt(info.status) === 4 || parseInt(info.status) === 3) &&
                    <View className="flex" style={{width: '100%'}}>
                        <Button style={{paddingBottom: isIpx ? '40rpx' : 0, boxSizing: 'content-box'}}
                                onClick={confirmGiveback} disabled={posting} loading={posting}
                                className="flex-sub cu-btn bg-red shadow block xl no-radius">确认已归还</Button>
                    </View>
                }
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
            </View>
        </PageLayout>
    );
}


export default withLogin(SubscribeOrderDetail)
