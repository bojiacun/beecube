import Taro, {useReady, useRouter, useShareAppMessage} from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import request, {
    API_SUBSCRIBE_GOODS_INFO,
    resolveUrl,
    SERVICE_WINKT_SYSTEM_HEADER
} from "../../utils/request";
import {useState} from "react";
import ContentLoading from "../../components/contentloading";
import withLogin from "../../components/login/login";
import {Image, RichText, Swiper, SwiperItem, Text, View} from "@tarojs/components";
// @ts-ignore
import styles from './index.module.scss';


const SubscribeGoodsDetail = ({context}) => {
    const {systemInfo, userInfo} = context;
    const {params} = useRouter();
    const [info, setInfo] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [maxImageHeight, setMaxImageHeight] = useState(0);
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
        });
        if (params.uid) {
            //存储转发人ID
            Taro.setStorageSync('reference_id', params.uid);
        }
    })

    useShareAppMessage(() => {
        return {
            title: info.name,
            path: '/pages/shop/detail?id=' + info.id + '&uid=' + userInfo?.memberInfo?.uid
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

    return (
        <PageLayout statusBarProps={{title: '借阅图书详情'}}>
            {loading && <ContentLoading/>}
            {
                !loading && info &&
                <>
                    <Swiper style={{height: maxImageHeight}}>
                        {info.images.map((item: string) => {
                            return (<SwiperItem><View className={styles.swiperImage}>
                                <Image onLoad={onImageLoaded} src={resolveUrl(item)} mode="aspectFit"/>
                            </View></SwiperItem>);
                        })}
                    </Swiper>
                    <View className="bg-white padding-left-sm padding-right-sm" style={{lineHeight: '48rpx'}}>
                        <View className="flex align-center justify-between padding-top-sm padding-bottom-sm">
                            <Text className="text-xl text-bold text-black" style={{flex: 1}}>{info.name}</Text>
                        </View>
                        <View className="text-gray text-bold padding-bottom-xs">{info.description}</View>
                        <View className="padding-bottom-sm flex align-center justify-between">
                            <Text className="text-orange text-xl text-bold">￥{info.price}</Text>
                            <Text className="text-gray text-sm">库存：{info.store} 书架号：{info.bookShelf}</Text>
                        </View>
                    </View>
                    <View className="margin-top bg-white padding">
                        <View className='text-center text-lg text-black margin-bottom-sm text-bold'>商品详情</View>
                        <RichText nodes={info.content} space={'nbsp'} />
                    </View>
                    <View style={{height: '140rpx'}}/>
                </>
            }
        </PageLayout>
    );
}


export default withLogin(SubscribeGoodsDetail)

