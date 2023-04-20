import {Component} from "react";
import Taro, {getCurrentInstance} from "@tarojs/taro";
import {connect} from "react-redux";
import request from "../../lib/request";
import {Image, Text, View, ScrollView, Navigator} from "@tarojs/components";
import './room.scss';
import utils from "../../lib/utils";
import FallbackImage from "../../components/FallbackImage";
import MessageType from "../../utils/message-type";
import moment from "moment";

const numeral = require('numeral');

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
    state: any = {
        liveRoom: null,
        isNative: false,
        userInfo: null,
        hideModal: true,
        animationData: {},
        merchandises: [],
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
        this.addShoppingCart = this.addShoppingCart.bind(this);
        this.clickPush = this.clickPush.bind(this);
        this.fadeIn = this.fadeIn.bind(this);
        this.fadeDown = this.fadeDown.bind(this);
        this.showModal = this.showModal.bind(this);
        this.onRoomEvent = this.onRoomEvent.bind(this);
        // this.startPushStream = this.startPushStream.bind(this);
        // this.onStreamUrlUpdate = this.onStreamUrlUpdate.bind(this);
    }

    async componentDidUpdate(prevProps: Readonly<any>, prevState) {
        const {page} = getCurrentInstance();
        const {userInfo} = this.props.context;
        const {message} = this.props;
        const goodsList = this.state.merchandises;
        if (!this.liveRoom && userInfo) {
            // @ts-ignore
            this.liveRoom = page?.selectComponent('#live-room');
            this.liveRoom.init();
            this.setState({merBot: this.liveRoom.getData().meBot});
        }
        else if(this.liveRoom && message && message.id != prevProps.message.id){
            this.liveRoom.onMessageReceived(message);
        }
        if (!goodsList || !message) return;
        switch (message.type) {
            case MessageType.GOODS_UPDATE:
                goodsList?.forEach((g:any) => {
                    if (g.id == message.goodsId) {
                        g.startTime = message.startTime;
                        g.endTime = message.endTime;
                        g.actualEndTime = message.actualEndTime;
                        g.dealPrice = message.dealPrice;
                        g.state = message.state;
                    }
                });
                this.setState(this.resolveGoods(goodsList));
                break;
        }
    }

    onRoomEvent(ev) {
        console.log('onRoomEvent', ev);
        let {tag, content} = ev.detail;
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
        const {currentTarget: {dataset: {indx}}} = e;
        console.log(indx);
        this.liveRoom.pushMer(indx);
    }

    addShoppingCart(e) {
        const {currentTarget: {dataset: {indx}}} = e;
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


    // async startPushStream() {
    //     zg.startPublishingStream(this.streamId);
    // }
    //
    onLoad(options) {
        this.options = options;
        request.get('/paimai/api/live/rooms/' + options.roomId).then(res => {
            let room = res.data.result;
            this.setState({liveRoom: room});
            request.get('/paimai/api/performances/goodslist', {params: {id: room.performanceId}}).then(res => {
                let goodsList = res.data.result;
                this.setState(this.resolveGoods(goodsList));
            });
        });
    }

    resolveGoods(goodsList) {
        let currentIndex = -1;
        goodsList.forEach((item:any, index:number)=>{
            let startTime,endTime, nowTime;
            if(item.startTime) {
                startTime = moment(item.startTime);
            }
            if(item.endTime) {
                endTime = moment(item.endTime);
            }
            nowTime = moment(new Date());
            if(nowTime.isAfter(endTime)) {
                item.state = 2;
            }
            else if(item.state == 1 || nowTime.isAfter(startTime)) {
                currentIndex = index;
                item.state = 1;
            }
        });
        if(currentIndex > -1) {
            this.liveRoom?.setNewBot(this.state.merBot + 130);
        }
        else {
            this.liveRoom?.setNewBot(this.state.merBot);
        }
        return {merchandises: goodsList, pushIndex: currentIndex};
    }

    //
    // componentWillUnmount() {
    //     zg.stopPublishingStream(this.streamId);
    //     zg.release();
    //     zg.logout();
    // }

    render() {
        const {
            liveRoom,
            hideModal,
            animationData,
            merchandises,
            pushIndex,
            merBot,
        } = this.state;
        const {systemInfo, context} = this.props;
        const barTop = systemInfo.statusBarHeight;
        let rect = Taro.getMenuButtonBoundingClientRect();
        let gap = rect.top - systemInfo.statusBarHeight; //动态计算每台手机状态栏到胶囊按钮间距
        let navBarHeight = gap + rect.bottom;
        // @ts-ignore
        return (
            <>
                <zego-nav navBarHeight={navBarHeight} statusBarHeight={barTop}>
                    <view className="room-title">{liveRoom?.title}</view>
                </zego-nav>
                <View className={'live-container'}>
                    <live
                        id={'live-room'}
                        isNative={false}
                        liveRoom={liveRoom}
                        streams={liveRoom?.streams || []}
                        isImReady={context.isImReady}
                        navBarHeight={barTop}
                        onRoomEvent={this.onRoomEvent}
                        bindRoomEvent
                    />
                    <View className="modals modals-bottom-dialog" hidden={hideModal}>
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
                                    {merchandises.map((item) => {
                                        return (
                                            <Navigator url={'/pages/goods/detail?id=' + item.id}
                                                       className={'bg-white flex items-center shadow-outer rounded-lg overflow-hidden'}>
                                                <View className={'relative w-28 h-28'}>
                                                    <FallbackImage
                                                        mode={'aspectFill'}
                                                        className={'block w-full h-full'}
                                                        src={utils.resolveUrl(item.images.split(',')[0])}
                                                    />
                                                </View>
                                                <View className={'p-2 space-y-4 flex-1'}>
                                                    <View className={'text-gray-600 text-lg'}>LOT{item.sortNum} {item.title}</View>
                                                    {item.state < 3 &&
                                                        <View className={'text-sm'}>
                                                            <View className={'space-x-1'}>
                                                                估价 <Text className={'text-red-500'}>RMB</Text>
                                                                <Text className={'text-base font-bold'}>{item.evaluatePrice}</Text>
                                                            </View>
                                                            <View>
                                                                当前价 <Text className={'text-red-500'}>RMB</Text> <Text
                                                                className={'text-base font-bold'}>{numeral(item.currentPrice || item.startPrice).format('0,0.00')}</Text>
                                                            </View>
                                                        </View>
                                                    }
                                                    {item.state == 3 &&
                                                        <View className={'text-sm'}>
                                                            落槌价 <Text className={'text-red-500'}>RMB</Text> <Text
                                                            className={'text-base font-bold'}>{numeral(item.dealPrice).format('0,0.00')}</Text>
                                                        </View>
                                                    }
                                                    {item.state == 4 &&
                                                        <View className={'text-sm'}>
                                                            流拍
                                                        </View>
                                                    }
                                                </View>
                                                <View className={'flex items-center justify-center pr-4'}>
                                                    {item.state == 1 && <Text className={'text-indigo-600 font-bold'}>进行中</Text>}
                                                    {item.state == 0 && <Text className={'text-gray-600'}>未开始</Text>}
                                                    {item.state == 2 && <Text className={'text-gray-600'}>已结束</Text>}
                                                    {item.state == 3 && <Text className={'text-green-600 font-bold'}>成交</Text>}
                                                    {item.state == 4 && <Text className={'text-gray-600'}>流拍</Text>}
                                                </View>
                                            </Navigator>
                                        );
                                    })}
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                    {pushIndex >= 0 &&
                        <View className="push-mer" style={{bottom: merBot+'rpx'}} onClick={this.clickPush}>
                            <Image className="push-mer-img" src={merchandises[pushIndex].images.split(',')[0]}></Image>
                            <View className="push-mer-detail">
                                <Text className="push-mer-text">{merchandises[pushIndex].title}</Text>
                                <Text className="push-mer-price">¥{merchandises[pushIndex].currentPrice || merchandises[pushIndex].startPrice}</Text>
                            </View>
                        </View>
                    }
                </View>
            </>
        );
    }
}
