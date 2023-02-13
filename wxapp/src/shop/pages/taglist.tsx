import Taro, {useReachBottom, useDidShow, useRouter, useShareAppMessage, useShareTimeline} from '@tarojs/taro';
import classNames from "classnames";
import PageLayout from "../../layouts/PageLayout";
import {Image, Text, View} from "@tarojs/components";
import {useState} from "react";
import request, {
    API_SHOP_GOODS_LIST,
    SERVICE_WINKT_SYSTEM_HEADER
} from "../../utils/request";
// @ts-ignore
import styles from './index.module.scss';
import util from '../../utils/we7/util';
import {addShopCart, calcShopCartCount} from "../../global";


const TagShopGoodsList = () => {
    const [over, setOver] = useState(false);
    const [goods, setGoods] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [cartCount, setCartCount] = useState<number>(0);
    const [loadingMore, setLoadingMore] = useState(false);

    const {params} = useRouter();

    const loadData = (clear = false, page = 1) => {
        const _page = clear ? 1 : page;
        setPage(_page);
        request.get(API_SHOP_GOODS_LIST, SERVICE_WINKT_SYSTEM_HEADER, {page: _page, tag: params.tag, "site_id":0}).then(res=>{
            setLoadingMore(false);
            let list = res.data.data.content.map(item=>{
                item.images = item.images.split(",");
                return item;
            });
            if (clear) {
                setOver(false);
                setGoods(list);
            } else {
                if(!list || list.length === 0) {
                    setOver(true);
                }
                else {
                    setGoods([...goods, ...list]);
                }
            }
        })

    }

    useDidShow(()=>{
        let goods = Taro.getStorageSync('CART');
        if(goods) {
            goods = JSON.parse(goods) || [];
            if(goods.length > 0) {
                setCartCount(goods.map(g => g.count).reduce((a,b)=>a+b));
            }
            else {
                setCartCount(0);
            }
        }
        else {
            setCartCount(0);
        }
        loadData(true);
    });


    useReachBottom(()=>{
        if(!over) {
            setLoadingMore(true);
            loadData(false, page+1);
        }
    });


    const addCart = (item, event) => {
        event.preventDefault();
        event.stopPropagation();
        addShopCart(item);
        setCartCount(calcShopCartCount());
    }
    const openDetail = item => {
        Taro.navigateTo({url: 'detail?id='+item.id}).then();
    }
    const openCart = () => {
        Taro.navigateTo({url: '/shop/pages/cart'}).then();
    }
    useShareAppMessage(()=>{
        return {title: params.tag};
    });
    useShareTimeline(()=>{
        return {title: params.tag};
    });
    return (
        <PageLayout showTabBar={true} statusBarProps={{title: params.tag}}>
            <View className={classNames(styles.flowWrapper)}>
                {goods.map((item:any)=>{
                    return (
                        <View className={classNames(styles.flow, 'shadow shadow-lg radius-lg bg-white')} onClick={()=>openDetail(item)}>
                            <Image src={util.resolveUrl(item.images[0])} mode="widthFix" className='radius-lg' />
                            <View className="padding-left-sm padding-right-sm padding-top-xs text-lg text-black">{item.name}</View>
                            <View className="padding-bottom-xs padding-left-sm padding-right-sm flex justify-between align-center">
                                <Text className="text-orange">￥{item.price}</Text>
                                <Image onClick={(e)=>addCart(item, e)} src="../../assets/images/cart.png" style={{width: '36rpx', height: '36rpx'}} />
                            </View>
                        </View>
                    );
                })}
            </View>
            <View className={classNames("cu-load text-gray", over ? 'over': (loadingMore ? 'loading': ''))} />
            <View style={{height: '128rpx'}} />
            <View onClick={openCart} className="cu-avatar lg bg-white round margin-left" style={{zIndex: 999, position: 'fixed', bottom: 120, right: 20, padding: '20rpx'}}>
                <Image src="../../assets/images/cart.png" style={{width: '64rpx', height: '64rpx'}} />
                <View className="cu-tag badge bg-red text-white" style={{fontSize: '28rpx'}}>{cartCount}</View>
            </View>
        </PageLayout>
    );
}

export default TagShopGoodsList;
