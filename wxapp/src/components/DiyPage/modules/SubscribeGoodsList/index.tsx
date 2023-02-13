import {Image, View, Text, Navigator} from "@tarojs/components";
import {useEffect, useState} from "react";
import util from "../../../../utils/we7/util";
import {resolveUrl} from "../../../../utils/request";
import {getPagedSubscribeGoods, getSubscribeClasses, getSubscribeGoodsByIds} from "./service";
import withLogin from "../../../../components/login/login";
import {calcSubscribeCartCount, openSubscribeGoods} from "../../../../global";
import {useDidShow} from "@tarojs/taro";


const SubscribeGoodsListModule = (props: any) => {
    const {index, style, basic, context, makeLogin, dispatch, ...rest} = props;
    const {userInfo} = context;
    const [goodsList, setGoodsList] = useState<any[]>([]);
    const [cartCount, setCartCount] = useState<number>(0);
    const [classes, setClasses] = useState<any[]>([]);
    const [currentClassIndex, setCurrentClassIndex] = useState<number>(0);

    let tagColors = ['#ff5454', '#2c9940', '#fb9d0f'];
    const types = [{title: '最新', value: 1}, {title: '推荐', value: 2}, {title: '热销', value: 3}];

    const loadData = () => {
        if (basic.showClasses) {
            getSubscribeClasses().then(res => {
                setClasses(res.data);
            })
        }
        if (basic.titleType == 2) {
            //分类商品
            getPagedSubscribeGoods(0, userInfo?.memberInfo?.siteId ?? 0, classes[currentClassIndex].id).then(res => {
                setGoodsList(res);
            });
        } else if (basic.titleType == 3) {
            getPagedSubscribeGoods(types[currentClassIndex].value, userInfo?.memberInfo?.siteId ?? 0, 0).then(res => {
                setGoodsList(res);
            });
        } else {
            if (basic.dataSource == 1) {
                getPagedSubscribeGoods(1, userInfo?.memberInfo?.siteId ?? 0, 0).then(res => {
                    setGoodsList(res);
                });
            } else if (basic.dataSource == 2) {
                getPagedSubscribeGoods(2, userInfo?.memberInfo?.siteId ?? 0, 0).then(res => {
                    setGoodsList(res);
                });
            } else if (basic.items && basic.items.length > 0) {
                getSubscribeGoodsByIds(basic.items.join(',')).then(res => {
                    setGoodsList(res);
                })
            } else {
                setGoodsList([]);
            }
        }
        setCartCount(calcSubscribeCartCount());
    }
    useEffect(() => {
        loadData();
    }, [userInfo?.memberInfo?.siteId, currentClassIndex]);


    useDidShow(() => {
        loadData();
    })

    const openDetail = (item: any) => {
        makeLogin((u) => {
            openSubscribeGoods(item, u);
        });
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
                    <View style={{zIndex: 1, fontSize: basic.fontSize, marginBottom: '40rpx'}}>{basic.title}</View>
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
                        display: 'inline-flex',
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
                                      style={{color: '#999999', padding: '20rpx', position: 'relative'}}>
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
                            <View onClick={() => openDetail(item)} key={item.id} style={{
                                width: itemWidth,
                                background: 'white',
                                marginBottom: basic.space,
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
                                    <Image src={resolveUrl(item.images.split(',')[0])} style={{
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
                                <View className={'padding-left-sm padding-right-sm padding-bottom-sm'}>
                                    <View className="text-lg text-black" style={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        marginBottom: 0,
                                        lineHeight: 2
                                    }}>{item.shortName}</View>
                                    <View style={{fontSize: '24rpx', display: 'flex'}}>
                                        {item.site.enableDelivery && <View style={{
                                            backgroundColor: '#faead5',
                                            color: '#fb9d0f',
                                            marginRight: '20rpx',
                                            padding: '0 6rpx',
                                            borderBottomRightRadius: '10rpx'
                                        }}>#快递配送</View>}
                                        {item.site.enableSelfPickUp && <View style={{
                                            backgroundColor: '#dbece4',
                                            color: '#2c9940',
                                            marginRight: '20rpx',
                                            padding: '0 6px',
                                            borderBottomRightRadius: '10rpx'
                                        }}>#到店自提</View>}
                                    </View>
                                    <View style={{
                                        color: 'gray',
                                        fontSize: '24rpx',
                                        marginTop: '6rpx'
                                    }}>{item.borrowed}人借阅</View>
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
                            <View onClick={() => openDetail(item)} style={{width: '160rpx', marginRight: '30rpx'}}>
                                <Image src={resolveUrl(item.images.split(',')[0])}
                                       style={{display: 'block', width: '100%', height: '160rpx', objectFit: 'cover'}}/>
                            </View>
                            <View onClick={() => openDetail(item)} style={{flex: 1}}>
                                <View className="text-lg" style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    marginBottom: 0,
                                    lineHeight: 2
                                }}>{item.shortName}</View>
                                <View className='text-gray margin-top-xs margin-bottom-xs text-sm'>{item.borrowed}人已借阅
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
                                <View className='margin-bottom-xs'>会员免费借阅</View>
                                <View className='text-gray'>图书定价：<Text
                                    style={{textDecoration: 'line-through'}}>{item.price}</Text></View>
                            </View>
                            <View onClick={() => util.gotoLink(`/subscribe/pages/detail?id=${item.id}`)} style={{
                                backgroundColor: '#ffba16',
                                borderRadius: '30rpx',
                                position: 'absolute',
                                right: '30rpx',
                                bottom: '30rpx',
                                border: 'none',
                                padding: '10rpx 40rpx'
                            }}>去借阅</View>
                        </View>
                    );
                })
            }
            <Navigator url='/subscribe/pages/cart' className="cu-avatar lg bg-white round margin-left shadow"
                       style={{zIndex: 999, position: 'fixed', bottom: 100, right: 20, padding: '20rpx'}}>
                <Image src="../../assets/images/bag.png" style={{width: '64rpx', height: '64rpx'}}/>
                <View className="cu-tag badge bg-red text-white" style={{fontSize: '28rpx'}}>{cartCount}</View>
            </Navigator>
        </View>
    );
}

export default withLogin(SubscribeGoodsListModule);
