import {Component} from "react";
import {getCurrentInstance} from "@tarojs/taro";
import {connect} from "react-redux";
import request from "../../lib/request";
import { View, Image, Text } from "@tarojs/components";
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
        animationData: null,
        merchandises: [],
        pushIndex: -1,
        merBot: 0,
    }

    options: any;
    liveRoom: any;

    constructor(props) {
        super(props);
        this.hideModal = this.hideModal.bind(this);
        this.clickMech = this.clickMech.bind(this);
        this.pushMer = this.pushMer.bind(this);
        this.addShoppingCart= this.addShoppingCart.bind(this);
        this.clickPush = this.clickPush.bind(this);
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

    hideModal() {
        this.setState({hideModal: true});
    }
    clickMech() {

    }
    pushMer() {

    }
    addShoppingCart() {

    }
    clickPush() {

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
            roomName,
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
                <zego-nav navBarHeight={systemInfo.navBarHeight} statusBarHeight={barTop}>
                    <View className="room-title">{roomName}</View>
                </zego-nav>
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
                />
                <View className="modals modals-bottom-dialog" hidden={hideModal}>
                    <View className="bottom-dialog-body bottom-pos" animation={animationData}>
                        <View className="merchandise-container">
                            <View className="merchandise-head">
                                <View className="m-t">
                                    <Image className="m-list-png" src="../../assets/m-list.png"></Image>
                                    <View className="m-title">商品列表</View>
                                </View>
                                <Image className="m-close-png" src="../../resource/m-close.png" onClick={this.hideModal}></Image>
                            </View>
                            <View className="merchandise-list">
                                {merchandises.map(item=>{
                                    return (
                                        <View key={item.id} className="merchandise-item">
                                            <Image className="" src={utils.resolveUrl(item.img)}></Image>
                                            <View className="merchandise-detail">
                                                <Text className="merchandise-text" id="{{index}}" onClick={this.clickMech}>
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
                            </View>
                        </View>
                    </View>
                </View>
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
