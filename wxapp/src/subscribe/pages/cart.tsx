import {useState} from "react";
import {View, Text, CheckboxGroup, Checkbox, Label, Button, ITouchEvent, Image} from '@tarojs/components';
import Taro, {useDidShow, useRouter} from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import Empty from "../../components/empty/empty";
import {
    resolveUrl,
} from "../../utils/request";
import withLogin from "../../components/login/login";
import _ from 'lodash';
import {isBindSite, removeSubscribeCart} from "../../global";
import classNames from "classnames";

const CART_KEY = "SUBSCRIBE-CART";

const SubscribeCart = ({makeLogin, context}) => {
    const {userInfo} = context;
    const [goods, setGoods] = useState<any[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [selectedGoods, setSelectedGoods] = useState<any[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(true);
    const [touchStart, setTouchStart] = useState(0);
    const [touchDirection, setTouchDirection] = useState<string>('');
    const [touchingItem, setTouchingItem] = useState<string>('');
    const {params} = useRouter();

    const loadData = () => {
        let goods = Taro.getStorageSync(CART_KEY);
        if (goods) {
            goods = JSON.parse(goods);
            setGoods(goods);
            let selectedGoods = goods.filter(g => g.selected);
            setSelectedGoods(selectedGoods);
            setSelectAll(selectedGoods.length == goods.length);
            if (selectedGoods.length > 0) {
                setTotalPrice(selectedGoods.map(g => g.count * g.price).reduce((a, b) => a + b));
            } else {
                setTotalPrice(0);
            }
        } else {
            setGoods([]);
            setTotalPrice(0);
            setSelectedGoods([]);
        }
    }

    useDidShow(() => {
        loadData();
    })

    const onSelectedChanged = (e) => {
        let newIds = e.detail.value;
        goods.forEach(g => g.selected = false);
        let selectedGoods = newIds.map(id => goods.filter(g => g.id == id)[0]).map(g => {
            g.selected = true;
            return g;
        });
        setSelectedGoods(selectedGoods);
        if (selectedGoods.length > 0) {
            setTotalPrice(selectedGoods.map(g => g.count * g.price).reduce((a, b) => a + b));
        } else {
            setTotalPrice(0);
        }
        setSelectAll(selectedGoods.length == goods.length);
    }

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            goods.forEach(g => g.selected = true);
            setSelectedGoods(goods);
            setTotalPrice(goods.map(g => g.count * g.price).reduce((a, b) => a + b));
        } else {
            goods.forEach(g => g.selected = false);
            setSelectedGoods([]);
            setTotalPrice(0);
        }
    }


    const openConfirm = () => {
        makeLogin(() => {
            let ids = selectedGoods.map(sg => sg.id).join(',');
            let siteIds = _.uniq(selectedGoods.map(sg => sg.site.id));
            if (siteIds.length > 1) {
                return Taro.showToast({title: '您的书袋中有多个门店书籍，您只能同时借阅一个门店的书籍', icon: 'error'});
            }
            if (siteIds[0] != userInfo?.memberInfo?.siteId) {
                return Taro.showToast({title: '您书袋中有其他门店书籍，请删除后再借阅', icon: 'error'});
            }
            let url = `confirm?id=${ids}&in_site=${params.action ? 1 : ''}&member_id=${params.member_id ?? ''}&agent=${params.agent ?? ''}`;
            Taro.navigateTo({url: url}).then();
        })
    }

    const scanBook = () => {
        if (!isBindSite(userInfo)) {
            Taro.showModal({title: '错误提示', content: '您还没有绑定门店，请绑定后再扫码'}).then();
        }
        Taro.showLoading({title: '识别中...'}).then();
        Taro.scanCode({
            scanType: ['barCode', 'qrCode'], success: (res) => {
                if (res.result) {
                    Taro.navigateTo({url: `/subscribe/pages/scan_results?identifier=${res.result}&siteId=${userInfo?.memberInfo?.siteId}`}).then();
                }
                Taro.hideLoading();
            },
            fail: () => {
                Taro.showModal({title: '错误提示', content: '扫码失败'}).then();
                Taro.hideLoading();
            }
        }).then();
    }
    const doDelete = (item) => {
        removeSubscribeCart(item);
        loadData();
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
    const reduceGoods = (item) => {
        let newGoods;
        item.count--;
        if(item.count <= 0) {
            Taro.showModal({
                title: '信息提示',
                content: '确定移除该商品吗?',
                success(res){
                    if(res.confirm) {
                        newGoods = goods.filter(g => g.id != item.id);
                        setGoods([...newGoods]);
                        if(newGoods.length > 0) {
                            setTotalPrice(newGoods.map(g => g.count*g.price).reduce((a,b)=>a+b));
                        }
                        else {
                            setTotalPrice(0);
                        }
                        Taro.setStorageSync(CART_KEY, JSON.stringify(newGoods));
                    }
                    else {
                        item.count = 1;
                    }
                }
            }).then();
        }
        else {
            goods.forEach(g => {
                if(g.id == item.id) {
                    g.count = item.count;
                }
            });
            newGoods = goods;
            setGoods([...newGoods]);
            if(newGoods.length > 0) {
                setTotalPrice(newGoods.map(g => g.count*g.price).reduce((a,b)=>a+b));
            }
            else {
                setTotalPrice(0);
            }
            Taro.setStorageSync(CART_KEY, JSON.stringify(newGoods));
        }
    }
    const addGoods = () => {
        return Taro.showToast({title: '同一本书只能借阅一本', icon: 'none'}).then();
    }
    return (
        <PageLayout showTabBar={false} statusBarProps={{title: '我的书袋'}}>
            {goods.length == 0 && <Empty title="书袋要瘪了T.T~"/>}
            {goods.length > 0 &&
                <CheckboxGroup onChange={onSelectedChanged}>
                    <View className="cu-list menu-avatar">
                        {goods.map((item) => {
                            return (
                                <View
                                    className={classNames("cu-item padding-bottom padding-top solid-bottom", touchingItem === 'touch-' + item.id ? 'move-cur' : '')}
                                    data-index={'touch-' + item.id}
                                    onTouchStart={onTouchStart}
                                    onTouchMove={onTouchMove}
                                    onTouchEnd={onTouchEnd}
                                    style={{justifyContent: 'flex-start', boxSizing: 'content-box'}}
                                >
                                    <View className="flex justify-center align-center" style={{width: '100rpx'}}>
                                        <Checkbox value={item.id} className='orange'
                                                  checked={selectedGoods.filter(s => s.id == item.id).length > 0}/>
                                    </View>
                                    <View className="cu-avatar xl"
                                          style={{
                                              backgroundImage: 'url(' + resolveUrl(item.images[0]) + ')',
                                              left: '100rpx'
                                          }}/>
                                    <View className="content flex flex-direction justify-between"
                                          style={{left: '246rpx', height: '128rpx'}}>
                                        <View className="text-lg text-normal text-black text-cut" style={{
                                            overflow: 'hidden',
                                            maxHeight: '84rpx',
                                            display: 'block'
                                        }}>{item.name}</View>
                                        <View className='text-gray text-sm'>{item.site?.name}</View>
                                        <View className="flex align-center justify-between">
                                            <View className="text-orange text-bold">会员免费借</View>
                                            <View className="flex align-center">
                                                <Image src="../../assets/images/icon-input-reduce.png" onClick={()=>reduceGoods(item)}
                                                       style={{width: '36rpx', height: '36rpx'}}/>
                                                <Text className="margin-left margin-right">{item.count}</Text>
                                                <Image src="../../assets/images/icon-input-add.png" onClick={()=>addGoods()}
                                                       style={{width: '36rpx', height: '36rpx'}}/>
                                            </View>
                                        </View>
                                    </View>
                                    <View className="move">
                                        <View className="bg-red" onClick={() => doDelete(item)}
                                              data-id={item.id}>删除</View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </CheckboxGroup>
            }
            {params.action === 'scan' &&
                <View className="cu-bar bg-white tabbar"
                      style={{position: 'fixed', zIndex: 999, bottom: '0rpx', width: '100%'}}>
                    <Button onClick={scanBook} className="bg-orange submit no-radius" style={{height: '100rpx'}}><Text
                        className='cuIcon-scan'/>扫码借阅</Button>
                    <Button onClick={openConfirm} disabled={totalPrice <= 0} className="bg-red submit no-radius"
                            style={{height: '100rpx'}}>免费借阅</Button>
                </View>
            }
            {!params.action &&
                <View className="cu-bar bg-white tabbar border shop cart"
                      style={{position: 'fixed', zIndex: 999, bottom: '0rpx', width: '100%'}}>
                    <Label className="action" onClick={handleSelectAll} style={{width: '180rpx', fontSize: '32rpx'}}>
                        <Checkbox className='orange' value="all" checked={selectAll} style={{marginRight: 5}}/>
                        全选
                    </Label>
                    <View className="action" style={{
                        fontSize: '32rpx',
                        width: '300rpx',
                        textAlign: 'left',
                        justifyContent: 'flex-start',
                        paddingLeft: '20rpx'
                    }}>
                    </View>
                    <Button onClick={openConfirm} disabled={totalPrice <= 0} className="bg-red submit no-radius"
                            style={{height: '100rpx'}}>免费借阅</Button>
                </View>
            }
        </PageLayout>
    );
}

export default withLogin(SubscribeCart);
