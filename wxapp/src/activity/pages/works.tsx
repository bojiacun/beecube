import Taro, {useReachBottom, useDidShow, useRouter, useShareAppMessage} from '@tarojs/taro';
import classNames from "classnames";
import PageLayout from "../../layouts/PageLayout";
import {Image, Text, Video, View} from "@tarojs/components";
import {useState} from "react";
import request, {
    resolveUrl,
    SERVICE_WINKT_SYSTEM_HEADER
} from "../../utils/request";
// @ts-ignore
import styles from './index.module.scss';
import util from '../../utils/we7/util';


const ActivityWorkList = () => {
    const [over, setOver] = useState(false);
    const [records, setRecords] = useState<any[]>([]);
    const [info, setInfo] = useState<any>();
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const {params} = useRouter();

    const loadData = (clear = false, page = 1) => {
        const _page = clear ? 1 : page;
        setPage(_page);
        request.get("wxapp/activity/records", SERVICE_WINKT_SYSTEM_HEADER, {
            page: _page,
            activity_id: params?.id ?? 0
        }).then(res => {
            setLoadingMore(false);
            let list = res.data.data.content;
            if (clear) {
                setOver(false);
                setRecords(list);
            } else {
                if (!list || list.length === 0) {
                    setOver(true);
                } else {
                    setRecords([...records, ...list]);
                }
            }
        });
        if (params.id) {
            request.get("wxapp/activities/" + params.id, SERVICE_WINKT_SYSTEM_HEADER, null, false).then(res => setInfo(res.data.data));
        }
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
    useShareAppMessage(() => {
        return { title: info?.name + '活动作品' };
    });

    const openDetail = item => {
        if (item.activity.type == 2) {
            Taro.navigateTo({url: 'video?id=' + item.id}).then();
        } else {
            //打开预览
            Taro.navigateTo({url: 'image?id=' + item.id}).then();
        }
    }

    return (
        <PageLayout showTabBar={false} statusBarProps={{title: info ? info.name + '作品' : '优秀作品'}}>
            <View className={classNames(styles.flowWrapper)}>
                {records.map((item: any) => {
                    return (
                        <View style={{position: 'relative'}}
                              className={classNames(styles.flow, 'shadow shadow-lg radius-lg bg-white')}
                              onClick={() => openDetail(item)}>
                            {item.activity.type == 2 && <Text className={'cuIcon-playfill text-white text-lg'} style={{
                                position: 'absolute',
                                top: Taro.pxTransform(10),
                                right: Taro.pxTransform(10),
                                zIndex: 99,
                                fontSize: Taro.pxTransform(16)
                            }}/>}
                            {item.activity.type == 2 &&
                                <Video
                                    src={resolveUrl(item.attachment)}
                                    autoplay={false}
                                    muted={true}
                                    controls={false}
                                    initialTime={5}
                                    objectFit={'contain'}
                                    showPlayBtn={false}
                                    showCenterPlayBtn={false}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                    }}
                                />
                            }
                            {item.activity.type == 1 &&
                                <Image className='radius-lg' src={util.resolveUrl(item.attachment)} mode="widthFix"/>}
                            <View
                                className={'text-lg padding-top-xs padding-bottom-xs padding-left-sm padding-right-sm text-black text-bold'}>{item.name}</View>
                            <View
                                className="padding-left-sm padding-right-sm padding-bottom-sm text-sm flex align-center justify-between">
                                <View className='flex align-center'>
                                    {item.memberAvatar && <View className='cu-avatar sm round margin-right-xs'
                                                                style={{backgroundImage: `url(${item.memberAvatar})`}}/>}
                                    <Text> {item.memberNickname} </Text>
                                </View>
                                <View><Text className='cuIcon-like margin-right-xs'/>{item.likes}</View>
                            </View>
                        </View>
                    );
                })}
            </View>
            <View className={classNames("cu-load text-gray", over ? 'over' : (loadingMore ? 'loading' : ''))}/>
            <View style={{height: '128rpx'}}/>
        </PageLayout>
    );
}

export default ActivityWorkList;
