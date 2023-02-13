import {useEffect, useState} from "react";
import Taro, {useRouter, useReady, useDidShow} from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import {Button, Text, View, Switch, Navigator} from "@tarojs/components";
import request, {
    API_MEMBER_ADDRESS_DEFAULT,
    API_MEMBER_INFO, API_SHOP_GOODS_CREATEORDER, API_SHOP_GOODS_LIST_IDS,
    API_SHOP_GOODS_PREPAY, API_SITES_INFO,
    resolveUrl,
    SERVICE_WINKT_MEMBER_HEADER,
    SERVICE_WINKT_ORDER_HEADER, SERVICE_WINKT_SYSTEM_HEADER,
} from "../../utils/request";
import withLogin from "../../components/login/login";
import classNames from "classnames";
import {removeShopCart} from "../../global";
import DateTimePicker from "../../components/DateTimePicker";
import _ from "lodash";


const ShopConfirm = () => {
    const {params} = useRouter();
    const [time, setTime] = useState();
    const [selectedAddress, setSelectedAddress] = useState<any>(null);
    const [goods, setGoods] = useState<any[]>([]);
    const [sites, setSites] = useState<any[]>([]);
    const [coupons, setCoupons] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [posting, setPosting] = useState<boolean>(false);
    const [useMoney, setUseMoney] = useState<boolean>(true);
    const [useScore, setUseScore] = useState<boolean>(true);
    const [usedCoupon, setUsedCoupon] = useState<any>();
    const [payType, setPayType] = useState<number>(1);
    const [prices, setPrices] = useState<any[]>([]);
    const [preOrder, setPreOrder] = useState<any>();
    const [deliveryType, setDeliveryType] = useState<number>(params.in_site ? 2 : 1);


    useEffect(() => {
        if (goods.length > 0) {
            //清空优惠券使用
            let _goods = goods.map(item => ({
                goodsId: item.goodsId,
                count: item.count,
                seckillId: item.seckillId,
                seckillName: item.seckillName,
            }));
            let data = {
                deliveryType: 1,
                useMoney: useMoney,
                useScore: useScore,
                goods: _goods,
                pay: 1,
                addressId: selectedAddress?.id,
                couponTicketId: usedCoupon?.id,
            };
            request.put(API_SHOP_GOODS_PREPAY, SERVICE_WINKT_ORDER_HEADER, data, true).then(res => {
                let preorder = res.data.data;
                let prices = [];
                if (preorder.children == null || preorder.children.length == 0) {
                    prices = preorder.prices;
                } else {
                    preorder.children.forEach((o: any) => {
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
                setPreOrder(preorder);
            })
            //可用优惠券列表
            request.put("wxapp/shop/orders/coupons", SERVICE_WINKT_ORDER_HEADER, data, true).then(res => {
                let coupons = res.data.data;
                Taro.setStorageSync("AVAILABLE_COUPONS", coupons);
                setCoupons(coupons);
            })
        }
        return () => {
            Taro.removeStorageSync('USED_COUPON');
        }
    }, [useMoney, selectedAddress, goods, useScore, usedCoupon]);

    useReady(() => {
        let goods = Taro.getStorageSync("CART");
        goods = JSON.parse(goods) || [];
        let ids = params.id?.split(',') || [];
        request.get(API_SHOP_GOODS_LIST_IDS, SERVICE_WINKT_SYSTEM_HEADER, {ids: ids.join(',')}).then(res => {
            let newGoods = res.data.data;
            let selectedGoods = goods.filter(g => ids.indexOf(String(g.id)) >= 0).map(g => {
                let matches = newGoods.filter(ng => ng.id == g.id);
                if (matches && matches.length == 1) {
                    // g.price = matches[0].price;
                }
                return g;
            });
            setGoods(selectedGoods);
            let _sites = selectedGoods.map(item => item.site.id);
            _sites = _.uniq(_sites);
            console.log(_sites);
            if (_sites.length == 1) {
                request.get(API_SITES_INFO + "/" + _sites[0], SERVICE_WINKT_SYSTEM_HEADER, null, false).then(res => setSites([res.data.data]));
            }
            Taro.setStorageSync("CART", JSON.stringify(goods));
        })
        request.get(API_MEMBER_INFO, SERVICE_WINKT_MEMBER_HEADER, null, true).then(res => {
            setUser(res.data.data);
        });
    })
    useDidShow(() => {
        Taro.getStorage({key: 'address'}).then(result => {
            setSelectedAddress(result.data);
        }).catch(() => {
            request.get(API_MEMBER_ADDRESS_DEFAULT, SERVICE_WINKT_MEMBER_HEADER, null, true).then(res => {
                setSelectedAddress(res.data.data);
            })
        });
        Taro.getStorage({key: 'USED_COUPON'}).then(result => {
            setUsedCoupon(result.data);
        }).catch(() => {
            setUsedCoupon(undefined);
        });
    })


    const startPay = () => {
        setPosting(true);
        let _goods = goods.map(item => ({
            id: null,
            goodsId: item.goodsId,
            count: item.count,
            seckillId: item.seckillId,
            seckillName: item.seckillName,
        }));
        if (deliveryType == 2) {
            //自提需要填写自提时间
            if (!time) return Taro.showModal({title: '错误提醒', content: '请填写自提日期'});
        } else {
            if (!selectedAddress) return Taro.showModal({title: '错误提醒', content: '请选择收货地址'});
        }
        //计算实际需要支付价格
        request.post(API_SHOP_GOODS_CREATEORDER, SERVICE_WINKT_ORDER_HEADER, {
            deliveryType: deliveryType,
            useMoney: useMoney,
            selfTakeAt: time,
            useScore: useScore,
            goods: _goods,
            pay: 1,
            addressId: selectedAddress?.id,
            couponTicketId: usedCoupon?.id,
        }, true).then(res => {
            let data = res.data.data;
            if (data.paytype === 1 && data.pay) {
                //需要微信支付
                data.pay.package = data.pay.packageValue;
                Taro.requestPayment(data.pay).then(() => {
                    //支付已经完成，提醒支付成功并返回上一页面
                    Taro.showToast({title: '支付成功', duration: 2000}).then(() => {
                        setTimeout(() => {
                            //移除购物车中已下单的商品
                            _goods.forEach(_g => {
                                _g.id = _g.goodsId;
                                removeShopCart(_g);
                            });
                            Taro.redirectTo({url: 'success'}).then();
                        }, 2000);
                    });
                })
            } else {
                //支付已经完成，提醒支付成功并返回上一页面
                Taro.showToast({title: '支付成功', duration: 2000}).then(() => {
                    setTimeout(() => {
                        _goods.forEach(_g => {
                            _g.id = _g.goodsId;
                            removeShopCart(_g);
                        });
                        Taro.redirectTo({url: 'success'}).then();
                    }, 2000);
                });
            }
            setPosting(false);
            //清空购物车
            // Taro.removeStorageSync("CART");
        }).catch(() => setPosting(false))
    }
    const handleOnTimeChanged = (time) => {
        setTime(time);
    }
    let actualPay: number = preOrder ? preOrder.actualPrice.toFixed(2) : '--';

    return (
        <PageLayout statusBarProps={{title: '确认订单'}}>
            <View className="cu-list menu card-menu margin-top radius">
                <View className="bg-white nav">
                    <View className="flex text-center">
                        {!params.in_site &&
                            <View onClick={() => setDeliveryType(1)}
                                  className={classNames("cu-item flex-sub", deliveryType === 1 ? "text-orange cur" : "")}>
                                快递配送
                            </View>
                        }
                        {sites.length == 1 &&
                            <View onClick={() => setDeliveryType(2)}
                                  className={classNames("cu-item flex-sub", deliveryType === 2 ? "text-orange cur" : "")}>
                                上门自提
                            </View>
                        }
                    </View>
                </View>
                {deliveryType === 1 &&
                    <View className="cu-item" onClick={() => Taro.navigateTo({url: '/pages/my/address'})}>
                        <View className="content">
                            {
                                selectedAddress ?
                                    <View className="padding-top-sm padding-bottom-sm"
                                          style={{width: '100%', display: 'block'}}>
                                        <View className="">{selectedAddress.username} {selectedAddress.mobile}</View>
                                        <View>
                                            {selectedAddress.address}
                                        </View>
                                    </View>
                                    :
                                    <View>请选择收货地址</View>
                            }
                        </View>
                        <View className="action" onClick={() => Taro.navigateTo({url: '/pages/my/address'})}>
                            <Text className="cuIcon-right"/>
                        </View>
                    </View>
                }
                {deliveryType === 2 && sites.length == 1 &&
                    <>
                        <View className="cu-form-group">
                            <view className="title text-bold">自提时间</view>
                            <DateTimePicker name={'selfTakeAt'} format={'YYYY-MM-DD'} placeholder={'请选择自提时间'}
                                            onConfirm={handleOnTimeChanged} dateTime={[
                                {mode: 'day', duration: 2, unit: '日', humanity: true, format: 'M月D日'},
                            ]}/>
                        </View>
                        <View className="cu-form-group">
                            <view className="title text-bold">自提时间</view>
                            <View
                                className='text-gray padding-top-sm padding-bottom-sm'>本门店营业时间为{sites[0]?.businessHours}，请在营业时间内上门自提 </View>
                        </View>
                    </>
                }

            </View>

            {goods &&
                <View className="cu-list menu-avatar card-menu radius">
                    {goods.map(item => {
                        return (
                            <View className="cu-item">
                                <View className="cu-avatar lg"
                                      style={{backgroundImage: 'url(' + resolveUrl(item.images[0]) + ')'}}/>
                                <View className="content flex flex-direction justify-between"
                                      style={{height: '96rpx', overflow: 'hidden'}}>
                                    <View className="text-xl text-bold text-black">{item.name}</View>
                                    <View className="text-bold text-orange">￥{item.price}</View>
                                </View>
                                <View className="action">
                                    X {item.count}
                                </View>
                            </View>
                        );
                    })}
                </View>
            }

            {goods && user &&
                <View className="cu-list menu card-menu radius">
                    <View className="cu-item">
                        <View className="content flex justify-between">
                            <Text>余额抵扣</Text>
                        </View>
                        <View className="action">
                            <Switch className={'orange'} checked={useMoney} onChange={val => {
                                setUsedCoupon(undefined);
                                Taro.removeStorageSync("USED_COUPON");
                                setUseMoney(val.detail.value)
                            }}/>
                        </View>
                    </View>
                    <View className="cu-item">
                        <View className="content flex justify-between">
                            <Text>大小豆抵扣</Text>
                        </View>
                        <View className="action">
                            <Switch className={'orange'} checked={useScore} onChange={val => {
                                setUsedCoupon(undefined);
                                Taro.removeStorageSync("USED_COUPON");
                                setUseScore(val.detail.value)
                            }}/>
                        </View>
                    </View>
                    <Navigator url='coupons' className="cu-item">
                        <View className="content flex justify-between">
                            <Text>优惠券</Text>
                        </View>
                        <View className="action">
                            {!usedCoupon &&
                                <>
                                    <Text className='text-gray'>{coupons.length}张可用</Text>
                                    <Text className='cuIcon-right'/>
                                </>
                            }
                            {usedCoupon &&
                                <>
                                    <Text className='text-gray'>已选1张优惠券</Text>
                                    <Text className='cuIcon-right'/>
                                </>
                            }
                        </View>
                    </Navigator>
                </View>
            }
            <View className="cu-list menu card-menu radius">
                <View className="cu-bar bg-white solid-bottom">
                    <View className="action">
                        <Text className="cuIcon-titles text-orange"/>
                        <Text className="">费用明细</Text>
                    </View>
                </View>
                {prices.map((item: any) => {
                    return (
                        <View className="cu-item">
                            <View className="content flex justify-between">
                                <Text>{item.description}</Text>
                            </View>
                            <View className="action">
                                {item.amount > 0 ? `+${item.amount.toFixed(2)}` : item.amount.toFixed(2)}
                            </View>
                        </View>
                    );
                })}
            </View>

            <View className="cu-list menu card-menu radius">
                <View className="cu-bar bg-white">
                    <View className="action">
                        <Text className="cuIcon-titles text-orange"/>
                        <Text className="">支付方式</Text>
                    </View>
                </View>
                <View className="cu-item" onClick={() => setPayType(1)}>
                    <View className="content flex align-center">
                        <Text className="cuIcon-weixin text-orange" style={{fontSize: '48rpx'}}/>
                        <Text>微信支付</Text>
                    </View>
                    {payType === 1 &&
                        <View className="action">
                            <Text className="cuIcon-check text-bold text-orange" style={{fontSize: '32rpx'}}/>
                        </View>
                    }
                </View>
            </View>

            <View style={{height: '190rpx'}}/>
            <View className="cu-bar tabbar bg-white flex align-center justify-between"
                  style={{position: 'fixed', bottom: 0, width: '100%'}}>
                <View className="text-bold flex-sub padding-left">需支付: <Text
                    className="text-orange text-xl">￥{!preOrder ? '--' : actualPay}</Text></View>
                <Button loading={posting} disabled={posting || !preOrder}
                        className="cu-btn padding-xl block bg-gradual-orange"
                        style={{width: '300rpx', borderRadius: 0}} onClick={startPay}>立即支付</Button>
            </View>
        </PageLayout>
    );
}
export default withLogin(ShopConfirm)
