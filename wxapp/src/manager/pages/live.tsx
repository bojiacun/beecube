import {useState} from "react";
import {
    ITouchEvent,
    Navigator,
    Text,
    View
} from "@tarojs/components";
import Taro, {useDidShow, useReady, useRouter} from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import withLogin from "../../components/login/login";
import request, {
    resolveUrl,
    SERVICE_WINKT_LIVE_HEADER,
} from "../../utils/request";
import classNames from "classnames";


const LivePage = () => {
    const [roomGoodsList, setRoomGoodsList] = useState<any>([]);
    const [info, setInfo] = useState<any>();
    const [touchStart, setTouchStart] = useState(0);
    const [touchDirection, setTouchDirection] = useState<string>('');
    const [touchingItem, setTouchingItem] = useState<string>('');
    const {params} = useRouter();

    useReady(() => {
        if (params.id) {
            request.get("wxapp/manager/live/histories/" + params.id, SERVICE_WINKT_LIVE_HEADER, null, true).then(res => {
                let detail = res.data.data;
                setInfo(detail);
            });
        }
    });

    useDidShow(() => {
        if (params.id) {
            request.get("wxapp/manager/live/histories/" + params.id, SERVICE_WINKT_LIVE_HEADER, null, true).then(res => {
                let detail = res.data.data;
                setInfo(detail);
            });
        }
        refreshGoods();
    });

    const refreshGoods = () => {
        if (params.id) {
            request.get("wxapp/manager/live/histories/" + params.id + "/goods", SERVICE_WINKT_LIVE_HEADER, null, true).then(res => {
                setRoomGoodsList(res.data.data);
            })
        }
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
    const doDelete = (item) => {
        request.del("wxapp/manager/live/histories/goods/" + item.id, SERVICE_WINKT_LIVE_HEADER, null, true).then(() => {
            refreshGoods();
        })
    }
    const downIt = (item: any) => {
        item.isUp = false;
        Taro.showLoading({title: '下架中...'}).then();
        request.put("wxapp/manager/live/histories/goods/" + item.id + '/status', SERVICE_WINKT_LIVE_HEADER, item, true).then(() => {
            refreshGoods();
            Taro.hideLoading();
        }).catch(() => Taro.hideLoading());
    }
    const upIt = (item: any) => {
        item.isUp = true;
        Taro.showLoading({title: '上架中...'}).then();
        request.put("wxapp/manager/live/histories/goods/" + item.id + '/status', SERVICE_WINKT_LIVE_HEADER, item, true).then(() => {
            refreshGoods();
            Taro.hideLoading();
        }).catch(() => Taro.hideLoading());
    }
    // @ts-ignore
    return (
        <PageLayout statusBarProps={{title: '直播控制台'}}>
            <View className="cu-bar bg-gray-2">
                <View className="action border-title">
                    <Text className="text-xl text-bold">带货商品</Text>
                    <Text className="bg-gradual-orange" style="width:3rem"/>
                </View>
            </View>
            <View className="padding bg-white margin-bottom-sm">
                本场直播的带货商品，所有商品同时只能有一个是正在解说中
            </View>
            <View className="cu-list menu-avatar">
                {roomGoodsList.map((item) => {
                    return (
                        <View
                            className={classNames("cu-item", touchingItem === 'touch-' + item.id ? 'move-cur' : '', item.isUp ? '' : 'filter-gray')}
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                            data-index={'touch-' + item.id}
                        >
                            <Navigator url={`detail?id=${item.goodsId}`} className="cu-avatar radius lg"
                                       style={{backgroundImage: 'url(' + resolveUrl(item.goodsImage) + ')'}}/>
                            <Navigator url={`detail?id=${item.goodsId}`} className="content"
                                       style={{display: 'block', padding: 0}}>
                                <View className="text-black">
                                    <View className="text-cut">{item.goodsName}</View>
                                </View>
                            </Navigator>
                            <View className="action text-sm">
                                <View className="text-red">售价：￥{item.goodsPrice}</View>
                            </View>
                            <View className='move'>
                                <View className={'bg-red'} onClick={() => doDelete(item)}>删除</View>
                                {item.isUp &&
                                    <View className='bg-gray-2' onClick={() => downIt(item)}>下架</View>
                                }
                                {!item.isUp &&
                                    <View className='bg-green' onClick={() => upIt(item)}>上架</View>
                                }
                            </View>
                        </View>
                    );
                })}
            </View>
            {info?.liveStatus == 1 &&
                <Navigator url={`edit_live_goods?id=${info?.id}`} className={'margin text-center text-orange'}><Text
                    className={'cuIcon-add'}/>继续添加{info.goodsType == 1 ? '商城':'借阅'}商品</Navigator>
            }

            <View style={{height: '200rpx'}}/>
            <View className={'cu-bar tabbar'} style={{width: '100%', position: 'fixed', bottom: 0, zIndex: 999}}>
                {info?.liveStatus == 1 ?
                    <Navigator url={`live_push?id=${info?.id}`} className="cu-btn block lg bg-orange shadow radius"
                               style={{width: '80%', margin: '0 auto'}}>去直播</Navigator>
                    :
                    <View className="cu-btn block lg bg-gray shadow radius"
                          style={{width: '80%', margin: '0 auto'}}>直播已结束</View>
                }
            </View>
        </PageLayout>
    );
}

export default withLogin(LivePage)
