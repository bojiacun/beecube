import withLogin from "../../components/login/login";
import {Button, Image, Input, ScrollView, Text, View, Navigator, LivePlayer} from "@tarojs/components";
import PageLayout from "../../layouts/PageLayout";
import Taro, {useRouter} from "@tarojs/taro";
import {useEffect, useRef, useState} from "react";
import request, {
    API_SHOP_GOODS_INFO,
    resolveUrl,
    SERVICE_WINKT_LIVE_HEADER,
    SERVICE_WINKT_SYSTEM_HEADER
} from "../../utils/request";
import TransparentTag from "../../components/TransparentTag";
import TLS from 'im-live-sells';
import {InputProps} from "@tarojs/components/types/Input";
import TencentIM, {TimMessage} from "../../utils/tim";
import moment from "moment";
import Modal from "../../components/modal/modal";
import classNames from "classnames";
import {addShopCart} from "../../global";
import _ from 'lodash';

const MESSAGE_CACHE_SIZE = 8;
const NOTICE_CACHE_SIZE = 8;

const LiveRoomPage = (props: any) => {
    const {context} = props;
    const {headerHeight} = context;
    const [liveDetail, setLiveDetail] = useState<any>();
    const [tls, setTls] = useState<any>();
    const [isZan, setIsZan] = useState<boolean>(false);
    const [messages, setMessages] = useState<TimMessage[]>([]);
    const [notices, setNotices] = useState<TimMessage[]>([]);
    const [goodsList, setGoodsList] = useState<any[]>([]);
    const [timUser, setTimUser] = useState<any>();
    const [goodsModalVisible, setGoodsModalVisible] = useState<boolean>();
    const [upGoods, setUpGoods] = useState<any>();
    const [upGoodsAnimation, setUpGoodsAnimation] = useState<any>();
    const refreshInfoTimer = useRef<any>();
    const {params} = useRouter();
    const speekInputRef = useRef<InputProps>();


    const refreshLiveGoods = (ids: string) => {
        if(ids) {
            request.get("wxapp/tim/goods/" + ids, SERVICE_WINKT_LIVE_HEADER, null, true).then(res => {
                let goodsList = res.data.data;
                setGoodsList(goodsList);
                let animation = Taro.createAnimation({timingFunction: 'ease-in-out'});
                if(_.findIndex(goodsList, {isUp: true}) >= 0) {
                    //如果有解说中的商品则弹窗
                    animation.height(Taro.pxTransform(0)).step();
                    setUpGoodsAnimation(animation.export());
                    setTimeout(()=>{
                        setUpGoods(goodsList[_.findIndex(goodsList, {isUp:true})]);
                        animation.height(Taro.pxTransform(98)).step();
                        setUpGoodsAnimation(animation.export());
                    },400);
                }
                else {
                    animation.height(Taro.pxTransform(0)).step();
                    setUpGoodsAnimation(animation.export());
                    setTimeout(()=>{
                        setUpGoods(null);
                    }, 400);
                }
            });
        }
    }

    const getCustomField = (groupInfo:{groupCustomField: any[]}, key:string) => {
        for (let i = 0; i < groupInfo.groupCustomField.length; i++) {
            let entry = groupInfo.groupCustomField[i];
            // @ts-ignore
            if(entry.key == key) {
                // @ts-ignore
                return entry.value;
            }
        }
        return null;
    }

    const refreshInfo = () => {
        refreshInfoTimer.current = setInterval(()=>{
            request.get("wxapp/lives/" + params.id, SERVICE_WINKT_LIVE_HEADER, null, false).then(res => {
                let detail = res.data.data;
                if(detail.liveStatus == 0) {
                    Taro.showModal({showCancel: false, title: '温馨提醒', content: '直播已经结束'}).then(res=>{
                        if(res.confirm) {
                            Taro.navigateBack().then();
                        }
                    });
                }
                setLiveDetail(detail);
            });
        }, 3000);
    }

    useEffect(() => {
        let _tls;
        Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: '#000000'}).then();
        if (params.id) {
            request.get("wxapp/lives/" + params.id, SERVICE_WINKT_LIVE_HEADER, null, false).then(res => {
                let detail = res.data.data;
                setLiveDetail(detail);
                refreshInfo();
                request.get("wxapp/tim/whoim", SERVICE_WINKT_LIVE_HEADER, {history_id: detail.id}, true).then(res => {
                    let user = res.data.data;
                    setTimUser(user);
                    _tls = TencentIM.newInstance(user.userId, user.userSig);
                    _tls.on(TLS.EVENT.SDK_READY, async () => {
                        //加入群组
                        _tls.joinRoom({getOwnerInfo: true, roomID: detail.room.groupId}).then(res => {
                            setTls(_tls);
                            console.log("进入直播间成功", res);
                            let groupInfo = res.groupInfo;
                            let userInfo = res?.userInfo;
                            let add_goods = getCustomField(groupInfo, 'ADD_GOODS');
                            refreshLiveGoods(add_goods);
                            if(userInfo.nick == '') {
                                userInfo.nick = user.nick;
                                userInfo.avatar = user.avatar;
                            }
                            //发送群公告
                            if (detail.room.notification) {
                                let msg: TimMessage = {
                                    message: detail.room.notification,
                                    nick: '直播间公告',
                                    avatar: undefined,
                                    type: TLS.EVENT.MESSAGE
                                };
                                pushMessage(msg);
                            }
                        });
                    });
                    _tls.on(TLS.EVENT.MESSAGE, async (data) => {
                        console.log("接收到消息", data);
                        if (data.message) {
                            pushMessage(data);
                        }
                    });
                    _tls.on(TLS.EVENT.ROOM_STATUS_CHANGE, async (data) => {
                        console.log('房间状态发生变化', data);
                        if(data == "0") {
                            //直播结束
                            Taro.showModal({title: '温馨提示', content: '直播已结束，点击确定退出', showCancel: false}).then(res=>{
                                if(res.confirm) {
                                    Taro.navigateBack().then();
                                }
                            })
                        }
                    });
                    _tls.on(TLS.EVENT.JOIN_GROUP, async (data) => {
                        console.log("有人加入了群聊", data);
                        data.type = TLS.EVENT.JOIN_GROUP;
                        pushMessage(data);
                    });
                    _tls.on(TLS.EVENT.EXIT_GROUP, async (data) => {
                        console.log("有人退出了群聊", data);
                    });
                    _tls.on(TLS.EVENT.NOTIFACATION, async (data) => {
                        console.log("直播间公告发生了变化！", data);
                        let msg: TimMessage = {
                            message: data.notification,
                            nick: '直播间公告',
                            avatar: undefined,
                            type: TLS.EVENT.MESSAGE
                        };
                        pushMessage(msg);
                    });
                    _tls.on(TLS.EVENT.SDK_NOT_READY, async () => {
                        console.log('直播间不可用');
                        setTls(null);
                    });
                    _tls.on(TLS.EVENT.LIKE, async (data) => {
                        console.log("有人给主播点赞了", data);
                        data.type = TLS.EVENT.LIKE;
                        pushNotice(data);
                    });
                    _tls.on(TLS.EVENT.ADD_GOODS, async(data) => {
                        console.log('商品列表发生变化', data);
                        refreshLiveGoods(data.value);
                    })
                })
            })
        }
        return () => {
            if (_tls) {
                _tls.destroy();
            }
            if(refreshInfoTimer) {
                clearInterval(refreshInfoTimer.current);
            }
        }
    }, [params]);


    const roomButton = (
        <TransparentTag style={{position: 'relative'}}>
            <View className={'flex align-center text-white'} style={{zIndex: 999, position: 'relative'}}>
                {liveDetail &&
                    <View className="cu-avatar round"
                          style={{backgroundImage: 'url(' + liveDetail?.room.memberAvatar + ')'}}/>
                }
                <Text style={{fontWeight: 'normal'}} className={'margin-left-xs'}>{liveDetail?.room.name}</Text>
                <Text style={{fontWeight: 'bold'}} className='cuIcon-close text-lg margin-right-xs text-bold'
                      onClick={() => Taro.navigateBack().then()}/>
            </View>
        </TransparentTag>
    );

    const sendMessage = async (e) => {
        if (!tls) {
            return Taro.showToast({title: '组件尚未初始化，请稍后再试!', icon: 'none'}).then();
        }
        console.log('当前用户是', timUser);
        let msg = e.detail.value;
        if (!msg) return;
        const res = await tls.sendMessage(msg);
        res.type = TLS.EVENT.MESSAGE;
        pushMessage(res);
        speekInputRef.current!.value = '';
    }

    //推入弹幕区, 自动控制缓冲区大小
    const pushMessage = (msg: TimMessage) => {
        msg.time = moment().valueOf();
        messages.push(msg);
        if (messages.length > MESSAGE_CACHE_SIZE) {
            messages.splice(0, messages.length - MESSAGE_CACHE_SIZE);
        }
        setMessages([...messages]);
    }

    const pushNotice = (msg: TimMessage) => {
        let animation = Taro.createAnimation({timingFunction: 'ease-in-out'});
        msg.animation = animation;
        msg.time = moment().valueOf();
        notices.push(msg);
        if (notices.length > NOTICE_CACHE_SIZE) {
            notices.splice(0, notices.length - NOTICE_CACHE_SIZE);
        }
        console.log('notices is', notices);
        setNotices([...notices]);
        setTimeout(() => {
            animation.top(-80).opacity(0).step();
            setNotices([...notices]);
        }, 300);
    }

    const toggleZan = () => {
        request.put("wxapp/lives/" + liveDetail?.id + "/toggle_like", SERVICE_WINKT_LIVE_HEADER, "true", true).then(() => {
            setIsZan(true);
            if (tls) {
                tls.like(TLS.EVENT.LIKE);
            }
        })
    }

    const addCart = (item:any) => {
        //加入直播间商品到商城购物车
        Taro.showLoading({title: '数据获取中...'}).then();
        request.get(API_SHOP_GOODS_INFO+"/"+item.goodsId, SERVICE_WINKT_SYSTEM_HEADER, null, false).then(res=>{
            addShopCart(res.data.data);
        });
    }
    const openShopCart = () => {
        Taro.navigateTo({url: '/shop/pages/cart'}).then();
    }
    return (
        <PageLayout showStatusBar={true} showTabBar={false}
                    statusBarProps={{
                        title: '',
                        bgColor: 'transparent',
                        titleCenter: false,
                        position: 'fixed',
                        button: roomButton
                    }}>

            {liveDetail &&
                <LivePlayer
                    src={liveDetail.directorPlayAddress ? liveDetail.directorPlayAddress : liveDetail.rtmpPlayAddress}
                    autoplay={true}
                    orientation='horizontal'
                    objectFit={liveDetail.objectFit}
                    style={{width: '100vw', height: '100vh', left: 0, top:0, position: 'absolute', zIndex: 1}}
                />
            }
            <View className={'padding-left-sm padding-right-sm flex flex-direction justify-end'} style={{
                width: '100vw',
                height: '100vh',
                boxSizing: 'border-box',
                paddingTop: headerHeight,
                position: 'absolute',
                background: 'transparent',
                top: 0,
                left: 0,
                zIndex: 99,
            }}>
                <View className={'flex justify-between padding-sm'}
                           style={{position: 'absolute', top: headerHeight, left: '0', width: '100%'}}>
                    <TransparentTag padding='16rpx 20rpx'>
                        <Text>本场点赞数{liveDetail?.likeCount}</Text>
                    </TransparentTag>
                    <TransparentTag padding='16rpx 20rpx'>
                        <Text>{liveDetail?.memberCount}人在看</Text>
                    </TransparentTag>
                </View>

                <View className={'text-center'}
                           style={{position: 'absolute', top: headerHeight + 100, width: '100%', overflow: 'visible'}}>
                    {notices.map((item) => {
                        let TagContent = (
                            <View>
                                {item.avatar &&
                                    <Text className="cu-avatar round sm margin-right-xs"
                                          style={{backgroundImage: 'url(' + item.avatar + ')'}}/>
                                }
                                <Text><Text className={'text-cyan'}>{item.nick ? item.nick : item.userID}</Text>送了一个大大的赞</Text>
                            </View>
                        );
                        //动画
                        return (
                            <TransparentTag key={'notices_' + item.time} animation={item.animation.export()}
                                            padding={'10rpx'} style={{
                                borderRadius: '35rpx',
                                position: 'absolute',
                                top: 0,
                                left: '50%',
                                transform: 'translateX(-50%)'
                            }}>
                                {TagContent}
                            </TransparentTag>
                        );
                    })}
                </View>
                {/*滚动弹幕层*/}
                <ScrollView scrollWithAnimation scrollIntoView={`messages_${messages[messages.length - 1]?.time}`}
                            scrollY
                            style={{width: '50%', height: Taro.pxTransform(170)}}>
                    {messages.map((item) => {
                        let TagContent = (
                            <View>
                                {item.avatar &&
                                    <Text className="cu-avatar round sm margin-right-xs"
                                          style={{backgroundImage: 'url(' + item.avatar + ')'}}/>
                                }
                                <Text><Text
                                    className={'text-cyan'}>{item.nick ? item.nick : item.userID}</Text>：{item.message}
                                </Text>
                            </View>
                        );
                        if (item.type == TLS.EVENT.MESSAGE) {
                            TagContent = (
                                <View>
                                    {item.avatar &&
                                        <Text className="cu-avatar round sm margin-right-xs"
                                              style={{backgroundImage: 'url(' + item.avatar + ')'}}/>
                                    }
                                    <Text><Text
                                        className={'text-cyan'}>{item.nick ? item.nick : item.userID}</Text>：{item.message}
                                    </Text>
                                </View>
                            );
                        } else if (item.type == TLS.EVENT.JOIN_GROUP) {
                            TagContent = (
                                <View>
                                    {item.avatar &&
                                        <Text className="cu-avatar round sm margin-right-xs"
                                              style={{backgroundImage: 'url(' + item.avatar + ')'}}/>
                                    }
                                    <Text className={'text-orange'}><Text
                                        className={'text-cyan'}>{item.nick ? item.nick : item.userID}</Text>：已加入直播间
                                    </Text>
                                </View>
                            );
                        }
                        return (
                            <TransparentTag key={'messages_' + item.time} id={'messages_' + item.time} padding={'10rpx'}
                                            className={'margin-bottom-sm'}
                                            style={{borderRadius: '35rpx', display: 'block'}}>
                                {TagContent}
                            </TransparentTag>
                        );
                    })}
                </ScrollView>
                {upGoods &&
                    <View animation={upGoodsAnimation} className={'cu-list menu-avatar radius'} style={{width: '80%', position: "relative", overflow: 'hidden', height: 0}}>
                        <View className={classNames("cu-item")} style={{height: '180rpx'}}>
                            <Navigator url={`/shop/pages/detail?id=${upGoods.goodsId}`} className="cu-avatar radius lg"
                                  style={{backgroundImage: 'url(' + resolveUrl(upGoods.goodsImage) + ')'}}/>
                            <Navigator url={`/shop/pages/detail?id=${upGoods.goodsId}`} className="content" style={{display: 'block', padding: 0}}>
                                <View className="text-black">
                                    {upGoods.goodsName}
                                </View>
                                <View className="text-sm text-left">
                                    {upGoods.siteName}
                                </View>
                                <View className='text-red text-left'>
                                    ￥{upGoods.goodsPrice}
                                </View>
                            </Navigator>
                            <View className="action margin-right-sm" style={{textAlign: 'right', fontSize: Taro.pxTransform(24)}}>
                                <Text className={'cuIcon-cart text-red'} onClick={()=>addCart(upGoods)} />
                            </View>
                        </View>
                        <View className={'sanjiao-down-white'} style={{marginLeft: Taro.pxTransform(10)}} />
                    </View>
                }
                <View className={'cu-bar tabbar'} style={{width: '100%'}}>
                    <View className={'flex justify-start align-center'} style={{width: '100%'}}>
                        <Image onClick={() => {
                            if (goodsList.length > 0) {
                                setGoodsModalVisible(true)
                            }
                        }} className={classNames('margin-right-sm', goodsList.length == 0 ? 'filter-gray' : '')}
                               src={'../../assets/images/shangpin.png'}
                               style={{width: Taro.pxTransform(36), height: Taro.pxTransform(36)}}/>
                        <TransparentTag className={'flex-sub'} padding='10rpx 20rpx'>
                            <Input style={{width: '100%'}} ref={speekInputRef} onConfirm={sendMessage}
                                   placeholder={'我想问主播...'} placeholderStyle='color: white' confirmType={'send'}/>
                        </TransparentTag>
                        {!isZan &&
                            <Image onClick={toggleZan} className={'margin-left-sm'}
                                   src={'../../assets/images/aixin-no.png'}
                                   style={{width: Taro.pxTransform(36), height: Taro.pxTransform(36)}}/>
                        }
                        {isZan &&
                            <Image onClick={toggleZan} className={'margin-left-sm'}
                                   src={'../../assets/images/aixin.png'}
                                   style={{width: Taro.pxTransform(36), height: Taro.pxTransform(36)}}/>
                        }
                        <Image onClick={openShopCart} className={'margin-left-sm'}
                               src={'../../assets/images/cart.png'}
                               style={{width: Taro.pxTransform(36), height: Taro.pxTransform(36)}}/>
                    </View>
                </View>
            </View>
            <Modal visible={goodsModalVisible} height={350} onClose={() => {
                setGoodsModalVisible(false);
            }}>
                <View className={'text-center text-black text-bold'}>本场推荐商品</View>

                <View className={'cu-list menu-avatar padding'}
                      style={{width: '100%', height: Taro.pxTransform(280), overflowY: 'scroll'}}>
                    {goodsList.map((item) => {
                        return (
                            <View className={classNames("cu-item")} style={{height: '180rpx'}}>
                                <Navigator url={`/shop/pages/detail?id=${item.goodsId}`} className="cu-avatar radius lg"
                                      style={{backgroundImage: 'url(' + resolveUrl(item.goodsImage) + ')'}}/>
                                <Navigator url={`/shop/pages/detail?id=${item.goodsId}`} className="content" style={{display: 'block', padding: 0}}>
                                    <View className="text-black text-cut">
                                        {item.goodsName}
                                    </View>
                                    <View className="text-sm text-left">
                                        {item.siteName}
                                    </View>
                                    <View className='text-red text-left'>
                                        ￥{item.goodsPrice}
                                    </View>
                                </Navigator>
                                <View className="action text-sm">
                                    <Button onClick={()=>addCart(item)} className={'cu-btn sm bg-orange'}>加入购物车</Button>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </Modal>
        </PageLayout>
    );
}


export default withLogin(LiveRoomPage);
