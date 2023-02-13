import Taro,{useReachBottom, useDidShow} from '@tarojs/taro';
import classNames from "classnames";
import PageLayout from "../../layouts/PageLayout";
import {Image, Text, View} from "@tarojs/components";
import {useState} from "react";
import request, {
    SERVICE_WINKT_LIVE_HEADER
} from "../../utils/request";
// @ts-ignore
import styles from './index.module.scss';
import util from '../../utils/we7/util';


const TodayList = () => {
    const [over, setOver] = useState(false);
    const [lives, setLives] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    const loadData = (clear = false, page = 1) => {
        const _page = clear ? 1 : page;
        setPage(_page);
        request.get("wxapp/lives/today", SERVICE_WINKT_LIVE_HEADER, {page: _page}).then(res=>{
            setLoadingMore(false);
            let list = res.data.data.content;
            if (clear) {
                setOver(false);
                setLives(list);
            } else {
                if(!list || list.length === 0) {
                    setOver(true);
                }
                else {
                    setLives([...lives, ...list]);
                }
            }
        })

    }

    useDidShow(()=>{
        loadData(true);
    });

    useReachBottom(()=>{
        if(!over) {
            setLoadingMore(true);
            loadData(false, page+1);
        }
    });
    const openDetail = item => {
        Taro.navigateTo({url: 'detail?id='+item.id}).then();
    }

    return (
        <PageLayout showTabBar={false} statusBarProps={{title: '今日直播'}}>
            <View className={classNames(styles.flowWrapper)}>
                {lives.map((item:any)=>{
                    return (
                        <View style={{position: 'relative'}} className={classNames(styles.flow, 'shadow shadow-lg radius-lg bg-white')} onClick={()=>openDetail(item)}>
                            <Text className={'cuIcon-playfill text-white text-lg'} style={{position: 'absolute', top: Taro.pxTransform(10), right: Taro.pxTransform(10), zIndex: 99, fontSize: Taro.pxTransform(16)}} />
                            <Image className='radius-lg' src={util.resolveUrl(item.image)} mode="widthFix" />
                            <View className={'text-lg padding-top-xs padding-bottom-xs padding-left-sm padding-right-sm text-black text-bold'}>{item.name}</View>
                            <View className="padding-left-sm padding-right-sm padding-bottom-sm text-sm flex align-center justify-between">
                                <View className='flex align-center'>
                                    {item.room.memberAvatar && <View className='cu-avatar sm round margin-right-xs' style={{backgroundImage: `url(${item.room.memberAvatar})`}} />}
                                    <Text> {item.room.name} </Text>
                                </View>
                                <View><Text className='cuIcon-attention margin-right-xs' />{item.memberCount}</View>
                            </View>
                        </View>
                    );
                })}
            </View>
            <View className={classNames("cu-load text-gray", over ? 'over': (loadingMore ? 'loading': ''))} />
            <View style={{height: '128rpx'}} />
        </PageLayout>
    );
}

export default TodayList;
