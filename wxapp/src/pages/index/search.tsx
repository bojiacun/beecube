import Taro, {useReachBottom, useRouter} from '@tarojs/taro';
import {Text, View, Input, Navigator, Image} from "@tarojs/components";
import classNames from "classnames";
import util from '../../utils/we7/util';
import {useState} from "react";
import PageLayout from "../../layouts/PageLayout";
import request, {
    API_SHOP_GOODS_LIST, API_SUBSCRIBE_GOODS_LIST,
    resolveUrl,
    SERVICE_WINKT_SYSTEM_HEADER
} from "../../utils/request";
import Empty from "../../components/empty/empty";
import ContentLoading from "../../components/contentloading";

let tagColors = ['#ff5454', '#2c9940', '#fb9d0f'];

const SearchIndexPage = () => {
    const {params} = useRouter();
    const BOOK_TYPE = parseInt(params.type ?? '1');
    const [over, setOver] = useState(false);
    // @ts-ignore
    const [dataSource, setDataSource] = useState<number>(BOOK_TYPE);
    const [goodsList, setGoodsList] = useState<any[]>([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const [searchKey, setSearchKey] = useState<string>('');


    const loadData = (clear = false, page = 1, searchKey: string) => {
        const _page = clear ? 1 : page;
        setPage(_page);
        request.get(dataSource == 1 ? API_SHOP_GOODS_LIST : API_SUBSCRIBE_GOODS_LIST, SERVICE_WINKT_SYSTEM_HEADER, {
            key: searchKey,
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
    const addCartText = parseInt(params.type ?? '1') == 1 ? '加入购物车' : '加入书袋';
    const addCart = (item, event) => {
        let CART_KEY = parseInt(params.type ?? '1') == 1 ? 'CART' : 'SUBSCRIBE-CART';
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
        Taro.showToast({title: '加入购物车成功', icon: 'success'}).then();
    }

    return (
        <PageLayout statusBarProps={{title: dataSource == 1 ? '搜索商城图书':'搜索借阅图书'}} showTabBar={false}>
            <View className="cu-bar search bg-white">
                <View className="search-form round">
                    <Text className="cuIcon-search"/>
                    <Input type="text" onInput={handleSearchInput} placeholder="输入图书名称搜索图书" confirm-type="search"/>
                </View>
            </View>
            {loading && <ContentLoading height='calc(100vh - 464rpx)'/>}
            {goodsList.length == 0 && <Empty title="暂无图书" height='calc(100vh - 464rpx)'/>}
            {goodsList.length > 0 && goodsList.map((item: any, index: number) => {
                let detailPage = parseInt(params.type ?? '1') == 1 ? '/shop/pages/detail' : '/subscribe/pages/detail';
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
                        <Navigator url={`${detailPage}?id=${item.id}`} style={{flex: 1}}>
                            <View className="text-lg" style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                marginBottom: 0
                            }}>{item.shortName}</View>
                            {BOOK_TYPE == 1 ?
                                <View className='text-gray margin-top-xs margin-bottom-xs text-sm'>{item.soled}人已购买
                                    作者：{item.author} 门店：{item.site.name}</View> :
                                <View className='text-gray margin-top-xs margin-bottom-xs text-sm'>{item.borrowed}人已借阅
                                    作者：{item.author} 门店：{item.site.name}</View>
                            }
                            <View className='margin-bottom-xs'>
                                {item.tags?.split(',').map((tag: string, index: number) => {
                                    return <Text className='cu-tag round text-sm' style={{
                                        backgroundColor: tagColors[index],
                                        color: 'white',
                                        height: 'auto'
                                    }}>{tag}</Text>
                                })}
                            </View>
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
            <View className={classNames("cu-load text-gray", over ? 'over' : (loadingMore ? 'loading' : ''))}/>

        </PageLayout>
    );
}


export default SearchIndexPage;
