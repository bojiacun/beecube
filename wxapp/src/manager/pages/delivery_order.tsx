import Taro, {useReady, useDidShow, useReachBottom} from '@tarojs/taro';
import {Button, Navigator, ScrollView, Text, View, Input, Form, Picker} from "@tarojs/components";
import classNames from "classnames";
import util from '../../utils/we7/util';
import {useState} from "react";
import PageLayout from "../../layouts/PageLayout";
import request, {
    API_RECYCLERS_INFO, API_SHOP_GOODS_ORDERS_DELIVERY, API_SHOP_GOODS_ORDERS_DELIVERY_BIND, API_SITES,
    resolveUrl, SERVICE_WINKT_ORDER_HEADER,
    SERVICE_WINKT_RECYCLER_HEADER, SERVICE_WINKT_SYSTEM_HEADER
} from "../../utils/request";
import withLogin from "../../components/login/login";
import Empty from "../../components/empty/empty";
import ContentLoading from "../../components/contentloading";
import moment from 'moment';


const DeliveryOrders = (props) => {
    const {checkLogin, makeLogin, context, isIpx} = props;
    const [currentTabIndex, setCurrentTabIndex] = useState(0);
    const [orders, setOrders] = useState<any[]>([]);
    const [selectedCommunity, setSelectedCommunity] = useState(-1);
    const [selectedBuilding, setSelectedBuilding] = useState(-1);
    const [selectedUnit, setSelectedUnit] = useState(-1);
    const [buildings, setBuildings] = useState<any>([]);
    const [units, setUnits] = useState<any>([]);
    const [communities, setCommunities] = useState<any>();
    const [over, setOver] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [filterVisible, setFilterVisible] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const [searchKey, setSearchKey] = useState<string>('');
    const [filterValues, setFilterValues] = useState<any>({});
    const isLogin = checkLogin();
    const tabSelect = (index) => {
        setCurrentTabIndex(index)
        setLoading(true);
        loadData(index, true, 1, {key: searchKey});
    }


    const loadData = (tabIndex, clear = false, page = 1, params = {}) => {
        if (!isLogin) return;
        const _page = clear ? 1 : page;
        setPage(_page);
        request.get(API_SHOP_GOODS_ORDERS_DELIVERY, SERVICE_WINKT_ORDER_HEADER, {
            ...params,
            page: _page,
            tab: tabIndex
        }, true).then(res => {
            setLoadingMore(false);
            let list = res.data.data.content;
            if (clear) {
                setOver(false);
                setOrders(list);
            } else {
                if (!list || list.length === 0) {
                    setOver(true);
                } else {
                    setOrders([...orders, ...list]);
                }
            }
            setLoading(false);
        }).catch(() => {
            setLoadingMore(false);
            setLoading(false);
        })
    }

    useReady(() => {
        request.put(API_RECYCLERS_INFO, SERVICE_WINKT_RECYCLER_HEADER, null, true).then(res => {
            return request.get(API_SITES + '/' + res.data.data.siteId + '/communities', SERVICE_WINKT_SYSTEM_HEADER);
        }).then(res => {
            setCommunities(res.data.data);
        })
    });
    useDidShow(() => {
        loadData(currentTabIndex, true, 1, {key: searchKey});
    });
    useReachBottom(() => {
        if (!over) {
            setLoadingMore(true);
            loadData(currentTabIndex, false, page + 1, {key: searchKey});
        }
    })
    const onCommunityChanged = (e) => {
        let communityIndex = parseInt(e.detail.value);
        setSelectedCommunity(communityIndex);
        let communityBuildings = communities[communityIndex].buildings.split('\n').map(building => {
            let infos = building.split(',');
            return {label: infos[0], value: infos[0], units: infos};
        });
        setBuildings(communityBuildings);
    }
    const onBuildingChanged = (e) => {
        let buildingIndex = parseInt(e.detail.value);
        setSelectedBuilding(buildingIndex);
        let units = buildings[buildingIndex].units.map(item => ({label: item, value: item}));
        units.shift();
        setUnits(units);
    }
    const onUnitChanged = (e) => {
        setSelectedUnit(parseInt(e.detail.value));
    }
    const doFilter = () => {
        let filterValues: any = {};
        selectedCommunity > -1 && (filterValues.communityId = communities[selectedCommunity].id);
        selectedBuilding > -1 && (filterValues.buildingNumber = buildings[selectedBuilding].value);
        selectedUnit > -1 && (filterValues.unitNumber = units[selectedUnit].value);
        setFilterValues({...filterValues});
        setFilterVisible(false);
        if (searchKey) {
            filterValues.key = searchKey;
        }
        loadData(currentTabIndex, true, 1, filterValues);
    }
    const doSearch = util.debounce(loadData, 500);
    const handleSearchInput = (e) => {
        let key = e.detail.value;
        setSearchKey(key);
        doSearch(currentTabIndex, true, 1, {key: key, ...filterValues});
    }

    const doScanAdd = () => {
        Taro.scanCode({onlyFromCamera: true}).then(res => {
            let barcode = res.result;
            return request.put(API_SHOP_GOODS_ORDERS_DELIVERY_BIND + '/' + barcode, SERVICE_WINKT_ORDER_HEADER, null, true).then(() => {
                loadData(0, true);
            })
        }).catch(() => {
            Taro.showModal({title: '错误提示', content: '扫码失败', showCancel: false}).then()
            setLoading(false);
        });
    }

    return (
        <PageLayout statusBarProps={{title: '订单配送'}} showTabBar={false}>
            <View className="cu-bar search bg-white">
                <View className="search-form round">
                    <Text className="cuIcon-search"/>
                    <Input type="text" onInput={handleSearchInput} placeholder="搜索姓名、手机号" confirm-type="search"/>
                </View>
                <View className="action">
                    <Text onClick={() => setFilterVisible(true)}
                          className={classNames("cuIcon-cascades", Object.keys(filterValues).length > 0 ? 'text-green' : '')}
                          style={{fontSize: '56rpx'}}/>
                    <Text onClick={doScanAdd} className={classNames("cuIcon-scan")} style={{fontSize: '56rpx'}}/>
                </View>
            </View>
            <ScrollView scrollX={true} className="bg-white nav">
                <View className="flex text-center">
                    <View className={classNames("cu-item flex-sub", currentTabIndex === 0 ? 'text-green cur' : '')}
                          onClick={() => tabSelect(0)}>
                        待配送
                    </View>
                    <View className={classNames("cu-item flex-sub", currentTabIndex === 1 ? 'text-green cur' : '')}
                          onClick={() => tabSelect(1)}>
                        已配送
                    </View>
                </View>
            </ScrollView>
            {loading && <ContentLoading height='calc(100vh - 464rpx)'/>}
            {
                !isLogin ?
                    <View className='flex flex-direction align-center justify-center'
                          style={{height: 'calc(100vh - 464rpx)'}}>
                        <Button className="cu-btn bg-gradual-green block lg" style={{width: '80%'}}
                                onClick={() => makeLogin(() => loadData(currentTabIndex, true))}>登录查看</Button>
                    </View>
                    : (loading || orders.length === 0 ?
                        <Empty title="暂无订单" height='calc(100vh - 464rpx)'/> :
                        <View className="cu-card article">{orders.map((item: any) => {
                            return (
                                <View className="cu-item" style={{paddingBottom: 0}}>
                                    <View className="flex align-center padding solid-bottom text-gray justify-between">
                                        <Text> 编号：{item.ordersn} </Text>
                                        {item.status == 0 && <Text className="text-yellow">待支付</Text>}
                                        {item.status == 1 && <Text className="text-green">待发货</Text>}
                                        {item.status == 2 && <Text className="text-red">待配送</Text>}
                                        {item.status == 3 && <Text>已完成</Text>}
                                    </View>
                                    <View className="cu-list menu-avatar">
                                        {item.goods.map((g: any) => {
                                            return (
                                                <View className="cu-item">
                                                    <View className="cu-avatar radius lg"
                                                          style={{backgroundImage: 'url(' + resolveUrl(g.images.split(',')[0]) + ')'}}/>
                                                    <View className="content" style={{display: 'block', padding: 0}}>
                                                        <View className="text-black">
                                                            <Text className="text-cut">{g.name}</Text>
                                                        </View>
                                                        <View className="text-gray text-sm flex">
                                                            <text className="text-cut">￥{g.price.toFixed(2)}</text>
                                                        </View>
                                                    </View>
                                                    <View className="action" style={{width: '160rpx'}}>
                                                        <View className="text-grey">X {g.count}</View>
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </View>
                                    <View className="flex solid-top padding text-gray justify-between align-center">
                                        <View>
                                            <View className="flex align-center">
                                                <View>{item.communityName} {item.buildingNumber} {item.unitNumber} {item.houseNumber}</View>
                                            </View>
                                            <View
                                                className="text-gray text-sm">下单时间：{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</View>
                                        </View>
                                        <Navigator url={"/pages/shop/order_detail?id=" + item.id}>查看详情</Navigator>
                                    </View>
                                </View>
                            );
                        })}</View>)
            }
            <View className={classNames("cu-load text-gray", over ? 'over' : (loadingMore ? 'loading' : ''))}/>

            <View className={classNames("cu-modal drawer-modal justify-end", filterVisible ? 'show' : '')}
                  onClick={() => setFilterVisible(false)}>
                <View onClick={(e) => e.stopPropagation()} className="cu-dialog basis-lg" style={{
                    top: context.navBarHeight + context.systemInfo.statusBarHeight,
                    height: 'calc(100vh - ' + (context.navBarHeight + context.systemInfo.statusBarHeight) + 'px)',
                    position: 'relative'
                }}>
                    <Form onSubmit={doFilter} onReset={() => {
                        setSelectedUnit(-1);
                        setSelectedCommunity(-1);
                        setSelectedBuilding(-1);
                    }}>
                        <View className="cu-bar bg-gray-2">
                            <View className="action border-title">
                                <Text className="text-xl text-bold">社区筛选</Text>
                                <Text className="bg-gradual-green" style="width:3rem"/>
                            </View>
                        </View>
                        <View className="cu-form-group">
                            <Picker onChange={onCommunityChanged} value={selectedCommunity} range={communities}
                                    rangeKey="name">
                                <View className="picker" style={{textAlign: 'center'}}>
                                    {selectedCommunity > -1 ? communities[selectedCommunity].name : '请选择要筛选的社区'}
                                </View>
                            </Picker>
                        </View>
                        <View className="cu-bar bg-gray-2">
                            <View className="action border-title">
                                <Text className="text-xl text-bold">楼号筛选</Text>
                                <Text className="bg-gradual-green" style="width:3rem"/>
                            </View>
                        </View>
                        <View className="cu-form-group">
                            <Picker onChange={onBuildingChanged} value={selectedBuilding} range={buildings}
                                    rangeKey="value">
                                <View className="picker" style={{textAlign: 'center'}}>
                                    {selectedBuilding > -1 ? buildings[selectedBuilding].label : '请选择要筛选的楼栋'}
                                </View>
                            </Picker>
                        </View>
                        <View className="cu-bar bg-gray-2">
                            <View className="action border-title">
                                <Text className="text-xl text-bold">单元筛选</Text>
                                <Text className="bg-gradual-green" style="width:3rem"/>
                            </View>
                        </View>
                        <View className="cu-form-group">
                            <Picker onChange={onUnitChanged} value={selectedUnit} range={units} rangeKey="value">
                                <View className="picker" style={{textAlign: 'center'}}>
                                    {selectedUnit > -1 ? units[selectedUnit].label : '请选择要筛选的单元'}
                                </View>
                            </Picker>
                        </View>
                        <View className="flex align-center" style={{width: '100%', position: 'fixed', bottom: 0}}>
                            <Button formType="reset" className="flex-sub cu-btn bg-white lg block no-radius"
                                    style={{paddingBottom: isIpx ? '20rpx' : 0, boxSizing: 'content-box'}}>重置</Button>
                            <Button formType="submit" className="flex-sub cu-btn block lg bg-gradual-green no-radius"
                                    style={{paddingBottom: isIpx ? '20rpx' : 0, boxSizing: 'content-box'}}>确定</Button>
                        </View>
                    </Form>
                </View>
            </View>

        </PageLayout>
    );
}


export default withLogin(DeliveryOrders);
