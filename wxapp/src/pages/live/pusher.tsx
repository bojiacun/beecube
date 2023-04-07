import {Component} from "react";
import Taro, {getCurrentInstance} from "@tarojs/taro";
import {connect} from "react-redux";
import request from "../../lib/request";
import {Image, Text, View, CoverView, ScrollView} from "@tarojs/components";
import './pusher.scss';
import utils from "../../lib/utils";


// @ts-ignore
@connect((state: any) => (
    {
        systemInfo: state.context.systemInfo,
        settings: state.context.settings,
        context: state.context,
        message: state.message
    }
))
export default class Index extends Component<any, any> {
    state:any = {
        isNative: true,
        roomID: null,
        roomName: null,
        liveAppID: null,
        wsServerURL: null,
        logServerURL: null,
        loginType: "1",
        token: null,
        userID: null,
        userName: null,
        userInfo: null,
        hideModal: true,
        animationData: {},
        merchandises: [
            {
                name: 'Givenchy/纪梵希高定香榭天鹅绒唇纪梵希高定香榭天鹅绒唇膏膏',
                img: '../../assets/images/m0.png',
                price: '345',
                id: 0,
                link: {
                    path: "../web/index",
                    extraDatas: {
                        url: 'https://shop-ecommerce.yunyikao.com/product.html'
                    }
                }
            },
            {
                name: 'OACH蔻驰Charlie 27 Carryal单肩斜挎手提包女包包2952过长样式挎手提包女包包2952过',
                img: '../../assets/images/m1.png',
                price: '1599',
                id: 1,
                link: {
                    path: "../assets/images/index",
                }
            },
            {
                name: 'Vero Moda2020春夏新款褶皱收腰蕾丝拼接雪纺连衣裙',
                img: '../../assets/images/m2.png',
                price: '749',
                id: 2,
            },
            {
                name: 'OACH蔻驰Charlie 27 Carryal单肩斜挎手提包女包包2952过长样式挎手提包女包包2952过',
                img: '../../assets/images/m1.png',
                price: '1599',
                id: 3,
                link: {
                    path: "../assets/images/index",
                }
            },
            {
                name: 'Vero Moda2020春夏新款褶皱收腰蕾丝拼接雪纺连衣裙',
                img: '../../assets/images/m2.png',
                price: '749',
                id: 4,
            },
        ],
        pushIndex: -1,
        merBot: 0,
    }

    options: any;
    liveRoom: any;
    animation: any;
    merT: any;

    constructor(props) {
        super(props);
        this.hideModal = this.hideModal.bind(this);
        this.clickMech = this.clickMech.bind(this);
        this.pushMer = this.pushMer.bind(this);
        this.addShoppingCart= this.addShoppingCart.bind(this);
        this.clickPush = this.clickPush.bind(this);
        this.fadeIn = this.fadeIn.bind(this);
        this.fadeDown = this.fadeDown.bind(this);
        this.showModal = this.showModal.bind(this);
        this.onRoomEvent = this.onRoomEvent.bind(this);
        // this.startPushStream = this.startPushStream.bind(this);
        // this.onStreamUrlUpdate = this.onStreamUrlUpdate.bind(this);
    }

    async componentDidUpdate(prevProps: Readonly<any>, prevState) {
        const {userInfo} = this.props.context;
        const {settings} = this.props;
        const options = this.options;
        const {page} = getCurrentInstance();
        if(!this.liveRoom) {
            // @ts-ignore
            this.liveRoom = page?.selectComponent('#live-room');
        }
        if(settings && userInfo && !this.state.roomID) {
            this.setState({
                roomID: options.roomId,
                roomName: options.roomName,
                loginType: options.loginType,
                liveAppID: settings.zegoAppId,
                wsServerURL: settings.zegoServerAddress,
                logServerURL: settings.zegoLogUrl,
                userID: userInfo.id,
                userName: userInfo.nickname,
                userInfo: userInfo
            });
            setTimeout(async ()=>{
                this.liveRoom.init();
                const result = await request.put('/paimai/api/live/login', userInfo);
                const token = result.data.result;
                this.setState({token: token});
            }, 200);

        }

    }

    onRoomEvent(ev) {
        console.log('onRoomEvent', ev);
        let { tag, content } = ev.detail;
        switch (tag) {
            case 'onMerchandise': {
                console.log('onMerchandise', content);
                this.showModal();
                break;
            }
            case 'onBack': {
                console.log('onBack', content);
                Taro.navigateBack().then();
                break;
            }
            case 'onModalClick': {
                console.log('onModalClick', content);
                if (!this.state.hideModal) {
                    this.hideModal();
                }
                break;
            }
            case 'onRecvMer': {
                console.log('onRecvMer', content);
                const {indx, merTime, merBot} = content;
                this.merT && clearTimeout(this.merT);
                this.setState({
                    pushIndex: indx,
                    merBot: merBot
                });
                this.merT = setTimeout(() => {
                    this.setState({
                        pushIndex: -1,
                        merBot: merBot
                    });
                    clearTimeout(this.merT);
                    this.merT = null;
                }, merTime * 1000);
                break;
            }
            case 'onPushMerSuc': {
                console.log('onPushMerSuc', content);
                Taro.showToast({
                    title: '商品推送成功',
                    icon: 'none'
                }).then();
            }
            default: {
                // console.log('onRoomEvent default: ', e);
                break;
            }
        }
    }

