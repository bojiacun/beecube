import Taro, {useRouter} from "@tarojs/taro";
import PageLayout from "../../layouts/PageLayout";
import {View, LivePusher, Text, ScrollView, Navigator, Image, Button} from "@tarojs/components";
import {useEffect, useRef, useState} from "react";
import request, {resolveUrl, SERVICE_WINKT_LIVE_HEADER} from "../../utils/request";
import TencentIM, {TimMessage} from "../../utils/tim";
import TLS from "im-live-sells";
import _ from "lodash";
import moment from "moment";
import TransparentTag from "../../components/TransparentTag";
import classNames from "classnames";
import Modal from "../../components/modal/modal";
import withLogin from "../../components/login/login";
import IconFont from "../../components/iconfont/index.weapp";
import TIMLiveShell from "im-live-sells";

const MESSAGE_CACHE_SIZE = 8;
const NOTICE_CACHE_SIZE = 8;

const LivePushPage = (props) => {
    const {context} = props;
    const {headerHeight} = context;
    const [liveDetail, setLiveDetail] = useState<any>();
    const [isRemoteMirror, setIsRemoteMirror] = useState<boolean>(false);
    const [isLocalMirror, setIsLocalMirror] = useState<any>(undefined);
    const [timUser, setTimUser] = useState<any>();
    const [messages, setMessages] = useState<TimMessage[]>([]);
    const [notices, setNotices] = useState<TimMessage[]>([]);
    const [goodsList, setGoodsList] = useState<any[]>([]);
    const [goodsModalVisible, setGoodsModalVisible] = useState<boolean>();
    const [upGoods, setUpGoods] = useState<any>();
    const [upGoodsAnimation, setUpGoodsAnimation] = useState<any>();
    const [livePushContext, setLivePushContext] = useState<any>();
    const [livePushing, setLivePushing] = useState<boolean>(true);
    const [muted, setMuted] = useState<boolean>(false);
    const [tls, setTls] = useState<TIMLiveShell>();
    const {params} = useRouter();
    const refreshInfoTimer = useRef<any>();

    const getCustomField = (groupInfo: { groupCustomField: any[] }, key: string) => {
        for (let i = 0; i < groupInfo.groupCustomField.length; i++) {
            let entry = groupInfo.groupCustomField[i];
            // @ts-ignore
            if (entry.key == key) {
                // @ts-ignore
                return entry.value;
            }
        }
        return null;
    }
    const refreshLiveGoods = (ids: string) => {
        if (ids) {
            request.get("wxapp/tim/goods/" + ids, SERVICE_WINKT_LIVE_HEADER, null, true).then(res => {
                let goodsList = res.data.data;
                setGoodsList(goodsList);
                let animation = Taro.createAnimation({timingFunction: 'ease-in-out'});
                if (_.findIndex(goodsList, {isUp: true}) >= 0) {
                    //如果有解说中的商品则弹窗
                    animation.height(Taro.pxTransform(0)).step();
                    setUpGoodsAnimation(animation.export());
                    setTimeout(() => {
                        setUpGoods(goodsList[_.findIndex(goodsList, {isUp: true})]);
                        animation.height(Taro.pxTransform(78)).step();
                        setUpGoodsAnimation(animation.export());
                    }, 400);
                } else {
                    animation.height(Taro.pxTransform(0)).step();
                    setUpGoodsAnimation(animation.export());
                    setTimeout(() => {
                        setUpGoods(null);
                    }, 400);
                }
            });
        }
    }
    const refreshInfo = () => {
        refreshInfoTimer.current = setInterval(()=>{
            request.get("wxapp/lives/" + params.id, SERVICE_WINKT_LIVE_HEADER, null, false).then(res => {
                let detail = res.data.data;
                setLiveDetail(detail);
            });
        }, 3000);
    }
    //推入弹幕区, 自动控制缓冲区大小
    const pushMessage = (msg: TimMessage) => {
        console.log(timUser);
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

    const toggleRemoteMirror = () => {
        setIsRemoteMirror(!isRemoteMirror);
    }
    const toggleLocalMirror = () => {
        setIsLocalMirror(!isLocalMirror);
    }

    useEffect(() => {
        let _tls;
        Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: '#000000'}).then();
        if (params.id) {
            request.get("wxapp/manager/live/histories/" + params.id, SERVICE_WINKT_LIVE_HEADER, null, true).then(res => {
                let detail = res.data.data;
                setLiveDetail(detail);
                setLivePushContext(Taro.createLivePusherContext());
                refreshInfo();
                request.get("wxapp/tim/whoim", SERVICE_WINKT_LIVE_HEADER, {history_id: detail.id}, true).then(res => {
                    let user = res.data.data;
                    setTimUser(user);
                    _tls = TencentIM.newInstance(user.userId, user.userSig);
                    setTls(_tls);
                    _tls.on(TLS.EVENT.SDK_READY, async () => {
                        //加入群组
                        _tls.joinRoom({getOwnerInfo: true, roomID: detail.room.groupId}).then(res => {
                            console.log("进入直播间成功", res);
                            let groupInfo = res.groupInfo;
                            let add_goods = getCustomField(groupInfo, 'ADD_GOODS');
                            refreshLiveGoods(add_goods);
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
                        setTls(tls);
                        console.log('直播间不可用');
                    });
                    _tls.on(TLS.EVENT.LIKE, async (data) => {
                        console.log("有人给主播点赞了", data);
                        data.type = TLS.EVENT.LIKE;
                        pushNotice(data);
                    });
                    _tls.on(TLS.EVENT.ADD_GOODS, async (data) => {
                        console.log('商品列表发生变化', data);
                        refreshLiveGoods(data.value);
                    })
                })
            });
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
    const refreshGoods = () => {
        if (params.id) {
            request.get("wxapp/manager/live/histories/" + params.id + "/goods", SERVICE_WINKT_LIVE_HEADER, null, true).then(res => {
                setGoodsList(res.data.data);
            })
        }
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
            setGoodsModalVisible(false);
            refreshGoods();
            Taro.hideLoading();
        }).catch(() => Taro.hideLoading());
    }
    const roomButton = (<View className='flex round bg-white align-center'
                              style={{left: '2%', position: 'absolute', padding: Taro.pxTransform(3)}}>
        <View className="cu-avatar round sm"
              style={{backgroundImage: 'url(' + resolveUrl(liveDetail?.room.memberAvatar) + ')'}}/>
        <Text style={{fontWeight: 'normal'}} className={'margin-left-xs'}>{liveDetail?.room.name}</Text>
        <Text style={{fontWeight: 'bold'}} className='cuIcon-close text-lg margin-right-xs text-bold'
              onClick={() => Taro.navigateBack().then()}/>
    </View>);

    const toggleMuted = () => {
        if (livePushContext) {
            if (!muted) {
                livePushContext.setMICVolume({volume: 0});
                setMuted(true);
            } else {
                livePushContext.setMICVolume({volume: 1});
                setMuted(false);
            }
        } else {
            Taro.showToast({title: '初始化视频推送失败', icon: 'none'}).then();
        }
    }

    const toggleLivePushing = () => {
        if (livePushContext) {
            if (!livePushing) {
                livePushContext.resume();
                setLivePushing(true);
            } else {
                livePushContext.pause();
                setLivePushing(false);
            }
        } else {
            Taro.showToast({title: '初始化视频推送失败', icon: 'none'}).then();
        }
    }
    const reverseCamera = () => {
        if (livePushContext) {
            livePushContext.switchCamera();
        } else {
            Taro.showToast({title: '初始化视频推送失败', icon: 'none'}).then();
        }
    }

    const stopLive = () => {
        Taro.showModal({title: '温馨提示', content: '您确定要停止直播吗，停止后不可恢复！'}).then(res => {
            if (res.confirm) {
                Taro.showLoading({title: '停止中...'}).then();
                //结束直播
                request.put("wxapp/manager/live/histories/" + params.id + '/stop', SERVICE_WINKT_LIVE_HEADER, null, true).then(() => {
                    if (livePushContext) {
                        livePushContext.stop();
                        tls?.sendCustomMsgAndEmitEvent("ROOM_STATUS_CHANGE", "0");
                        Taro.navigateBack().then();
                    } else {
                        Taro.showToast({title: '初始化视频推送失败', icon: 'none'}).then();
                    }
                    Taro.hideLoading();
                }).catch(() => Taro.hideLoading());
            }
        });
    }

    return (
        <PageLayout showTabBar={false} showStatusBar={true}
                    statusBarProps={{
                        bgColor: 'transparent',
                        titleCenter: false,
                        position: 'fixed',
                        button: roomButton
                    }}>
            {liveDetail && <LivePusher
                url={liveDetail?.pushAddress}
                mode={'FHD'}
                autopush={true}
                enableAgc={true}
                enableAns={true}
                waitingImage={resolveUrl(liveDetail?.banner)}
                style={{width: '100vw', height: '100vh', position: 'absolute', zIndex: 1, left: 0, top: 0}}
                beauty={9}
                whiteness={9}
                mirror={isRemoteMirror}
                remoteMirror={isRemoteMirror}
                localMirror={isLocalMirror === undefined ? 'auto' : (isLocalMirror === true ? 'enable': 'disable')}
            />}
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
                    <View animation={upGoodsAnimation} className={'cu-list menu-avatar radius'}
                          style={{width: '80%', position: "relative", overflow: 'hidden', height: 0}}>
                        <View className={classNames("cu-item")}>
                            <Navigator url={`/shop/pages/detail?id=${upGoods.goodsId}`} className="cu-avatar radius lg"
                                       style={{backgroundImage: 'url(' + resolveUrl(upGoods.goodsImage) + ')'}}/>
                            <Navigator url={`/shop/pages/detail?id=${upGoods.goodsId}`} className="content"
                                       style={{display: 'block', padding: 0}}>
                                <View className="text-black">
                                    {upGoods.goodsName}
                                </View>
                                <View className='text-red text-left'>
                                    ￥{upGoods.goodsPrice}
                                </View>
                            </Navigator>
                            <View className="action margin-right-sm" style={{textAlign: 'right'}}>
                                <Text className={'text-red'} onClick={() => downIt(upGoods)}>下架</Text>
                            </View>
                        </View>
                        <View className={'sanjiao-down-white'} style={{marginLeft: Taro.pxTransform(10)}}/>
                    </View>
                }
                <View className={'cu-bar tabbar'} style={{width: '100%', flexDirection: 'column', height: 'auto'}}>
                    <View className={'flex justify-between align-center'} style={{width: '100%'}}>
                        <Image onClick={() => {
                            if (goodsList.length > 0) {
                                setGoodsModalVisible(true)
                            }
                        }}
                               className={classNames('', goodsList.length == 0 ? 'filter-gray' : '')}
                               src={'../../assets/images/shangpin.png'
                               }
                               style={{width: Taro.pxTransform(48), height: Taro.pxTransform(48)}}
                        />
                        <View className={'text-blue round bg-white padding-sm'} onClick={toggleLivePushing}>
                            {!livePushing ? <IconFont name={'24gf-play'} color={'blue'} size={28}/> :
                                <IconFont name={'24gf-pause2'} color={'blue'} size={28}/>}
                        </View>
                        <View className={'text-blue round bg-white padding-sm'} onClick={stopLive}>
                            <IconFont name={'24gf-stop'} color={'red'} size={28}/>
                        </View>
                        <View className={'text-blue round bg-white padding-sm'} onClick={toggleMuted}>
                            {muted ? <IconFont name={'maikefeng2'} color={'blue'} size={28}/> :
                                <IconFont name={'maikefeng1'} color={'blue'} size={28}/>}
                        </View>
                        <View className={'text-blue round bg-white padding-sm'} onClick={reverseCamera}>
                            <IconFont name={'2'} color={'blue'} size={28}/>
                        </View>
                    </View>
                    <View className={'flex justify-between align-center margin-top-sm margin-bottom-sm'} style={{width: '100%'}}>
                        <View className={'text-blue round bg-white padding-sm'} onClick={toggleRemoteMirror}>
                            <IconFont name={'ziyuan'} color={'blue'} size={28}/>
                        </View>
                        <View className={'text-blue round bg-white padding-sm'} onClick={toggleLocalMirror}>
                            <IconFont name={'ziyuan'} color={'green'} size={28}/>
                        </View>
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
                            <View className={classNames("cu-item")}>
                                <Navigator url={`/shop/pages/detail?id=${item.goodsId}`} className="cu-avatar radius lg"
                                           style={{backgroundImage: 'url(' + resolveUrl(item.goodsImage) + ')'}}/>
                                <Navigator url={`/shop/pages/detail?id=${item.goodsId}`} className="content"
                                           style={{display: 'block', padding: 0}}>
                                    <View className="text-black">
                                        {item.goodsName}
                                    </View>
                                    <View className='text-red text-left'>
                                        ￥{item.goodsPrice}
                                    </View>
                                </Navigator>
                                {(!upGoods || upGoods.id != item.id) && <View className="action text-sm">
                                    <Button className={'cu-btn sm bg-orange'} onClick={() => upIt(item)}>上架</Button>
                                </View>
                                }
                            </View>
                        );
                    })}
                </View>
            </Modal>
        </PageLayout>
    );
}


export default withLogin(LivePushPage);

