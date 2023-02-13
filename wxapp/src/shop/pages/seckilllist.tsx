import Taro, {useReachBottom, useDidShow, useShareAppMessage, useShareTimeline} from '@tarojs/taro';
import classNames from "classnames";
import PageLayout from "../../layouts/PageLayout";
import {Image, Navigator, Text, View} from "@tarojs/components";
import {useState} from "react";
import request, {
    resolveUrl,
    SERVICE_WINKT_SYSTEM_HEADER
} from "../../utils/request";
// @ts-ignore
import util from '../../utils/we7/util';
import {addShopCart, calcShopCartCount} from "../../global";
import FallbackImage from "../../components/FallbackImage";
import Timer from 'react-compound-timer';
import moment from "moment";


const TodaySeckillList = () => {
    const [over, setOver] = useState(false);
    const [goods, setGoods] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [cartCount, setCartCount] = useState<number>(0);
    const [loadingMore, setLoadingMore] = useState(false);

    const loadData = (clear = false, page = 1) => {
        const _page = clear ? 1 : page;
        setPage(_page);
        request.get("wxapp/shop/kills", SERVICE_WINKT_SYSTEM_HEADER, {page: _page}).then(res => {
            setLoadingMore(false);
            let list = res.data.data.content;
            if (clear) {
                setOver(false);
                setGoods(list);
            } else {
                if (!list || list.length === 0) {
                    setOver(true);
                } else {
                    setGoods([...goods, ...list]);
                }
            }
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
    });


    const seckill = (item: any, event) => {
        event.preventDefault();
        event.stopPropagation();
        let goodsItem = item.shopGoods;
        addShopCart(goodsItem);
        setCartCount(calcShopCartCount());
    }
    const openDetail = item => {
        Taro.navigateTo({url: 'detail?id=' + item.shopGoods.id}).then();
    }
    const openCart = () => {
        Taro.navigateTo({url: '/shop/pages/cart'}).then();
    }
    useShareAppMessage(()=>{
        return {};
    });
    useShareTimeline(()=>{
        return {};
    });
    return (
        <PageLayout showTabBar={true} statusBarProps={{title: '今日秒杀'}}>
            <View className={'padding'}>
                {goods.map((item: any) => {
                    return (
                        <>
                            <View className={'padding-xs'}>
                                <Text className={'text-black margin-right-sm'}>距离结束:</Text>
                                <Timer initialTime={item.endAt - moment().valueOf()} direction='backward'>
                                    {() => (<>
                                            <Text className='cu-tag round text-sm' style={{
                                                backgroundColor: '#ff5454',
                                                color: 'white',
                                                height: 'auto',
                                            }}><Timer.Hours/></Text>
                                            <Text style={{color: '#ff5454', padding: '0px 10rpx'}}>:</Text>
                                            <Text className='cu-tag round text-sm' style={{
                                                backgroundColor: '#ff5454',
                                                color: 'white',
                                                height: 'auto',
                                            }}><Timer.Minutes/></Text>
                                            <Text style={{color: '#ff5454', padding: '0px 10rpx'}}>:</Text>
                                            <Text className='cu-tag round text-sm' style={{
                                                backgroundColor: '#ff5454',
                                                color: 'white',
                                                height: 'auto',
                                            }}><Timer.Seconds/></Text>
                                        </>
                                    )}
                                </Timer>
                            </View>
                            <View className='margin-bottom-sm jianbian-border' onClick={() => openDetail(item)} style={{
                                padding: Taro.pxTransform(1),
                                borderRadius: util.px2rpx(10),
                            }}>

                                <View className='bg-white' style={{
                                    padding: '20rpx 30rpx',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderRadius: util.px2rpx(10),
                                }}>
                                    <Navigator url={`detail?id=${item.shopGoods.id}`}
                                               style={{width: util.px2rpx(100), marginRight: util.px2rpx(15)}}>
                                        <FallbackImage src={resolveUrl(item.image)}
                                                       style={{
                                                           width: '100%',
                                                           height: util.px2rpx(80),
                                                           objectFit: 'cover'
                                                       }}
                                                       width={'100%'}/>

                                    </Navigator>
                                    <View style={{
                                        flex: 1,
                                        position: 'relative',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        flexDirection: 'column'
                                    }}>
                                        <View style={{marginBottom: util.px2rpx(20)}}>
                                            <Navigator url={`detail?id=${item.shopGoods.id}`} className='text-lg'
                                                       style={{marginBottom: 0}}>{item.name}</Navigator>
                                            <View className='cu-progress round'>
                                                <View className={'bg-red'}
                                                      style={{width: (item.killedCount * 100 / item.secKillMaxCount).toFixed(0) + '%'}}>{(item.killedCount * 100 / item.secKillMaxCount).toFixed(0)}%</View>
                                            </View>
                                        </View>
                                        <View>
                                            <View style={{
                                                fontSize: util.px2rpx(12),
                                                position: 'relative',
                                                marginBottom: Taro.pxTransform(10)
                                            }}><Text
                                                style={{
                                                    padding: '4rpx 10rpx',
                                                    backgroundColor: '#ff5454',
                                                    border: '2rpx solid #ff5454',
                                                    color: 'white',
                                                    borderTopLeftRadius: util.px2rpx(3),
                                                    borderBottomLeftRadius: util.px2rpx(3),
                                                }}>秒杀价</Text><Text style={{
                                                padding: '4rpx 10rpx',
                                                border: '2rpx solid #ff5454',
                                                color: '#ff5454',
                                                borderTopRightRadius: util.px2rpx(3),
                                                borderBottomRightRadius: util.px2rpx(3),
                                            }}>限{item.secKillMaxCount}份</Text>
                                                <Text className='sanjiao-down' style={{
                                                    position: 'absolute',
                                                    left: Taro.pxTransform(10),
                                                    bottom: Taro.pxTransform(-8)
                                                }}/>
                                            </View>
                                            <View style={{color: '#ff5454'}}>￥<Text
                                                style={{fontSize: util.px2rpx(18)}}>{item.secKillPrice}</Text></View>
                                        </View>
                                        <View className={'text-black'} style={{
                                            backgroundColor: '#ffba16',
                                            borderRadius: util.px2rpx(15),
                                            position: 'absolute',
                                            right: 0,
                                            bottom: util.px2rpx(0),
                                            border: 'none',
                                            padding: '10rpx 30rpx',
                                            fontSize: util.px2rpx(12)
                                        }} onClick={(e) => seckill(item, e)}>立即抢购
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </>
                    );
                })}
            </View>
            <View className={classNames("cu-load text-gray", over ? 'over' : (loadingMore ? 'loading' : ''))}/>
            <View style={{height: '128rpx'}}/>
            <View onClick={openCart} className="cu-avatar lg bg-white round margin-left"
                  style={{zIndex: 999, position: 'fixed', bottom: 120, right: 20, padding: '20rpx'}}>
                <Image src="../../assets/images/cart.png" style={{width: '64rpx', height: '64rpx'}}/>
                <View className="cu-tag badge bg-red text-white" style={{fontSize: '28rpx'}}>{cartCount}</View>
            </View>
        </PageLayout>
    );
}

export default TodaySeckillList;