    showModal() {
        this.setState({
            hideModal: false
        });
        this.animation = Taro.createAnimation({
            duration: 150, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快
            timingFunction: 'linear', //动画的效果 默认值是linear
        });
        setTimeout(() => {
            this.fadeIn(); //调用显示动画
        }, 10);
    }
    hideModal() {
        this.setState({hideModal: true});
        this.fadeDown();
    }
    clickMech(e) {
        const mer = this.state.merchandises.find(item => item.id == e.currentTarget.id)
        if (!mer || !mer.link) return;
        const link = mer.link;

        if (link) {
            Taro.navigateTo({
                url: link,
            }).then();
        }
    }
    pushMer(e) {
        const {currentTarget:{dataset:{indx}}} = e;
        console.log(indx);
        this.liveRoom.pushMer(indx);
    }
    addShoppingCart(e) {
        const {currentTarget:{dataset:{indx}}} = e;
        console.log('addShoppingCart ', indx);
    }
    clickPush() {
        console.log(this.state.pushIndex);
        const mer = this.state.merchandises.find(item => item.id == this.state.pushIndex)
        if (!mer || !mer.link) return;
        const link = mer.link;
        Taro.navigateTo({
            url: link,
        }).then();
    }
    fadeIn() {
        this.animation.translateY(0).step()
        this.setState({
            animationData: this.animation.export() //动画实例的export方法导出动画数据传递给组件的animation属性
        })
    }
    fadeDown() {
        this.animation.translateY(450).step()
        this.setState({
            animationData: this.animation.export(),
        })
    }

    onStreamUrlUpdate(streamId, url, type) {
        console.log(streamId, url, type);
        this.setState({pushUrl: url});
    }
    // async startPushStream() {
    //     zg.startPublishingStream(this.streamId);
    // }
    //
    onLoad(options) {
        this.options = options;
    }
    //
    // componentWillUnmount() {
    //     zg.stopPublishingStream(this.streamId);
    //     zg.release();
    //     zg.logout();
    // }

    render() {
        const {
            roomID,
            liveAppID,
            wsServerURL,
            logServerURL,
            loginType,
            token,
            userID,
            hideModal,
            animationData,
            merchandises,
            pushIndex,
            merBot,
        } = this.state;
        const {systemInfo} = this.props;
        const barTop = systemInfo.statusBarHeight;

        // @ts-ignore
        return (
            <View className={'live-container'}>
                <live
                    id={'live-room'}
                    liveAppID={liveAppID}
                    roomID={roomID}
                    wsServerURL={wsServerURL}
                    logServerURL={logServerURL}
                    loginType={loginType}
                    token={token}
                    userID={userID}
                    navBarHeight={barTop}
                    onRoomEvent={this.onRoomEvent}
                    bindRoomEvent
                />
                <CoverView className="modals modals-bottom-dialog" hidden={hideModal}>
                    <View className="bottom-dialog-body bottom-pos" animation={animationData}>
                        <View className="merchandise-container">
                            <View className="merchandise-head">
                                <View className="m-t">
                                    <Image className="m-list-png" src="../../assets/images/m-list.png"></Image>
                                    <View className="m-title">商品列表</View>
                                </View>
                                <Image className="m-close-png" src="../../assets/images/m-close.png" onClick={this.hideModal}></Image>
                            </View>
                            <ScrollView className="merchandise-list" showScrollbar={false} scrollY={true} scrollX={false} type={'list'}>
                                {merchandises.map((item,index)=>{
                                    return (
                                        <View key={item.id} className="merchandise-item">
                                            <Image className="" src={utils.resolveUrl(item.img)}></Image>
                                            <View className="merchandise-detail">
                                                <Text className={'merchandise-text'} id={index} onClick={this.clickMech}>
                                                    {item.name}
                                                </Text>
                                                <View className="merchandise-action">
                                                    <Text className="m-price">¥{item.price}</Text>
                                                    {loginType === 'anchor' &&
                                                        <View data-indx={item.id} className="shop-cart"
                                                              onClick={this.pushMer}>
                                                            推送商品
                                                        </View>
                                                    }
                                                    {loginType === 'audience' &&
                                                        <View data-indx={item.id} className="shop-cart"
                                                              onClick={this.addShoppingCart}>
                                                            加入购物车
                                                        </View>
                                                    }
                                                </View>
                                            </View>
                                        </View>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    </View>
                </CoverView>
                {pushIndex >= 0 &&
                    <View className="push-mer" style={{bottom:merBot}} onClick={this.clickPush}>
                        <Image className="push-mer-img" src={merchandises[pushIndex].img}></Image>
                        <View className="push-mer-detail">
                            <Text className="push-mer-text">{merchandises[pushIndex].name}</Text>
                            <Text className="push-mer-price">¥{merchandises[pushIndex].price}</Text>
                        </View>
                    </View>
                }
            </View>
        );
    }
}
