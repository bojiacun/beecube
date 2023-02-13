import {useEffect, useState} from "react";
import Taro, {useRouter, useReady, useDidShow} from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import {Button, Switch, Text, View} from "@tarojs/components";
import request, {
    API_MEMBER_ADDRESS_DEFAULT, API_MEMBER_CHILDREN_DEFAULT, API_MEMBER_INFO,
    API_SITES_INFO, API_SUBSCRIBE_GOODS_CREATEORDER, API_SUBSCRIBE_GOODS_LIST_IDS,
    API_SUBSCRIBE_GOODS_PREPAY,
    resolveUrl,
    SERVICE_WINKT_MEMBER_HEADER,
    SERVICE_WINKT_ORDER_HEADER, SERVICE_WINKT_SYSTEM_HEADER,
} from "../../utils/request";
import withLogin from "../../components/login/login";
import classNames from "classnames";
import {getSiteVip, removeSubscribeCart} from "../../global";
import DateTimePicker from "../../components/DateTimePicker";

const CART_KEY = 'SUBSCRIBE-CART';

const ShopConfirm = (props) => {
    const {context} = props;
    const {userInfo} = context;
    const {params} = useRouter();
    const [site, setSite] = useState<any>();
    const [user, setUser] = useState<any>(null);
    const [time, setTime] = useState<any>();
    const [selectedAddress, setSelectedAddress] = useState<any>(null);
    const [selectedChild, setSelectedChild] = useState<any>(null);
    const [goods, setGoods] = useState<any[]>([]);
    const [posting, setPosting] = useState<boolean>(false);
    const [preOrder, setPreOrder] = useState<any>();
    const [member, setMember] = useState<any>();
    const [payType, setPayType] = useState<number>(1);
    const [prices, setPrices] = useState<any[]>([]);
    const [useMoney, setUseMoney] = useState<boolean>(true);
    const [useScore, setUseScore] = useState<boolean>(true);
    const [deliveryType, setDeliveryType] = useState<number>( 2);

    useEffect(() => {
        if (goods.length > 0) {
            //清空优惠券使用
            let _goods = goods.map(item => ({
                id: null,
                goodsId: item.goodsId,
                count: item.count,
                seckillId: item.seckillId,
                seckillName: item.seckillName,
            }));
            let data = {
                deliveryType: deliveryType,
                goods: _goods,
                selfTakeAt: time,
                pay: 1,
                useMoney: useMoney,
                useScore: useScore,
                addressId: selectedAddress?.id,
                childId: selectedChild?.id,
                member_id: params.member_id??'',
                agent: params.agent,
            };
            request.put(API_SUBSCRIBE_GOODS_PREPAY, SERVICE_WINKT_ORDER_HEADER, data, true).then(res => {
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
        }
    }, [selectedAddress, goods, useMoney, useScore]);

    useReady(() => {
        let goods = Taro.getStorageSync(CART_KEY);
        goods = JSON.parse(goods) || [];
        let ids = params.id?.split(',') || [];
        request.get(API_SUBSCRIBE_GOODS_LIST_IDS, SERVICE_WINKT_SYSTEM_HEADER, {ids: ids.join(',')}).then(res => {
            let newGoods = res.data.data;
            let selectedGoods = goods.filter(g => ids.indexOf(String(g.id)) >= 0).map(g => {
                let matches = newGoods.filter(ng => ng.id == g.id);
                if (matches && matches.length == 1) {
                    // g.price = matches[0].price;
                }
                return g;
            });
            setGoods(selectedGoods);
            Taro.setStorageSync(CART_KEY, JSON.stringify(goods));
        })
        if (params.member_id) {
            request.get( "wxapp/members/" + params.member_id, SERVICE_WINKT_MEMBER_HEADER, null, false).then(res => {
                setMember(res.data.data);
            })
        }
        request.get(API_MEMBER_INFO, SERVICE_WINKT_MEMBER_HEADER, null, true).then(res => {
            setUser(res.data.data);
        });
    })
    useDidShow(() => {
        request.get(API_SITES_INFO + "/" + userInfo?.memberInfo?.siteId, SERVICE_WINKT_SYSTEM_HEADER, null, false).then(res => {
            setSite(res.data.data);
        });
        if(!params.agent) {
            Taro.getStorage({key: 'address'}).then(result => {
                setSelectedAddress(result.data);
            }).catch(() => {
                request.get(API_MEMBER_ADDRESS_DEFAULT, SERVICE_WINKT_MEMBER_HEADER, null, true).then(res => {
                    setSelectedAddress(res.data.data);
                })
            });
        }
        if(!params.agent) {
            Taro.getStorage({key: 'mychild'}).then(result => {
                setSelectedChild(result.data);
            }).catch(() => {
                request.get(API_MEMBER_CHILDREN_DEFAULT, SERVICE_WINKT_MEMBER_HEADER, {member_id: params.member_id??''}, true).then(res => {
                    setSelectedChild(res.data.data);
                })
            });
        }
        else {
            request.get(API_MEMBER_CHILDREN_DEFAULT, SERVICE_WINKT_MEMBER_HEADER, {member_id: params.member_id??''}, true).then(res => {
                setSelectedChild(res.data.data);
            })
        }

    })


    const startPay = () => {
        if (!selectedChild) return Taro.showModal({title: '错误提醒', content: '请选择借阅人'});
        if (!site) return Taro.showModal({title: '错误提醒', content: '您还没有绑定门店，无法借阅书籍'});

        if (deliveryType == 2) {
            //自提需要填写自提时间
            if (!time) return Taro.showModal({title: '错误提醒', content: '请填写自提日期'});
        }
        else {
            if (!selectedAddress) return Taro.showModal({title: '错误提醒', content: '请选择收货地址'});
        }

        setPosting(true);
        let _goods = goods.map(item => ({
            id: null,
            goodsId: item.goodsId,
            count: item.count,
        }));
        getSiteVip(site.id, function(vipInfo) {
           if(!vipInfo && !params.member_id) {
               setPosting(false);
               return Taro.showModal({title: '友情提示', confirmText: '购买会员', content: '您不是该门店的会员或会员已过期,点击确定去购买会员'}).then(res=>{
                   if(res.confirm) {
                       Taro.navigateTo({url: `/pages/site/vip?id=${site.id}`}).then();
                   }
               });
           }
           else {
               let borrow_another = parseInt(Taro.getStorageSync("borrow_another")) || 0;
               //计算实际需要支付价格
               request.post(API_SUBSCRIBE_GOODS_CREATEORDER, SERVICE_WINKT_ORDER_HEADER, {
                   deliveryType: deliveryType,
                   selfTakeAt: time,
                   goods: _goods,
                   useMoney: useMoney,
                   useScore: useScore,
                   pay: 1,
                   addressId: selectedAddress?.id,
                   childId: selectedChild?.id,
                   member_id: params.member_id??'',
                   agent: params.agent,
                   borrow_another: borrow_another,
               }, true).then(res => {
                   let data = res.data.data;
                   if (data.paytype === 1 && data.pay) {
                       //需要微信支付
                       data.pay.package = data.pay.packageValue;
                       Taro.requestPayment(data.pay).then(() => {
                           //支付已经完成，提醒支付成功并返回上一页面
                           Taro.showToast({title: '微信支付成功', duration: 2000}).then(() => {
                               Taro.removeStorageSync("borrow_another");
                               setTimeout(() => {
                                   //移除购物车中已下单的商品
                                   _goods.forEach(_g => {
                                       _g.id = _g.goodsId;
                                       removeSubscribeCart(_g);
                                   });
                                   Taro.redirectTo({url: 'success'}).then();
                               }, 2000);
                           });
                       })
                   } else {
                       //支付已经完成，提醒支付成功并返回上一页面
                       Taro.showToast({title: '借阅成功', duration: 2000}).then(() => {
                           Taro.removeStorageSync("borrow_another");
                           setTimeout(() => {
                               //移除购物车中已下单的商品
                               _goods.forEach(_g => {
                                   _g.id = _g.goodsId;
                                   removeSubscribeCart(_g);
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
        });
    }

    const handleOnTimeChanged = (time) => {
        setTime(time);
    }

    let actualPay: number = preOrder ?  preOrder.actualPrice.toFixed(2) : '--';
    return (
        <PageLayout statusBarProps={{title: '确认借阅订单'}}>
            {(()=>{
                if(params.agent) {
                    return (
                        <View className="cu-list menu-avatar card-menu radius margin-top">
                            <View className="cu-bar bg-white solid-bottom">
                                <View className="action">
                                    <Text className="cuIcon-titles text-orange" />
                                    <Text className="">代下单用户信息</Text>
                                </View>
                            </View>
                            {member &&
                                <>
                                    <View className="cu-item">
                                        <View className="cu-avatar round lg"
                                              style={{backgroundImage: 'url(' + resolveUrl(member.avatar) + ')'}}/>
                                        <View className="content padding-top-sm padding-bottom-sm">
                                            <View>{member.nickname}</View>
                                            <View>{member.realName} {member.mobile}</View>
                                        </View>
                                    </View>
                                </>
                            }
                        </View>
                    );
                }
            })()}
            <View className="cu-list menu card-menu margin-top radius">
                <View className="bg-white nav">
                    <View className="flex text-center">
                        {!params.in_site && site?.enableDelivery &&
                            <View onClick={() => setDeliveryType(1)}
                                  className={classNames("cu-item flex-sub", deliveryType === 1 ? "text-orange cur" : "")}>
                                快递配送
                            </View>
                        }
                        {site?.enableSelfPickUp &&
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
                {deliveryType === 2 &&
                    <>
                        <View className="cu-form-group">
                            <view className="title text-bold">自提时间</view>
                            <DateTimePicker name={'selfTakeAt'} format={'YYYY-MM-DD'} placeholder={'请选择自提时间'} onConfirm={handleOnTimeChanged} dateTime={[
                                {mode: 'day', duration: 2, unit: '日', humanity: true, format: 'M月D日'},
                            ]} />
                        </View>
                        <View className="cu-form-group">
                            <view className="title text-bold">自提时间</view>
                            <View className='text-gray padding-top-sm padding-bottom-sm'> 本门店营业时间为{site?.businessHours}，请在营业时间内上门自提 </View>
                        </View>
                    </>
                }
            </View>

            <View className="cu-list menu card-menu radius">
                <View className="cu-bar bg-white solid-bottom">
                    <View className="action">
                        <Text className="cuIcon-titles text-orange"/>
                        <Text className="">借阅人信息</Text>
                    </View>
                </View>
                <View className="cu-item" onClick={() => Taro.navigateTo({url: '/pages/my/children?member_id='+params.member_id??''})}>
                    <View className="content">
                        {
                            selectedChild ?
                                <View className="padding-top-sm padding-bottom-sm"
                                      style={{width: '100%', display: 'block'}}>
                                    <View className="">{selectedChild.name} {selectedChild.gender == 1 ? '男' : '女'}</View>
                                    <View> {selectedChild.schoolClass?.level.school.name} {selectedChild.schoolClass?.level.name} {selectedChild.schoolClass?.name}</View>
                                </View>
                                :
                                <View>去完善借阅人信息</View>
                        }
                    </View>
                    <View className="action" onClick={() => Taro.navigateTo({url: '/pages/my/children?member_id='+params.member_id??''})}>
                        <Text className="cuIcon-right"/>
                    </View>
                </View>
            </View>


            {goods &&
                <View className="cu-list menu-avatar card-menu radius">
                    <View className="cu-bar bg-white solid-bottom">
                        <View className="action">
                            <Text className="cuIcon-titles text-orange"/>
                            <Text className="">图书信息</Text>
                        </View>
                    </View>
                    {goods.map(item => {
                        return (
                            <View className="cu-item">
                                <View className="cu-avatar lg"
                                      style={{backgroundImage: 'url(' + resolveUrl(item.images[0]) + ')'}}/>
                                <View className="content flex flex-direction justify-between"
                                      style={{height: '96rpx', overflow: 'hidden'}}>
                                    <View className="text-xl text-bold text-black text-cut">{item.name}</View>
                                    <View className="text-gray">{item.site.name}</View>
                                </View>
                                <View className="action">
                                    X {item.count}
                                </View>
                            </View>
                        );
                    })}
                </View>
            }

            <View className="cu-list menu card-menu radius margin-top">
                <View className="cu-bar bg-white solid-bottom">
                    <View className="action">
                        <Text className="cuIcon-titles text-orange"/>
                        <Text className="">借阅信息</Text>
                    </View>
                </View>
                {site &&
                    <>
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
                        <View className='cu-item'>
                            <View className="content">
                                <View>一次借阅：{site.subscribeCount} 本</View>
                            </View>
                        </View>
                    </>
                }
            </View>


            {goods && user &&
                <View className="cu-list menu card-menu radius">
                    <View className="cu-item">
                        <View className="content flex justify-between">
                            <Text>余额抵扣</Text>
                        </View>
                        <View className="action">
                            <Switch className={'orange'} checked={useMoney} onChange={val => {
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
                                setUseScore(val.detail.value)
                            }}/>
                        </View>
                    </View>
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
                    className="text-orange text-xl">￥{!preOrder ? '--':actualPay}</Text></View>
                <Button loading={posting} disabled={posting || !preOrder}
                        className="cu-btn padding-xl block bg-gradual-orange"
                        style={{width: '300rpx', borderRadius: 0}} onClick={startPay}>立即借阅</Button>
            </View>
        </PageLayout>
    );
}
export default withLogin(ShopConfirm)
