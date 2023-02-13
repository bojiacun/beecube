import Taro, {useDidShow, useReachBottom} from '@tarojs/taro';
import {Button, View, ITouchEvent, Navigator} from "@tarojs/components";
import classNames from "classnames";
import {useState} from "react";
import PageLayout from "../../layouts/PageLayout";
import request, {
    resolveUrl, SERVICE_WINKT_SYSTEM_HEADER,
} from "../../utils/request";
import withLogin from "../../components/login/login";
import Empty from "../../components/empty/empty";
import ContentLoading from "../../components/contentloading";
import moment from "moment";


const SiteActivities = (props) => {
    const {checkLogin, makeLogin} = props;
    const [touchStart, setTouchStart] = useState(0);
    const [touchDirection, setTouchDirection] = useState<string>('');
    const [touchingItem, setTouchingItem] = useState<string>('');
    const [goodsList, setGoodsList] = useState<any[]>([]);
    const [over, setOver] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState(1);
    const isLogin = checkLogin();




    const loadData = (clear = false, page = 1, params:any = {}) => {
        if (!isLogin) return;
        const _page = clear ? 1 : page;
        setPage(_page);
        // params.siteId = siteId;
        request.get("wxapp/activities/site", SERVICE_WINKT_SYSTEM_HEADER, {
            ...params,
            page: _page,
        }, true).then(res => {
            setLoadingMore(false);
            let list = res.data.data.content;
            if (clear) {
                setOver(false);
                setGoodsList(list);
            } else {
                if (!list || list.length === 0) {
                    setOver(true);
                } else {
                    setGoodsList([...goodsList, ...list]);
                }
            }
            setLoading(false);
        }).catch(() => {
            setLoadingMore(false);
            setLoading(false);
        })
    }

    useDidShow(() => {
        loadData(true, 1);
    });
    useReachBottom(() => {
        if (!over) {
            setLoadingMore(true);
            loadData(false, page + 1);
        }
    })

    const onTouchStart = (e: ITouchEvent) => {
        setTouchStart(e.touches[0].pageX);
    }
    const onTouchMove = (e: ITouchEvent) => {
        setTouchDirection(e.touches[0].pageX - touchStart > 0 ? 'right' : 'left');
    }
    const onTouchEnd = (e: ITouchEvent) => {
        if (touchDirection === 'left') {
            setTouchingItem(e.currentTarget.dataset.index)
        } else {
            setTouchingItem('');
        }
        setTouchDirection('');
    }
    const downShopGoods = (item:any) => {
        item.status = false;
        Taro.showLoading({title: '下架中...'}).then();
        request.put("wxapp/activities/"+item.id+'/status', SERVICE_WINKT_SYSTEM_HEADER, item, true).then((res)=>{
            item.status = res.data.data.status;
            setGoodsList([...goodsList]);
            Taro.hideLoading();
        }).catch(()=>Taro.hideLoading());
    }
    const upShopGoods = (item:any) => {
        item.status = true;
        Taro.showLoading({title: '上架中...'}).then();
        request.put("wxapp/activities/"+item.id+'/status', SERVICE_WINKT_SYSTEM_HEADER, item, true).then((res)=>{
            item.status = res.data.data.status;
            setGoodsList([...goodsList]);
            Taro.hideLoading();
        }).catch(()=>Taro.hideLoading());
    }
    return (
        <PageLayout statusBarProps={{title: '门店活动'}} showTabBar={false}>
            {loading && <ContentLoading height='calc(100vh - 464rpx)'/>}
            {
                !isLogin ?
                    <View className='flex flex-direction align-center justify-center'
                          style={{height: 'calc(100vh - 464rpx)'}}>
                        <Button className="cu-btn bg-gradual-green block lg" style={{width: '80%'}}
                                onClick={() => makeLogin(() => loadData(true))}>登录查看</Button>
                    </View>
                    : (loading || goodsList.length === 0 ?
                        <Empty title="暂无活动" height='calc(100vh - 464rpx)'/> :
                        <View className="cu-list menu-avatar">{goodsList.map((item: any) => {
                            return (
                                <View
                                    className={classNames("cu-item", touchingItem === 'touch-' + item.id ? 'move-cur' : '', item.status ? '' : 'filter-gray')}
                                    onTouchStart={onTouchStart}
                                    onTouchMove={onTouchMove}
                                    onTouchEnd={onTouchEnd}
                                    data-index={'touch-' + item.id}
                                    style={{height: '170rpx'}}
                                >
                                    <Navigator url={`subscribe_detail?id=${item.id}`} className="cu-avatar radius xl"
                                          style={{backgroundImage: 'url(' + resolveUrl(item.image) + ')'}}/>
                                    <Navigator url={`subscribe_detail?id=${item.id}`} className="content" style={{display: 'block', padding: 0, left: '170rpx'}}>
                                        <View className="text-black">
                                            <View className="text-cut">{item.name}</View>
                                        </View>
                                        <View className='text-gray text-sm'>
                                            <View className={'text-cut'}>结束日期:{moment(item.endAt).format("yyyy-MM-DD HH:mm:ss")}</View>
                                        </View>
                                    </Navigator>
                                    <View className="action text-sm">
                                    </View>
                                    <View className='move'>
                                        {item.status &&
                                            <View className='bg-red' onClick={()=>downShopGoods(item)}>下架</View>
                                        }
                                        {!item.status &&
                                            <View className='bg-green' onClick={()=>upShopGoods(item)}>上架</View>
                                        }
                                    </View>
                                </View>
                            );
                        })}</View>)
            }
            <View className={classNames("cu-load text-gray", over ? 'over' : (loadingMore ? 'loading' : ''))}/>

        </PageLayout>
    );
}


export default withLogin(SiteActivities);
