import Taro, {useReachBottom} from '@tarojs/taro';
import {Text, View, Input, Image, Navigator} from "@tarojs/components";
import classNames from "classnames";
import util from '../../utils/we7/util';
import {useState} from "react";
import PageLayout from "../../layouts/PageLayout";
import request, {
    resolveUrl,
    SERVICE_WINKT_SYSTEM_HEADER,
} from "../../utils/request";
import Empty from "../../components/empty/empty";
import ContentLoading from "../../components/contentloading";


const ActivitySearchPage = () => {
    const [over, setOver] = useState(false);
    const [activities, setActivities] = useState<any[]>([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const [searchKey, setSearchKey] = useState<string>('');


    const loadData = (clear = false, page = 1, searchKey: string) => {
        const _page = clear ? 1 : page;
        setPage(_page);
        request.get("wxapp/activities", SERVICE_WINKT_SYSTEM_HEADER, {
            key: searchKey,
            page: _page,
        }, true).then(res => {
            setLoadingMore(false);
            let list = res.data.data.content;
            if (clear) {
                setOver(false);
                setActivities(list);
            } else {
                if (!list || list.length === 0) {
                    setOver(true);
                } else {
                    setActivities([...activities, ...list]);
                }
            }
            setLoading(false);
        }).catch(() => {
            setLoadingMore(false);
            setLoading(false);
        })
    }

    useReachBottom(() => {
        if (!over) {
            setLoadingMore(true);
            loadData(false, page + 1, searchKey);
        }
    })

    const doSearch = util.debounce(loadData, 500);
    const handleSearchInput = (e) => {
        let key = e.detail.value;
        setSearchKey(key);
        doSearch(true, 1, key);
    }


    return (
        <PageLayout statusBarProps={{title: '搜索活动'}} showTabBar={false}>
            <View className="cu-bar search bg-white">
                <View className="search-form round">
                    <Text className="cuIcon-search"/>
                    <Input type="text" onInput={handleSearchInput} placeholder="输入活动标题搜索" confirm-type="search"/>
                </View>
            </View>
            {loading && <ContentLoading height='calc(100vh - 464rpx)'/>}
            {activities.length == 0 && <Empty title="暂无活动" height='calc(100vh - 464rpx)'/>}
            <View className={'flex flex-wrap justify-between padding-top padding-left-sm padding-right-sm'}>
                {
                    activities.map((item: any, index: number) => {
                        let basic = {space: 10, itemBorderRadius: 10};
                        return (
                            <View key={item.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: 'white',
                                padding: '10px 15px',
                                marginBottom: index == activities.length - 1 ? 0 : Taro.pxTransform(basic.space),
                                borderRadius: Taro.pxTransform(basic.itemBorderRadius),
                                position: 'relative'
                            }}>
                                <View style={{width: Taro.pxTransform(80), marginRight: Taro.pxTransform(15)}}>
                                    <Image src={resolveUrl(item.image)} style={{display: 'block', width: '100%', height: Taro.pxTransform(80), objectFit: 'cover'}}/>
                                </View>
                                <View style={{flex: 1}}>
                                    <View className={'text-lg'} style={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        marginBottom: 0,
                                        lineHeight: 2
                                    }}>{item.name}</View>
                                    <View style={{color: 'gray', fontSize: Taro.pxTransform(12), marginTop: Taro.pxTransform(3)}}>
                                        {item.description}
                                    </View>
                                    <View>参与费：<Text style={{color: '#ff5454', fontWeight: 'bold', fontSize: Taro.pxTransform(18)}}>{item.price}</Text> </View>
                                </View>
                                <Navigator url={`/activity/pages/detail?id=${item.id}`} style={{
                                    backgroundColor: '#ffba16',
                                    borderRadius: Taro.pxTransform(15),
                                    position: 'absolute',
                                    right: Taro.pxTransform(15),
                                    bottom: Taro.pxTransform(15),
                                    border: 'none',
                                    padding: '5px 20px'
                                }}>参与活动
                                </Navigator>
                            </View>
                        );
                    })
                }
            </View>
            <View className={classNames("cu-load text-gray", over ? 'over' : (loadingMore ? 'loading' : ''))}/>

        </PageLayout>
    );
}


export default ActivitySearchPage;
