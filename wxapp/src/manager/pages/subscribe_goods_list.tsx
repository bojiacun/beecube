import Taro, {useDidShow, useReachBottom, useRouter} from '@tarojs/taro';
import {Button, Text, View, Input, ITouchEvent, Navigator} from "@tarojs/components";
import classNames from "classnames";
import util from '../../utils/we7/util';
import {useRef, useState} from "react";
import PageLayout from "../../layouts/PageLayout";
import request, {
    resolveUrl, SERVICE_WINKT_SYSTEM_HEADER,
} from "../../utils/request";
import withLogin from "../../components/login/login";
import Empty from "../../components/empty/empty";
import ContentLoading from "../../components/contentloading";
import {InputProps} from "@tarojs/components/types/Input";


const SubscribeGoodsList = (props) => {
    const {checkLogin, makeLogin} = props;
    const [touchStart, setTouchStart] = useState(0);
    const [touchDirection, setTouchDirection] = useState<string>('');
    const [touchingItem, setTouchingItem] = useState<string>('');
    const [goodsList, setGoodsList] = useState<any[]>([]);
    const [over, setOver] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState(1);
    const {params} = useRouter();
    const [searchKey, setSearchKey] = useState<string>(params.code??'');
    const isLogin = checkLogin();
    const searchInputRef = useRef<InputProps>();




    const loadData = (clear = false, page = 1, params = {}) => {
        if (!isLogin) return;
        const _page = clear ? 1 : page;
        setPage(_page);
        request.get("wxapp/manager/subscribe/goods", SERVICE_WINKT_SYSTEM_HEADER, {
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
        searchInputRef.current!.value = searchKey;
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
    const doEdit = (item:any) => {
        Taro.navigateTo({url: `subscribe_edit?id=${item.id}`}).then();
    }
    const changeStock = (item:any) => {
        Taro.navigateTo({url: `subscribe_stock?id=${item.id}`}).then();
    }
    const downShopGoods = (item:any) => {
        item.status = false;
        Taro.showLoading({title: '下架中...'}).then();
        request.put("wxapp/manager/subscribe/goods/"+item.id+'/status', SERVICE_WINKT_SYSTEM_HEADER, item, true).then((res)=>{
            item.status = res.data.data.status;
            setGoodsList([...goodsList]);
            Taro.hideLoading();
        }).catch(()=>Taro.hideLoading());
    }
    const upShopGoods = (item:any) => {
        item.status = true;
        Taro.showLoading({title: '上架中...'}).then();
        request.put("wxapp/manager/subscribe/goods/"+item.id+'/status', SERVICE_WINKT_SYSTEM_HEADER, item, true).then((res)=>{
            item.status = res.data.data.status;
            setGoodsList([...goodsList]);
            Taro.hideLoading();
        }).catch(()=>Taro.hideLoading());
    }
    const jumpToDetail = (item:any) => {
        if(params.action == 'select') {
            Taro.setStorageSync("tmp_live_goods", item);
            Taro.navigateBack().then();
        }
        else {
            Taro.navigateTo({url: `subscribe_detail?id=${item.id}`}).then();
        }
    }
    return (
        <PageLayout statusBarProps={{title: '借阅图书'}} showTabBar={false}>
            <View className="cu-bar search bg-white">
                <View className="search-form round">
                    <Text className="cuIcon-search"/>
                    <Input type="text" onInput={handleSearchInput} placeholder="搜索图书名称、编号、书架号" confirm-type="search" ref={searchInputRef} />
                </View>
                <View className="action">
                    <Navigator className={classNames("cuIcon-add text-orange")} url={`subscribe_edit`} style={{fontSize: '56rpx'}} />
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
                        <Empty title="暂无图书" height='calc(100vh - 464rpx)'/> :
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
                                    <View className="cu-avatar radius xl" onClick={()=>jumpToDetail(item)}
                                          style={{backgroundImage: 'url(' + resolveUrl(item.images.split(',')[0]) + ')'}}/>
                                    <View onClick={()=>jumpToDetail(item)} className="content" style={{display: 'block', padding: 0, left: '170rpx'}}>
                                        <View className="text-black">
                                            <View className="text-cut">{item.name}</View>
                                        </View>
                                        <View className='text-gray text-sm'>
                                            <View className={'text-cut'}>编号:{item.identifier}</View>
                                            <View className={'text-cut'}>书架号:{item.bookShelf} 已借出:{item.borrowed} 已损坏:{item.brokened} 已丢失:{item.losed}</View>
                                        </View>
                                    </View>
                                    <View className="action text-sm">
                                        <View className="text-red">售价:￥{item.price}</View>
                                        <View className="text-gray">库存:{item.store}</View>
                                        <View className="text-gray text-cut">{item.site.name}</View>
                                    </View>
                                    <View className='move'>
                                        <View className={'bg-gray-2'} onClick={()=>doEdit(item)}>编辑</View>
                                        <View className={'bg-orange'} onClick={()=>changeStock(item)}>库存</View>
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


export default withLogin(SubscribeGoodsList);
