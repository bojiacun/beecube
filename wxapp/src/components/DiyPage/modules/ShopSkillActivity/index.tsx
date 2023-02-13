import {View, Text, Navigator, Image} from "@tarojs/components";
import {useEffect, useState} from "react";
import {resolveUrl} from "../../../../utils/request";
import FallbackImage from "../../../../components/FallbackImage";
import {getCurrentShopSecKills} from "./service";
import util from "../../../../utils/we7/util";
import Taro, {useDidShow} from "@tarojs/taro";
import {addShopCart} from "../../../../global";


const ShopSecKillActivityModule = (props: any) => {
    const {index, style, basic, ...rest} = props;
    const [activities, setActivities] = useState<any[]>([]);

    const loadData = () => {
        getCurrentShopSecKills().then(res => {
            setActivities(res);
        });
    }

    //查询当前秒杀活动
    useEffect(() => {
        loadData();
    }, []);

    useDidShow(() => {
        loadData();
    });
    const openDetail = item => {
        Taro.navigateTo({url: '/shop/pages/detail?id=' + item.shopGoods.id}).then();
    }
    const seckill = (item: any, event) => {
        event.preventDefault();
        event.stopPropagation();
        let goodsItem = item.shopGoods;
        addShopCart(goodsItem);
    }

    return (
        <View {...rest} style={style}>
            {basic.titleType == 1&&
                <View style={{
                    position: 'relative',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Image src={'../../assets/images/designer/biaoqian.png'} mode="widthFix" style={{ display: 'block', width: '50%', position: 'absolute', zIndex: 0 }} />
                    <View className="text-lg" style={{ zIndex: 1, fontSize: basic.fontSize, marginBottom: '40rpx' }}>{basic.title}</View>
                </View>
            }
            {basic.titleType == 2 &&
                <View style={{
                    position: 'relative',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Image mode='widthFix' src={resolveUrl(basic.titleimg)} style={{display: 'block', width: basic.titleimgWidth+'%', marginBottom: basic.titleBottomMargin, marginTop: basic.titleTopMargin}} />
                </View>
            }
            {activities.map((item: any) => {
                return (
                    <>
                        <View className='margin-bottom-sm jianbian-border' onClick={()=>openDetail(item)} style={{
                            padding: Taro.pxTransform(1),
                            borderRadius: util.px2rpx(10),
                        }}>
                            <View className='bg-white' style={{
                                padding: '20rpx 30rpx',
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: util.px2rpx(10),
                            }}>
                                <Navigator url={`/shop/pages/detail?id=${item.shopGoods.id}`} style={{width: util.px2rpx(100), marginRight: util.px2rpx(15)}}>
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
                                        <Navigator url={`/shop/pages/detail?id=${item.shopGoods.id}`} className='text-lg' style={{marginBottom: 0}}>{item.name}</Navigator>
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
    );
}

export default ShopSecKillActivityModule;
