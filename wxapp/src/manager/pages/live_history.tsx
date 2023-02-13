import Taro, {useDidShow, useReachBottom} from '@tarojs/taro';
import {Button, Text, View, Input, ITouchEvent, Navigator} from "@tarojs/components";
import classNames from "classnames";
import util from '../../utils/we7/util';
import {useState} from "react";
import PageLayout from "../../layouts/PageLayout";
import request, {
    resolveUrl, SERVICE_WINKT_LIVE_HEADER,
} from "../../utils/request";
import withLogin from "../../components/login/login";
import Empty from "../../components/empty/empty";
import ContentLoading from "../../components/contentloading";
import moment from "moment";


const LiveHistoryPage = (props) => {
    const {checkLogin, makeLogin} = props;
    const [touchStart, setTouchStart] = useState(0);
    const [touchDirection, setTouchDirection] = useState<string>('');
    const [touchingItem, setTouchingItem] = useState<string>('');
    const [goodsList, setGoodsList] = useState<any[]>([]);
    const [over, setOver] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState(1);
    const [searchKey, setSearchKey] = useState<string>('');
    const isLogin = checkLogin();


    const loadData = (clear = false, page = 1, params = {}) => {
        if (!isLogin) return;
        const _page = clear ? 1 : page;
        setPage(_page);
        request.get("wxapp/manager/live/histories", SERVICE_WINKT_LIVE_HEADER, {
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
        loadData(true, 1, {key: searchKey});
    });
    useReachBottom(() => {
        if (!over) {
            setLoadingMore(true);
            loadData(false, page + 1, {key: searchKey});
        }
    })

    const doSearch = util.debounce(loadData, 500);
    const handleSearchInput = (e) => {
        let key = e.detail.value;
        setSearchKey(key);
        doSearch(true, 1, {key: key});
    }

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
    const downIt= (item:any) => {
        item.status = false;
        Taro.showLoading({title: '下架中...'}).then();
        request.put("wxapp/manager/live/histories/"+item.id+'/status', SERVICE_WINKT_LIVE_HEADER, item, true).then((res)=>{
            item.status = res.data.data.status;
            setGoodsList([...goodsList]);
            Taro.hideLoading();
        }).catch(()=>Taro.hideLoading());
    }
    const upIt = (item:any) => {
        item.status = true;
        Taro.showLoading({title: '上架中...'}).then();
        request.put("wxapp/manager/live/histories/"+item.id+'/status', SERVICE_WINKT_LIVE_HEADER, item, true).then((res)=>{
            item.status = res.data.data.status;
            setGoodsList([...goodsList]);
            Taro.hideLoading();
        }).catch(()=>Taro.hideLoading());
    }


    return (
        <PageLayout statusBarProps={{title: '我的直播'}} showTabBar={false}>
            <View className="cu-bar search bg-white">
                <View className="search-form round">
                    <Text className="cuIcon-search"/>
                    <Input type="text" onInput={handleSearchInput} placeholder="搜索直播标题" confirm-type="search"/>
                </View>
                <View className="action">
                    <Navigator className={classNames("cuIcon-add text-orange")} url={`edit_history`} style={{fontSize: '56rpx'}} />
                </View>
            </View>
            {loading && <ContentLoading height='calc(100vh - 464rpx)'/>}
            {
                !isLogin ?
                    <View className='flex flex-direction align-center justify-center'
                          style={{height: 'calc(100vh - 464rpx)'}}>
                        <Button className="cu-btn bg-gradual-green block lg" style={{width: '80%'}}
                                onClick={() => makeLogin(() => loadData(true))}>登录查看</Button>
                    </View>
                    : (loading || goodsList.length === 0 ?
                        <Empty title="暂无直播" height='calc(100vh - 464rpx)'/> :
                        <View className="cu-list menu-avatar">{goodsList.map((item: any) => {
                            return (
                                <View
                                    className={classNames("cu-item", touchingItem === 'touch-' + item.id ? 'move-cur' : '', item.status ? '' : 'filter-gray')}
                                    onTouchStart={onTouchStart}
                                    onTouchMove={onTouchMove}
                                    onTouchEnd={onTouchEnd}
                                    data-index={'touch-' + item.id}
                                >
                                    <Navigator url={`live?id=${item.id}`} className="cu-avatar radius lg"
                                          style={{backgroundImage: 'url(' + resolveUrl(item.image) + ')'}}/>
                                    <Navigator url={`live?id=${item.id}`} className="content" style={{display: 'block', padding: 0}}>
                                        <View className="text-black">
                                            <View className="text-cut">{item.name}</View>
                                        </View>
                                        <View className='text-gray'>
                                            <View className="text-cut">开播时间：{moment(item.startAt).format('yyyy-MM-DD HH:mm:ss')}</View>
                                        </View>
                                    </Navigator>
                                    <View className="action text-sm">
                                        {item.price &&
                                            <View className="text-red">售价：￥{item.price}</View>
                                        }
                                        {!item.price &&
                                            <View className="text-green">免费</View>
                                        }
                                    </View>
                                    <View className='move'>
                                        <View onClick={()=>Taro.navigateTo({url:`edit_history?id=${item.id}`}).then()} className='bg-gray-2'>编辑</View>
                                        {item.status &&
                                            <View className='bg-red' onClick={()=>downIt(item)}>下架</View>
                                        }
                                        {!item.status &&
                                            <View className='bg-green' onClick={()=>upIt(item)}>上架</View>
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


export default withLogin(LiveHistoryPage);
