import {Navigator, Image, View, Text} from "@tarojs/components";
import {useEffect, useState} from "react";
import util from "../../../../utils/we7/util";
import {resolveUrl} from "../../../../utils/request";
import {getGoodsByIds, getPagedGoods, getShopClasses} from "./service";
import withLogin from "../../../../components/login/login";
import Taro, {useDidShow} from "@tarojs/taro";
import {addShopCart, calcShopCartCount} from "../../../../global";


const ShopGoodsListModule = (props: any) => {
    const {index, basic, style, context, ...rest} = props;
    const [goodsList, setGoodsList] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [cartCount, setCartCount] = useState<number>(0);
    const [currentClassIndex, setCurrentClassIndex] = useState<number>(0);
    const types = [{title: '最新', value: 1}, {title: '推荐', value: 2}, {title: '热销', value: 3}];
    let tagColors = ['#ff5454', '#2c9940', '#fb9d0f'];


    const loadData = () => {
        if (basic.showClasses) {
            getShopClasses().then(res => {
                setClasses(res);
            })
        }
        if (basic.titleType == 2) {
            //获取分类商品
            getPagedGoods(0, 0, classes[currentClassIndex].id).then(res => {
                setGoodsList(res);
            });
        } else if (basic.titleType == 3) {
            //属性分类
            getPagedGoods(types[currentClassIndex].value, 0, 0).then(res => {
                setGoodsList(res);
            });
        } else {
            if (basic.dataSource == 1) {
                getPagedGoods(1, 0).then(res => {
                    setGoodsList(res);
                });
            } else if (basic.dataSource == 2) {
                getPagedGoods(2, 0).then(res => {
                    setGoodsList(res);
                });
            } else if (basic.items && basic.items.length > 0) {
                getGoodsByIds(basic.items.join(',')).then(res => {
                    setGoodsList(res);
                })
            } else {
                setGoodsList([]);
            }
        }
        setCartCount(calcShopCartCount());
    }
    useEffect(() => {
        loadData();
    }, [currentClassIndex]);


    useDidShow(() => {
        loadData();
    });
    const openDetail = item => {
        Taro.navigateTo({url: '/shop/pages/detail?id=' + item.id}).then();
    }
    const addCart = (item, event) => {
        event.preventDefault();
        event.stopPropagation();
        addShopCart(item);
        setCartCount(calcShopCartCount());
    }
    return (
        <View {...rest} style={style}>
            {basic.titleType == 1 &&
                <View style={{
                    position: 'relative',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Image src={'../../assets/images/designer/biaoqian.png'} mode="widthFix"
                           style={{display: 'block', width: '50%', position: 'absolute', zIndex: 0}}/>
                    <View className="text-lg"
                          style={{zIndex: 1, fontSize: basic.fontSize, marginBottom: '40rpx'}}>{basic.title}</View>
                </View>
            }
            {basic.titleType == 5 &&
                <View style={{
                    position: 'relative',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Image mode='widthFix' src={resolveUrl(basic.titleimg)} style={{
                        display: 'block',
                        width: basic.titleimgWidth + '%',
                        marginBottom: basic.titleBottomMargin,
                        marginTop: basic.titleTopMargin
                    }}/>
                </View>
            }
            {basic.titleType == 2 &&
                <View className={"noscroll"} style={{textAlign: 'center', overflowY: 'auto'}}>
                    <View style={{
                        display: 'inline-flex',
                        marginBottom: '20rpx',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        borderRadius: '16rpx',
                        backgroundColor: "#eaeaea"
                    }}>
                        {classes.map((item: any, index: number) => {
                            if (index == currentClassIndex) {
                                return (
                                    <View key={'subscribe_classes_' + index} style={{
                                        color: '#333',
                                        background: '#fdc019',
                                        padding: '20rpx',
                                        fontSize: '28rpx',
                                        fontWeight: 'bold'
                                    }}>
                                        <View style={{whiteSpace: 'nowrap', overflow: 'hidden'}}>
                                            {item.title}
                                        </View>
                                    </View>
                                );
                            }
                            return (
                                <View key={'subscribe_classes_' + index} onClick={() => setCurrentClassIndex(index)}
                                      style={{color: '#999999', padding: '20rpx', position: 'relative'}}>
                                    {index < classes.length - 1 && <View style={{
                                        width: 1,
                                        height: '50%',
                                        position: 'absolute',
                                        right: 0,
                                        top: '25%',
                                        backgroundColor: '#ccc'
                                    }}></View>}
                                    <View style={{whiteSpace: 'nowrap', overflow: 'hidden'}}>
                                        {item.title}
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>
            }
            {basic.titleType == 3 &&
                <View className={"noscroll"} style={{textAlign: 'center', overflowY: 'auto'}}>
                    <View style={{
                        display: 'flex',
                        marginBottom: '20rpx',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        borderRadius: '16rpx',
                        backgroundColor: "#eaeaea"
                    }}>
                        {types.map((item: any, index: number) => {
                            if (index == currentClassIndex) {
                                return (
                                    <View key={'subscribe_types_' + index} style={{
                                        flex: 1,
                                        color: '#333',
                                        background: '#fdc019',
                                        padding: '20rpx',
                                        fontSize: '28rpx',
                                        fontWeight: 'bold'
                                    }}>
                                        <View style={{whiteSpace: 'nowrap', overflow: 'hidden'}}>
                                            {item.title}
                                        </View>
                                    </View>
                                );
                            }
                            return (
                                <View key={'subscribe_types_' + index} onClick={() => setCurrentClassIndex(index)}
                                      style={{flex: 1, color: '#999999', padding: '20rpx', position: 'relative'}}>
                                    {index < types.length - 1 && <View style={{
                                        width: 1,
                                        height: '50%',
                                        position: 'absolute',
                                        right: 0,
                                        top: '25%',
                                        backgroundColor: '#ccc'
                                    }}></View>}
                                    <View style={{whiteSpace: 'nowrap', overflow: 'hidden'}}>
                                        {item.title}
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>
            }
            {basic.style == 1 &&
                <View style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
                    {goodsList.slice(0, basic.count).map((item: any) => {
                        let itemWidth = basic.space;
                        itemWidth = 'calc((100% - ' + util.px2rpx(itemWidth) + ') / 2)';
                        return (
                            <View onClick={() => openDetail(item)} key={'goods_' + item.id} style={{
                                width: itemWidth,
                                background: 'white',
                                marginBottom: util.px2rpx(basic.space),
                                borderRadius: util.px2rpx(basic.itemBorderRadius),
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {item.isMemberPrivate && <View style={{
                                    backgroundColor: '#ff5454',
                                    padding: '0 10rpx',
                                    color: 'white',
                                    position: 'absolute',
                                    left: '20rpx',
                                    top: '40rpx',
                                    zIndex: 1,
                                    borderTopRightRadius: '16rpx',
                                    borderBottomRightRadius: '16rpx'
                                }}>会员专享</View>}
                                <View style={{
                                    paddingTop: '100%',
                                    width: '100%',
                                    position: 'relative',
                                    borderRadius: util.px2rpx(basic.itemBorderRadius)
                                }}>
                                    <Image src={resolveUrl(item.images ? item.images.split(',')[0] : '')} style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        display: 'block',
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        zIndex: 99,
                                        borderRadius: util.px2rpx(basic.itemBorderRadius)
                                    }}/>
                                </View>
                                <View className='padding-left-sm padding-right-sm text-lg text-black' style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    marginBottom: 0,
                                    lineHeight: 2
                                }}>{item.shortName}</View>
                                <View
                                    className="padding-bottom-xs padding-left-sm padding-right-sm flex justify-between align-center">
                                    <Text className="text-orange">￥{item.price}</Text>
                                    <Image onClick={(e) => addCart(item, e)} src="../../assets/images/cart.png"
                                           style={{width: '36rpx', height: '36rpx'}}/>
                                </View>
                            </View>
                        );
                    })}
                </View>
            }
            {basic.style == 2 &&
                goodsList.slice(0, basic.count).map((item: any, index: number) => {
                    return (
                        <View key={item.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'white',
                            padding: '20rpx 30rpx',
                            marginBottom: index == goodsList.length - 1 ? 0 : util.px2rpx(basic.space),
                            borderRadius: util.px2rpx(basic.itemBorderRadius),
                            position: 'relative'
                        }}>
                            <Navigator url={`/shop/pages/detail?id=${item.id}`}
                                       style={{width: '160rpx', marginRight: '30rpx'}}>
                                <Image src={resolveUrl(item.images ? item.images.split(',')[0] : '')} mode="widthFix"
                                       style={{display: 'block', width: '100%', height: '160rpx', objectFit: 'cover'}}/>
                            </Navigator>
                            <Navigator url={`/shop/pages/detail?id=${item.id}`} style={{flex: 1}}>
                                <View className="text-lg" style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    marginBottom: 0
                                }}>{item.shortName}</View>
                                <View className='text-gray margin-top-xs margin-bottom-xs text-sm'>{item.soled}人已购买
                                    作者：{item.author}</View>
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
                                    style={{textDecoration: 'line-through'}}>￥{item.marketPrice}</Text></View>
                            </Navigator>
                            <View onClick={e => addCart(item, e)} style={{
                                backgroundColor: '#ffba16',
                                borderRadius: '30rpx',
                                position: 'absolute',
                                right: '30rpx',
                                bottom: '30rpx',
                                border: 'none',
                                padding: '10rpx 40rpx'
                            }}>加入购物车</View>
                        </View>
                    );
                })
            }
            <Navigator url='/shop/pages/cart' className="cu-avatar lg bg-white round margin-left shadow"
                       style={{zIndex: 999, position: 'fixed', bottom: 160, right: 20, padding: '20rpx'}}>
                <Image src="../../assets/images/cart.png" style={{width: '64rpx', height: '64rpx'}}/>
                <View className="cu-tag badge bg-red text-white" style={{fontSize: '28rpx'}}>{cartCount}</View>
            </Navigator>
        </View>
    );
}

export default withLogin(ShopGoodsListModule);
