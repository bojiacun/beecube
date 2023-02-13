import Taro, {useReachBottom} from '@tarojs/taro';
import {Text, View, Input, Image} from "@tarojs/components";
import classNames from "classnames";
import util from '../../utils/we7/util';
import {useState} from "react";
import PageLayout from "../../layouts/PageLayout";
import request, {
    resolveUrl,
    SERVICE_WINKT_LIVE_HEADER,
} from "../../utils/request";
import Empty from "../../components/empty/empty";
import ContentLoading from "../../components/contentloading";
import moment from "moment";


const LiveSearchPage = () => {
    const [over, setOver] = useState(false);
    const [liveList, setLiveList] = useState<any[]>([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const [searchKey, setSearchKey] = useState<string>('');


    const loadData = (clear = false, page = 1, searchKey: string) => {
        const _page = clear ? 1 : page;
        setPage(_page);
        request.get("wxapp/lives", SERVICE_WINKT_LIVE_HEADER, {
            key: searchKey,
            page: _page,
        }, true).then(res => {
            setLoadingMore(false);
            let list = res.data.data.content;
            if (clear) {
                setOver(false);
                setLiveList(list);
            } else {
                if (!list || list.length === 0) {
                    setOver(true);
                } else {
                    setLiveList([...liveList, ...list]);
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
    const gotoLiveDetail = (item:any) => {
        Taro.showLoading({title: '打开中...'}).then();
        if(parseFloat(item.price) > 0) {
            //如果需要付费则需要支付后才能观看直播
            request.get("wxapp/lives/checkpay/"+item.id, SERVICE_WINKT_LIVE_HEADER, null, true).then(res=>{
                if(res.data.data) {
                    Taro.navigateTo({url: `/live/pages/video?id=${item.id}`}).then();
                    Taro.hideLoading();
                }
                else {
                    Taro.showLoading({title: '创建订单...'}).then();
                    request.post("wxapp/lives/"+item.id, SERVICE_WINKT_LIVE_HEADER, null, true).then(res=>{
                        let data = res.data.data;
                        data.package = data.packageValue;
                        Taro.requestPayment(data).then(() => {
                            //支付已经完成，提醒支付成功并返回上一页面
                            Taro.showToast({title: '微信支付成功', duration: 2000}).then(() => {
                                gotoDetail(item);
                            });
                        });
                    })
                }
            });
        }
        else {
            gotoDetail(item);
            Taro.hideLoading();
        }
    }
    const gotoDetail = (item:any) => {
        //已经结束的直播直接跳转到历史播放中去
        if(item.endAt < moment().valueOf()) {
            Taro.navigateTo({url: `/live/pages/video?id=${item.id}`}).then();
        }
        else {
            Taro.navigateTo({url: `/live/pages/detail?id=${item.id}`}).then();
        }
    }

    return (
        <PageLayout statusBarProps={{title: '搜索直播'}} showTabBar={false}>
            <View className="cu-bar search bg-white">
                <View className="search-form round">
                    <Text className="cuIcon-search"/>
                    <Input type="text" onInput={handleSearchInput} placeholder="输入直播间或者直播标题搜索" confirm-type="search"/>
                </View>
            </View>
            {loading && <ContentLoading height='calc(100vh - 464rpx)'/>}
            {liveList.length == 0 && <Empty title="暂无直播" height='calc(100vh - 464rpx)'/>}
            <View className={'flex flex-wrap justify-between padding-top padding-left-sm padding-right-sm'}>
            {liveList.map((item: any) => {
                let basic = {space: 10, itemBorderRadius: 10};
                let itemWidth:any = basic.space;
                itemWidth = 'calc((100% - ' + itemWidth + 'px) / 2)';
                return (
                    <View onClick={()=>gotoLiveDetail(item)} key={item.id} style={{
                        width: itemWidth,
                        background: 'white',
                        padding: Taro.pxTransform(10),
                        marginBottom: Taro.pxTransform(basic.space),
                        borderRadius: basic.itemBorderRadius,
                        position: 'relative'
                    }}>
                        {item.isMemberPrivate && <View style={{
                            backgroundColor: '#ff5454',
                            padding: '0 10rpx',
                            color: 'white',
                            position: 'absolute',
                            left: Taro.pxTransform(10),
                            top: Taro.pxTransform(20),
                            zIndex: 1,
                            borderTopRightRadius: 8,
                            borderBottomRightRadius: 8
                        }}>会员专享</View>}
                        <View style={{paddingTop: '100%', width: '100%', position: 'relative'}}>
                            <Image src={resolveUrl(item.poster??item.image)} style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                display: 'block',
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                zIndex: 99
                            }}/>
                        </View>
                        <View style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            marginBottom: 0,
                            lineHeight: 2
                        }}>{item.name}</View>
                        <View style={{fontSize: Taro.pxTransform(12), display: 'flex'}}>
                        </View>
                    </View>
                );
            })}
            </View>
            <View className={classNames("cu-load text-gray", over ? 'over' : (loadingMore ? 'loading' : ''))}/>

        </PageLayout>
    );
}


export default LiveSearchPage;
