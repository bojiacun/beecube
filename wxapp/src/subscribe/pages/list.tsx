import Taro, {useReachBottom, useDidShow, useShareAppMessage, useShareTimeline} from '@tarojs/taro';
import classNames from "classnames";
import withLogin from "../../components/login/login";
import PageLayout from "../../layouts/PageLayout";
import {Image, ScrollView, Text, View} from "@tarojs/components";
import {useState} from "react";
import request, {
    API_SUBSCRIBE_GOODS_LIST,
    API_SUBSCRIBE_GOODS_CLASSES,
    SERVICE_WINKT_SYSTEM_HEADER
} from "../../utils/request";
// @ts-ignore
import styles from './index.module.scss';
import util from '../../utils/we7/util';
import {addSubscribeCart, calcSubscribeCartCount, openSubscribeGoods} from "../../global";

const CART_KEY = "SUBSCRIBE-CART";

const SubscribeGoodsList = (props:any) => {
    const {context, makeLogin} = props;
    const {userInfo} = context;
    const [over, setOver] = useState(false);
    const [currentTabIndex, setCurrentTabIndex] = useState(-1);
    const [classes, setClasses] = useState<any>([]);
    const [goods, setGoods] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [cartCount, setCartCount] = useState<number>(0);
    const [loadingMore, setLoadingMore] = useState(false);

    const loadData = (class_id = 0, clear = false, page = 1) => {
        const _page = clear ? 1 : page;
        setPage(_page);
        request.get(API_SUBSCRIBE_GOODS_LIST, SERVICE_WINKT_SYSTEM_HEADER, {page: _page, class_id: class_id, "site_id":userInfo?.memberInfo?.siteId??0}).then(res=>{
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
        let goods = Taro.getStorageSync(CART_KEY);
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
        //刷新分类信息
        request.get(API_SUBSCRIBE_GOODS_CLASSES,SERVICE_WINKT_SYSTEM_HEADER).then(res=>{
            setClasses(res.data.data);
        });
        loadData(currentTabIndex, true);
    });


    useReachBottom(()=>{
        if(!over) {
            setLoadingMore(true);
            loadData(currentTabIndex === -1 ? 0 : classes[currentTabIndex].id, false, page+1);
        }
    });
    const tabSelect = (index) => {
        setCurrentTabIndex(index);
        loadData(index === -1 ? 0 : classes[index].id, true);
    }

    const addCart = (item, event) => {
        event.preventDefault();
        event.stopPropagation();
        addSubscribeCart(item);
        setCartCount(calcSubscribeCartCount());
    }
    const openDetail = (item:any) => {
        makeLogin((u)=>{
            openSubscribeGoods(item, u);
        });
    }
    const openCart = () => {
        Taro.navigateTo({url: '/subscribe/pages/cart'}).then();
    }
    useShareAppMessage(()=>{
        return {title: '借阅书单'};
    });
    useShareTimeline(()=>{
        return {title: '借阅书单'};
    });
    return (
        <PageLayout showTabBar={false} statusBarProps={{title: '借阅商城'}}>
            <ScrollView scrollX={true} className="bg-white nav">
                <View className="flex text-center">
                    <View className={classNames("cu-item flex-sub", currentTabIndex === -1 ? 'text-orange cur' : '')}
                          onClick={() => tabSelect(-1)}>
                        全部
                    </View>
                    {classes.map((item : any, index)=>{
                        return (
                            <View className={classNames("cu-item flex-sub", currentTabIndex === index ? 'text-orange cur' : '')}
                                  onClick={() => tabSelect(index)}>
                                {item.title}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
            <View className={classNames(styles.flowWrapper)}>
                {goods.map((item:any)=>{
                    return (
                        <View className={classNames(styles.flow, 'shadow shadow-lg radius-lg bg-white')} onClick={()=>openDetail(item)}>
                            <Image src={util.resolveUrl(item.images[0])} mode="widthFix" className='radius-lg' />
                            <View className="padding-left-sm padding-right-sm text-lg padding-top-xs">{item.name}</View>
                            <View className="padding-bottom-xs padding-left-sm padding-right-sm flex justify-between align-center">
                                <Text className="text-orange">会员免费借</Text>
                                <Image onClick={(e)=>addCart(item, e)} src="../../assets/images/bag.png" style={{width: '36rpx', height: '36rpx'}} />
                            </View>
                        </View>
                    );
                })}
            </View>
            <View className={classNames("cu-load text-gray", over ? 'over': (loadingMore ? 'loading': ''))} />
            <View style={{height: '128rpx'}} />
            <View onClick={openCart} className="cu-avatar lg bg-white shadow round margin-left" style={{zIndex: 999, position: 'fixed', bottom: 120, right: 20, padding: '20rpx'}}>
                <Image src="../../assets/images/bag.png"  mode='widthFix' />
                <View className="cu-tag badge bg-red text-white" style={{fontSize: '28rpx'}}>{cartCount}</View>
            </View>
        </PageLayout>
    );
}

export default withLogin(SubscribeGoodsList);
