import Taro, {useRouter} from '@tarojs/taro';
import {Text, View, Navigator, Image} from "@tarojs/components";
import util from '../../utils/we7/util';
import {useEffect, useState} from "react";
import PageLayout from "../../layouts/PageLayout";
import request, {
    resolveUrl,
    SERVICE_WINKT_SYSTEM_HEADER
} from "../../utils/request";
import withLogin from "../../components/login/login";
import Empty from "../../components/empty/empty";
import ContentLoading from "../../components/contentloading";

const SubscribeScanResultsPage = (props) => {
    const {checkLogin} = props;
    const {params} = useRouter();
    const [goodsList, setGoodsList] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const isLogin = checkLogin();


    const loadData = () => {
        if (!isLogin) return;
        request.get("wxapp/subscribe/goods/find", SERVICE_WINKT_SYSTEM_HEADER, {
            siteId: params.siteId,
            identifier: params.identifier,
        }).then(res => {
            let goods = res.data.data;
            setGoodsList(goods);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }
    useEffect(()=>{
        loadData();
    }, []);


    const addCartText = '加入书袋';
    const addCart = (item, event) => {
        let CART_KEY = 'SUBSCRIBE-CART';
        event.preventDefault();
        event.stopPropagation();
        item.images = item.images.split(',');
        item.count = 1;
        item.selected = true;
        let goods = Taro.getStorageSync(CART_KEY);
        if (goods) {
            goods = JSON.parse(goods);
        } else {
            goods = [];
        }
        let goodsItem = goods.filter(g => g.id == item.id)[0];
        if (goodsItem) {
            goodsItem.count++;
        } else {
            item.count = 1;
            item.goodsId = item.id;
            goods.push(item);
        }
        Taro.setStorageSync(CART_KEY, JSON.stringify(goods));
        Taro.showToast({title: '加入书袋成功', icon: 'success'}).then();
    }

    return (
        <PageLayout statusBarProps={{title: '扫码搜索图书'}} showTabBar={false}>
            {loading && <ContentLoading height='calc(100vh - 464rpx)'/>}
            {goodsList.length == 0 && <Empty title="暂无图书" height='calc(100vh - 464rpx)'/>}
            {goodsList.length > 0 && goodsList.map((item: any, index: number) => {
                let detailPage = '/subscribe/pages/detail';
                return (
                    <View key={item.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'white',
                        padding: '20rpx 30rpx',
                        marginBottom: index == goodsList.length - 1 ? 0 : util.px2rpx(10),
                        borderRadius: util.px2rpx(10),
                        position: 'relative'
                    }}>
                        <Navigator url={`${detailPage}?id=${item.id}`}
                                   style={{width: '160rpx', marginRight: '30rpx'}}>
                            <Image src={resolveUrl(item.images.split(',')[0])} mode="widthFix"
                                   style={{display: 'block', width: '100%', height: '160rpx', objectFit: 'cover'}}/>
                        </Navigator>
                        <Navigator url={`${detailPage}?id=${item.id}&action=scan`} style={{flex: 1}}>
                            <View className="text-lg" style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                marginBottom: 0
                            }}>{item.shortName}</View>
                            <View className='text-gray margin-top-xs margin-bottom-xs text-sm'>编号：{item.identifier}</View>
                            <View className='text-gray margin-top-xs margin-bottom-xs text-sm'>作者：{item.author} 门店：{item.site.name}</View>
                            <View className='margin-bottom-xs'><Text style={{
                                color: '#ff5454',
                                fontWeight: 'bold',
                                fontSize: '36rpx'
                            }}>￥{item.price}</Text></View>
                            <View className='text-gray'>图书定价：<Text
                                style={{textDecoration: 'line-through'}}>{item.marketPrice}</Text></View>
                        </Navigator>
                        <View onClick={(e) => addCart(item, e)} style={{
                            backgroundColor: '#ffba16',
                            borderRadius: '30rpx',
                            position: 'absolute',
                            right: '30rpx',
                            bottom: '30rpx',
                            border: 'none',
                            padding: '10rpx 40rpx'
                        }}>{addCartText}</View>
                    </View>
                );
            })}

        </PageLayout>
    );
}


export default withLogin(SubscribeScanResultsPage);
