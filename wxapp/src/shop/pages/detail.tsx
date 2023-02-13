import Taro, {useReady, useRouter, useShareAppMessage, useDidShow} from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import request, {
    API_SHOP_GOODS_INFO,
    API_SITES_INFO,
    resolveUrl,
    SERVICE_WINKT_SYSTEM_HEADER
} from "../../utils/request";
import {useState} from "react";
import ContentLoading from "../../components/contentloading";
import withLogin from "../../components/login/login";
import {Image, RichText, Swiper, SwiperItem, Text, View, Button} from "@tarojs/components";
// @ts-ignore
import styles from './index.module.scss';
import {addShopCart, calcShopCartCount} from "../../global";
import util from "../../utils/we7/util";
import Timer from "react-compound-timer";
import moment from "moment";
import classNames from "classnames";
import localHistory from '../../utils/localHistory';


const ShopDetail = ({context, makeLogin}) => {
    const {systemInfo, userInfo} = context;
    const {params} = useRouter();
    const [info, setInfo] = useState<any>(null);
    const [siteInfo, setSiteInfo] = useState<any>(null);
    const [killInfo, setKillInfo] = useState<any>(null);
    const [isFav, setIsFav] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [maxImageHeight, setMaxImageHeight] = useState(0);
    const [cartCount, setCartCount] = useState<number>(0);

    const favUrl = '/shop/pages/detail?id='+params.id;
    useReady(() => {
        setLoading(true);
        request.get(API_SHOP_GOODS_INFO + '/' + params.id, SERVICE_WINKT_SYSTEM_HEADER).then(res => {
            let detail = res.data.data;
            detail.images = detail.images.split(',');
            if (detail.content) {
                detail.content = detail.content.replace(/<img /ig, '<img style="max-width:100%;height:auto;display:block;margin:10px 0;" ');
            }
            setInfo(detail);
            setLoading(false);
            if (detail.site) {
                request.get(API_SITES_INFO + "/" + detail.site.id, SERVICE_WINKT_SYSTEM_HEADER, null, false).then(res => {
                    setSiteInfo(res.data.data);
                })
            }
        });
        //查询是不是秒杀期间哦
        request.get("wxapp/shop/kills/iskilling", SERVICE_WINKT_SYSTEM_HEADER, {goods_id: params.id}, false).then(res => {
            setKillInfo(res.data.data);
        });
        setIsFav(localHistory.isFavorite(favUrl));
        if (params.uid) {
            //存储转发人ID
            Taro.setStorageSync('reference_id', params.uid);
        }
    })
    useDidShow(() => {
        let goods = Taro.getStorageSync('CART');
        if (goods) {
            goods = JSON.parse(goods) || [];
            if (goods.length > 0) {
                setCartCount(goods.map(g => g.count).reduce((a, b) => a + b));
            } else {
                setCartCount(0);
            }
        } else {
            setCartCount(0);
        }
    })

    useShareAppMessage(() => {
        return {
            title: info.name,
            path: '/shop/pages/detail?id=' + info.id + '&uid=' + userInfo?.memberInfo?.uid
        }
    })

    const onImageLoaded = e => {
        let windowWidth = systemInfo.windowWidth;
        let height = Math.floor(e.detail.height * (windowWidth / e.detail.width));
        setMaxImageHeight(h => {
            if (height > h) return height;
            return h;
        })
    }
    const openConfirm = () => {
        makeLogin(() => {
            addCart();
            Taro.navigateTo({url: 'confirm?id=' + info.id}).then();
        });
    }
    const openCart = () => {
        Taro.navigateTo({url: 'cart'}).then();
    }
    const addCart = () => {
        addShopCart(info);
        setCartCount(calcShopCartCount());
        if (params.action === 'scan') {
            setTimeout(() => {
                Taro.navigateBack().then();
            }, 1000);
        }
    }

    const toggleFav = (url) => {
        if(localHistory.isFavorite(url)) {
            localHistory.removeFavorite(url);
        }
        else {
            localHistory.putFavorite(url, info);
        }
        setIsFav(localHistory.isFavorite(url));
    }

    return (
        <PageLayout statusBarProps={{title: '商品详情'}}>
            {loading && <ContentLoading/>}
            {
                !loading && info &&
                <>
                    <Swiper style={{height: maxImageHeight}}>
                        {info.images.map((item: string) => {
                            return <SwiperItem><View className={styles.swiperImage}><Image onLoad={onImageLoaded}
                                                                                           src={resolveUrl(item)}
                                                                                           mode="aspectFit"/></View></SwiperItem>
                        })}
                    </Swiper>
                    <View className="bg-white padding-left-sm padding-right-sm padding-bottom-sm"
                          style={{lineHeight: '48rpx'}}>
                        <View className="flex align-center justify-between padding-top-sm padding-bottom-sm">
                            <Text className="text-xl text-bold text-black" style={{flex: 1}}>{info.name}</Text>
                            <Button openType="share" plain={true}
                                    style={{backgroundColor: 'transparent', border: 'none'}}><Text
                                className="text-orange text-xl text-bold cuIcon-share"
                                style={{fontSize: '36rpx'}}/></Button>
                        </View>
                        <View className="text-gray text-bold padding-bottom-xs">{info.description}</View>
                        <View className="margin-bottom-sm flex align-center justify-between">
                            {!killInfo && <Text className="text-orange text-xl text-bold">￥{info.price}</Text>}
                            {killInfo &&
                                <View className="text-xl text-bold">
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
                                    }}>限{killInfo.secKillMaxCount}份</Text>
                                        <Text className='sanjiao-down' style={{
                                            position: 'absolute',
                                            left: Taro.pxTransform(10),
                                            bottom: Taro.pxTransform(-8)
                                        }}/>
                                    </View>
                                    <View style={{color: '#ff5454'}}>￥<Text
                                        style={{fontSize: util.px2rpx(18)}}>{killInfo.secKillPrice}</Text><Text className={'text-sm text-gray'} style={{textDecoration: 'line-through'}}>原价：￥{info.price}</Text></View>
                                </View>}
                            <View>
                                <View className="text-gray text-sm text-right margin-right-sm">库存：{info.store}</View>
                                {killInfo && <View className={'padding-xs'}>
                                    <Text className={'text-black margin-right-sm'}>距离结束:</Text>
                                    <Timer initialTime={killInfo.endAt - moment().valueOf()} direction='backward'>
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
                                </View>}
                            </View>
                        </View>
                        <View className={'text-sm text-gray flex justify-between'}>
                            {siteInfo && <><View>{siteInfo.name}</View><View>{siteInfo.address}</View></>}
                        </View>
                    </View>
                    <View className="margin-top bg-white padding">
                        <View className='text-center text-lg text-black margin-bottom-sm text-bold'>商品详情</View>
                        <RichText nodes={info.content} space={'nbsp'}/>
                    </View>
                    <View style={{height: Taro.pxTransform(100)}}/>
                    <View className="cu-bar bg-white tabbar border shop"
                          style={{width: '100%', position: 'fixed', zIndex: 9999, bottom: 0}}>
                        <Button className="action no-border" openType="contact">
                            <View className="cuIcon-service"/>
                            客服
                        </Button>
                        {!params.action &&
                            <View className="action" onClick={openCart}>
                                <View className="cuIcon-cart">
                                    <View className="cu-tag badge">{cartCount}</View>
                                </View>
                                购物车
                            </View>
                        }
                        <View className="action" onClick={()=>toggleFav(favUrl)}>
                            <View className={classNames(isFav?"cuIcon-favorfill text-orange":'cuIcon-favor')} />
                            收藏
                        </View>
                        <View onClick={addCart} className="bg-orange submit no-radius">加入购物车</View>
                        {!params.action &&
                            <View onClick={openConfirm} className="bg-red submit no-radius">立即购买</View>
                        }
                    </View>
                </>
            }
        </PageLayout>
    );
}


export default withLogin(ShopDetail)

