import Taro, {useReady, useRouter, useShareAppMessage, useDidShow} from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import request, {
    API_SITES_INFO,
    API_SUBSCRIBE_GOODS_INFO,
    resolveUrl,
    SERVICE_WINKT_SYSTEM_HEADER
} from "../../utils/request";
import {useState} from "react";
import ContentLoading from "../../components/contentloading";
import withLogin from "../../components/login/login";
import {Image, RichText, Swiper, SwiperItem, Text, View, Button, Navigator} from "@tarojs/components";
// @ts-ignore
import styles from './index.module.scss';
import {addSubscribeCart, calcSubscribeCartCount, getSiteVip} from "../../global";
import moment from "moment";
import classNames from "classnames";
import localHistory from "../../utils/localHistory";

const CART_KEY = 'SUBSCRIBE-CART';

const SubscribeDetail = ({context, makeLogin}) => {
    const {systemInfo, userInfo} = context;
    const {params} = useRouter();
    const [info, setInfo] = useState<any>(null);
    const [siteInfo, setSiteInfo] = useState<any>(null);
    const [vipInfo, setVipInfo] = useState<any>(null);
    const [isFav, setIsFav] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [maxImageHeight, setMaxImageHeight] = useState(0);
    const [cartCount, setCartCount] = useState<number>(0);

    const favUrl = '/subscribe/pages/detail?id='+params.id;
    useReady(() => {
        setLoading(true);
        request.get(API_SUBSCRIBE_GOODS_INFO + '/' + params.id, SERVICE_WINKT_SYSTEM_HEADER).then(res => {
            let detail = res.data.data;
            detail.images = detail.images.split(',');
            if(detail.content) {
                detail.content = detail.content.replace(/<img /ig, '<img style="max-width:100%;height:auto;display:block;margin:10px 0;" ');
            }
            setInfo(detail);
            setLoading(false);
            getSiteVip(detail.site.id, function(vipInfo){
                setVipInfo(vipInfo);
            });
            if(detail.site) {
                request.get(API_SITES_INFO + "/" + detail.site.id, SERVICE_WINKT_SYSTEM_HEADER, null, false).then(res => {
                    setSiteInfo(res.data.data);
                })
            }
        });
        setIsFav(localHistory.isFavorite(favUrl));
        if (params.uid) {
            //存储转发人ID
            Taro.setStorageSync('reference_id', params.uid);
        }
    })
    useDidShow(() => {
        let goods = Taro.getStorageSync(CART_KEY);
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
            path: '/subscribe/pages/detail?id=' + info.id + '&uid=' + userInfo?.memberInfo?.uid
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
        Taro.navigateTo({url: '/subscribe/pages/cart'}).then();
    }
    const addCart = () => {
        addSubscribeCart(info);
        setCartCount(calcSubscribeCartCount());
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
                            return (
                                <SwiperItem>
                                    <View className={styles.swiperImage}>
                                        <Image onLoad={onImageLoaded} src={resolveUrl(item)} mode="aspectFit"/>
                                    </View>
                                </SwiperItem>
                            );
                        })}
                    </Swiper>
                    <View className="bg-white padding-left-sm padding-right-sm padding-bottom-sm" style={{lineHeight: '48rpx'}}>
                        <View className="flex align-center justify-between padding-top-sm padding-bottom-sm">
                            <Text className="text-xl text-bold text-black" style={{flex: 1}}>{info.name}</Text>
                            <Button openType="share" plain={true}
                                    style={{backgroundColor: 'transparent', border: 'none'}}><Text
                                className="text-orange text-xl text-bold cuIcon-share"
                                style={{fontSize: '36rpx'}}/></Button>
                        </View>
                        <View className="text-gray text-bold padding-bottom-xs">{info.description}</View>
                        <View className="margin-bottom-sm flex align-center justify-between">
                            <Text className="text-orange text-xl text-bold">会员免费借</Text>
                            <Text className="text-gray text-sm">库存：{info.store} 书架号：{info.bookShelf}</Text>
                        </View>
                    </View>

                    {siteInfo &&
                        <View className={'padding-sm'} style={{display: 'flex'}}>
                            <View style={{
                                position: 'relative',
                                flex: 1,
                                backgroundColor: '#ffffff',
                                display: 'flex',
                                borderRadius: '20rpx',
                                overflow: 'hidden'
                            }}>
                                <View className={'triangle-topleft'} style={{position: 'absolute', left: 0, top: 0}}/>
                                <View
                                    className={'text-sm bg-green text-center padding-top-xl padding-left-xs padding-right-xs'}
                                    style={{width: '60rpx'}}>所在门店</View>
                                <Navigator url={`/pages/site/detail?id=${siteInfo.id}`} className={'margin-left-xl margin-right'} style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    flexDirection: 'column',
                                    justifyContent: 'center'
                                }}>
                                    <View className="text-xl text-black margin-bottom-xs">{siteInfo?.name}</View>
                                    <View className='text-sm text-gray'>地址：{siteInfo?.address}</View>
                                </Navigator>
                            </View>
                            <Navigator url='/subscribe/pages/orders' style={{
                                padding: '30rpx 60rpx',
                                background: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: 10,
                                borderRadius: 10,
                                flexDirection: 'column'
                            }}>
                                <View style={{fontSize: Taro.pxTransform(48)}} className={classNames('cuIcon-vip', vipInfo && moment().valueOf() < vipInfo.endAt ? 'text-orange' : 'text-gray')} />
                                {(vipInfo && moment().valueOf() < vipInfo.endAt) ? <View>{moment(vipInfo.endAt).format('yyyy-MM-DD')}</View>:<View>已过期</View>}
                            </Navigator>
                        </View>
                    }
                    <View className="bg-white padding">
                        <View className='text-center text-lg text-black margin-bottom-sm text-bold'>商品详情</View>
                        <RichText nodes={info.content} space={'nbsp'} />
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
                                书袋
                            </View>
                        }
                        <View className="action" onClick={()=>toggleFav(favUrl)}>
                            <View className={classNames(isFav?"cuIcon-favorfill text-orange":'cuIcon-favor')} />
                            收藏
                        </View>
                        <View onClick={() => addCart()} className="bg-orange submit no-radius">加入书袋</View>
                        {!params.action &&
                            <View onClick={openConfirm} className="bg-red submit no-radius">立即借阅</View>
                        }
                    </View>
                </>
            }
        </PageLayout>
    );
}


export default withLogin(SubscribeDetail)

