import React, {Component} from "react";
import Taro, {getCurrentInstance} from "@tarojs/taro";
import {connect} from "react-redux";
import request from "../../lib/request";
import {Image, Text, View, ScrollView, Navigator, Button, Input} from "@tarojs/components";
import './room.scss';
import utils from "../../lib/utils";
import FallbackImage from "../../components/FallbackImage";
import MessageType from "../../utils/message-type";
import EventBus from '../../utils/event-bus';
import EventType from '../../utils/event-type';
import classNames from "classnames";
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
        animationOfferData: {},
        merchandises: [],
        pushIndex: -1,
        customGoods: null,
        merBot: 0,
        newBot: 0,
        preOffered: false,
        offers: [],
        deposited: undefined,
        nextPrice: null,
        playError: false,
    }

    options: any;
    liveRoom: any;
    animation: any;
    animationOffer: any;
    merT: any;
    offerInputRef: any;
    randomStr: string;

    constructor(props) {
        super(props);
        this.hideModal = this.hideModal.bind(this);
        this.clickMech = this.clickMech.bind(this);
        this.pushMer = this.pushMer.bind(this);
        this.addShoppingCart = this.addShoppingCart.bind(this);
        this.fadeIn = this.fadeIn.bind(this);
        this.fadeDown = this.fadeDown.bind(this);
        this.showModal = this.showModal.bind(this);
        this.onRoomEvent = this.onRoomEvent.bind(this);
        this.showOffer = this.showOffer.bind(this);
        this.hideOffer = this.hideOffer.bind(this);
        this.onMessageReceived = this.onMessageReceived.bind(this);
        this.payDeposit = this.payDeposit.bind(this);
        this.offer = this.offer.bind(this);
        this.addPrice = this.addPrice.bind(this);
        this.subPrice = this.subPrice.bind(this);
        this.onInputPriceChange = this.onInputPriceChange.bind(this);
        this.offerInputRef = React.createRef();
        this.randomStr = utils.randomString(6);
        this.handleReplay = this.handleReplay.bind(this);
    }

    handleReplay(e) {
        e.stopPropagation();
        e.preventDefault();
        this.setState({playError: false});
        this.liveRoom.replay();
    }

    onMessageReceived(message) {
        const goodsList = this.state.merchandises;
        const {settings} = this.props;
        const {userInfo} = this.props.context;
        const msg = message;
        switch (message.type) {
            case MessageType.GOODS_UPDATE:
                goodsList?.forEach((goods:any) => {
                    if (goods.id == message.goodsId) {
                        goods.startTime = message.startTime;
                        goods.endTime = message.endTime;
                        goods.actualEndTime = message.actualEndTime;
                        goods.state = message.state;
                        goods.dealPrice = message.dealPrice;

                        if (parseInt(settings.isDealCommission) == 1) {
                            if (parseFloat(goods.commission) > 0.00 && goods.state == 3) {
                                //落槌价显示佣金
                                const commission = goods.commission/100;
                                goods.dealPrice = (goods.dealPrice + (goods.dealPrice * commission));
                            }
                        }

                        this.setState({goods: goods});
                        if (message.state == 3) {
                            //成交了
                            if (message.dealUserId == userInfo.id) {
                                //中拍的人就是我
                                utils.showMessage('恭喜您成功拍到此拍品，是否立即支付拍品款项?', function () {
                                    Taro.navigateTo({url: '/pages/my/orders?status=0'}).then();
                                }, true, () => {
                                }, '恭喜中拍', '立即支付', '稍后支付').then();
                            } else {
                                utils.showMessage('很遗憾您没有中拍!').then();
                            }
                        } else if (message.state == 4) {
                            utils.showMessage('很遗憾您没有中拍!').then();
                        }

                    }
                });
                break;
            case MessageType.AUCTION_DELAYED:
                goodsList?.forEach(goods=>{
                    if(goods.id == message.goodsId) {
                        goods.actualEndTime = message.newTime;
                    }
                })
                break;
            case MessageType.OFFER:
                goodsList?.forEach(goods=> {
                    if (goods.id == message.goodsId) {
                        goods.currentPrice = parseFloat(msg.price).toFixed(2);
                        this.setState({goods: goods});
                        goods.offerCount++;
                        this.nextPrice(goods);
                        let offers = this.state.offers;
                        if (offers.length >= 3) {
                            offers.pop();
                        }
                        offers.unshift(
                            {
                                memberAvatar: msg.userAvatar,
                                memberName: msg.userName,
                                memberId: msg.userId,
                                price: msg.price,
                                offerTime: msg.offerTime
                            }
                        );
                        this.setState({offers: offers, goods: goods});
                    }
                });
                break;
            case MessageType.KICKOUT_ROOM:
                //被踢出房间
                utils.showMessage(message.message, function(){
                    utils.navigateBack();
                }).then();
                break;
            default:
                break;
        }
        this.liveRoom.onMessageReceived(message);
        this.setState(this.resolveGoods(goodsList));
    }

    async componentDidUpdate(_prevProps: Readonly<any>, _prevState) {
        const {page} = getCurrentInstance();
        const {userInfo} = this.props.context;
        const {liveRoom} = this.state;
        if (!this.liveRoom && userInfo && liveRoom) {
            // @ts-ignore
            this.liveRoom = page?.selectComponent('#live-room');
            this.liveRoom.init();
            this.setState({merBot: this.liveRoom.getData().meBot, newBot: this.liveRoom.getData().newBot});
            //查询是否需要缴纳保证金
            request.get('/paimai/api/members/deposited/liveroom', {params: {id: liveRoom.id}}).then(res => {
                this.setState({deposited: res.data.result});
            });
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
                    this.hideOffer();
                }
                break;
            }
            case 'playError':
                this.setState({playError: true});
                break;
            case 'playWaiting':
                this.setState({playError: true});
                break;
            default: {
                // console.log('onRoomEvent default: ', e);
                break;
            }
        }
    }
    async payDeposit() {
        const {preOffered} = this.state;
        if(!preOffered) {
            let checkResult = await request.get('/paimai/api/members/check');
            if (!checkResult.data.result) {
                return utils.showMessage("请完善您的个人信息(手机号、昵称、头像)", function () {
                    Taro.navigateTo({url: '/pages/my/profile'}).then();
                });
            }
            this.setState({preOffered: true});
        }
        this.setState({posting: true});
        //支付宝保证金
        request.post('/paimai/api/members/deposits/liveroom', null, {params: {id: this.state.liveRoom.id}}).then(res => {
            let data = res.data.result;
            data.package = data.packageValue;
            Taro.requestPayment(data).then(() => {
                //支付已经完成，提醒支付成功并返回上一页面
                Taro.showToast({title: '支付成功', duration: 2000}).then(() => {
                    this.setState({deposited: true});
                });
                this.setState({posting: false});
            }).catch(() => this.setState({posting: false}));
        })
    }

    async offer() {
        const {context, settings} = this.props;
        const {userInfo} = context;
        const {preOffered} = this.state;
        const goods = this.state.merchandises[this.state.pushIndex];
        if(!goods) {
            utils.showError('当前没有可以出价的拍品');
            return;
        }
        if(!preOffered) {
            let checkResult = await request.get('/paimai/api/members/check');
            if (!checkResult.data.result) {
                return utils.showMessage("请完善您的个人信息(手机号、昵称、头像)后再出价", function () {
                    Taro.navigateTo({url: '/pages/my/profile'}).then();
                });
            }
            //发送模板消息
            if (settings.offerResultTemplateId) {
                await Taro.requestSubscribeMessage({tmplIds: [settings.offerResultTemplateId]});
            }
            this.setState({preOffered: true});
        }
        let offers = this.state.offers;
        let doOffer = () => {
            this.setState({posting: true});
            request.post('/paimai/api/members/offers', {id: goods.id, price: this.state.nextPrice, randomStr: this.randomStr}).then(res => {
                this.setState({posting: false});
                if (res.data.success) {
                    utils.showSuccess(false, '出价成功');
                } else {
                    utils.showError(res.data.message || '出价失败');
                }
                this.setState({hideModal: true});
                this.fadeDownOffer();
            }).catch(() => this.setState({posting: false}));
        }
        //判断当前自己是不是最高出价人，如果是提醒一次
        if (offers && offers.length > 0) {
            if (userInfo.id == offers[0].memberId) {
                await utils.showMessage('您当前的出价已为最高出价，是否确定继续出价?', function () {
                    doOffer();
                }, true, () => {
                }, '友情提示', '继续出价', '取消出价');
            } else {
                doOffer();
            }
        } else {
            doOffer();
        }
        //出价

    }

    onInputPriceChange(e){
        let newPrice = e.detail.value;
        let goods = this.state.customGoods || {...this.state.goods};
        goods.currentPrice = newPrice;
        this.setState({customGoods: goods});
    }
    subPrice(){
        if(this.state.pushIndex < 0) return;
        if(this.offerInputRef.current.value <= this.state.nextPrice) {
            return;
        }
        let goods = this.state.customGoods || {...this.state.merchandises[this.state.pushIndex]};
        goods.currentPrice = this.offerInputRef.current.value = this.prevPrice(goods, false);
        goods.offerCount--;
        this.setState({customGoods: goods});
    }
    addPrice(){
        if(this.state.pushIndex < 0) return;
        let goods = this.state.customGoods || {...this.state.merchandises[this.state.pushIndex], currentPrice: this.state.nextPrice};
        goods.offerCount++;
        goods.currentPrice = this.offerInputRef.current.value = this.nextPrice(goods, false);
        this.setState({customGoods: goods});
    }
    prevPrice(newGoods, update= false) {
        let goods = newGoods;
        let upgradeConfig = goods.uprange;
        const {settings} = this.props;
        if (parseInt(settings.isDealCommission) == 1) {
            if (parseFloat(goods.commission) > 0.00 && goods.state == 3) {
                //落槌价显示佣金
                const commission = goods.commission/100;
                goods.dealPrice = (goods.dealPrice + (goods.dealPrice * commission));
            }
        }
        if (!goods.currentPrice) {
            //说明没有人出价，第一次出价可以以起拍价出价
            this.setState({nextPrice: goods.startPrice, goods: goods});
            return;
        }
        let currentPrice = parseFloat(goods.currentPrice);

        //这里计算要加价多少，并且符合后台的258逻辑

        let rangePrice = 0;
        let offerCount = goods.offerCount;
        for (let i = 0; i < upgradeConfig.length; i++) {
            let config = upgradeConfig[i];
            let min = parseFloat(config.min);
            let priceConfigs = config.price.split(',');
            let price = 0;
            if(priceConfigs.length == 1) {
                price = parseFloat(priceConfigs[0]);
            }
            else {
                //计算是第几个人出价
                let modIndex = (offerCount % priceConfigs.length);
                console.log('mod index is', modIndex, offerCount, priceConfigs.length);
                price = parseFloat(priceConfigs[modIndex]);
            }
            if (currentPrice >= min) {
                rangePrice = price;
            }
        }
        const finalPrice = currentPrice - rangePrice;
        update && this.setState({nextPrice: finalPrice, goods: goods});
        return finalPrice;
    }
    nextPrice(newGoods, update=true) {
        let goods = newGoods;
        let upgradeConfig = goods.uprange;
        const {settings} = this.props;
        if (parseInt(settings.isDealCommission) == 1) {
            if (parseFloat(goods.commission) > 0.00 && goods.state == 3) {
                //落槌价显示佣金
                const commission = goods.commission/100;
                goods.dealPrice = (goods.dealPrice + (goods.dealPrice * commission));
            }
        }
        if (!goods.currentPrice) {
            //说明没有人出价，第一次出价可以以起拍价出价
            this.setState({nextPrice: goods.startPrice, goods: goods});
            return;
        }
        let currentPrice = parseFloat(goods.currentPrice);

        //这里计算要加价多少，并且符合后台的258逻辑

        let rangePrice = 0;
        let offerCount = goods.offerCount - 1;
        for (let i = 0; i < upgradeConfig.length; i++) {
            let config = upgradeConfig[i];
            let min = parseFloat(config.min);
            let priceConfigs = config.price.split(',');
            let price = 0;
            if(priceConfigs.length == 1) {
                price = parseFloat(priceConfigs[0]);
            }
            else {
                //计算是第几个人出价
                let modIndex = (offerCount % priceConfigs.length);
                price = parseFloat(priceConfigs[modIndex]);
            }
            if (currentPrice >= min) {
                rangePrice = price;
            }
        }
        const finalPrice = currentPrice+rangePrice;
        update && this.setState({nextPrice: finalPrice, goods: goods});
        return finalPrice;
    }


    hideModal() {
        this.setState({hideModal: true});
        this.fadeDown();
    }
    hideOffer() {
        this.setState({hideModal: true});
        this.fadeDownOffer();
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
    fadeInOffer() {
        this.animationOffer?.translateY(0).step()
        this.setState({
            animationOfferData: this.animationOffer.export() //动画实例的export方法导出动画数据传递给组件的animation属性
        })
    }

    fadeDownOffer() {
        this.animationOffer?.translateY(450).step()
        this.setState({
            animationOfferData: this.animationOffer?.export(),
        })
    }
    fadeIn() {
        this.animation?.translateY(0).step()
        this.setState({
            animationData: this.animation?.export() //动画实例的export方法导出动画数据传递给组件的animation属性
        })
    }

    fadeDown() {
        this.animation?.translateY(450).step()
        this.setState({
            animationData: this.animation?.export(),
        })
    }

    onLoad(options) {
        this.options = options;
        Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: 'transparent'});
        request.get('/paimai/api/live/rooms/' + options.roomId).then(res => {
            let room = res.data.result;
            //注册全局事件
            EventBus.register(EventType.onMessageData, this.onMessageReceived);
            request.get('/paimai/api/live/room/goods', {params: {roomId: room.id}}).then(res => {
                let goodsList = res.data.result;
                goodsList.forEach(data=> {
                    data.fields = JSON.parse(data.fields || '[]');
                    data.uprange = JSON.parse(data.uprange);
                });
                this.setState(this.resolveGoods(goodsList));
                this.setState({liveRoom: room});
            });
        });
    }

    resolveGoods(goodsList) {
        let currentIndex = -1;
        goodsList.forEach((item:any, index:number)=>{
            if(item.state == 1){
                currentIndex = index;
            }
        });
        if(currentIndex == -1) {
            this.liveRoom?.clickFull();
        }
        else {
            let data = goodsList[currentIndex];
            this.nextPrice(data);
        }
        return {merchandises: goodsList, pushIndex: currentIndex};
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
    showOffer(e) {
        if(e) {
            e.stopPropagation();
            e.preventDefault();
        }
        // this.liveRoom?.showOffer(this.state.merchandises[this.state.pushIndex], this.state.deposited || this.state.liveRoom.deposit == 0);
        this.setState({
            hideModal: false
        });
        this.animationOffer = Taro.createAnimation({
            duration: 150, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快
            timingFunction: 'linear', //动画的效果 默认值是linear
        });
        if(this.offerInputRef?.current){
            this.offerInputRef.current.value = this.state.nextPrice;
        }
        setTimeout(() => {
            this.fadeInOffer(); //调用显示动画
        }, 10);
        return false;
    }


    componentWillUnmount() {
        //用户退出直播间
        request.put('/paimai/api/live/room/logout', this.state.liveRoom).then();
        EventBus.unregister(EventType.onMessageData, this.onMessageReceived);
    }

    onShareTimeline() {
        let mid = this.props.context?.userInfo?.id || '';
        return {
            title: this.state.liveRoom?.title,
            query: {mid: mid, roomId: this.state.liveRoom.id},
        }
    }

    onShareAppMessage() {
        let mid = this.props.context?.userInfo?.id || '';
        let settings = this.props.settings;
        return {
            title: settings.shareTitle || '超值拍品正在拍卖中，快来围观！',
            path: '/live/pages/detail?mid=' + mid + '&roomId='+this.state.liveRoom.id
        }
    }

    render() {
        const {
            liveRoom,
            hideModal,
            animationData,
            animationOfferData,
            merchandises,
            pushIndex,
            merBot,
            playError,
        } = this.state;
        const {systemInfo, context, settings} = this.props;
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
                        isImReady={context.isImReady && liveRoom}
                        navBarHeight={barTop}
                        settings={this.props.settings}
                        onRoomEvent={this.onRoomEvent}
                        bindRoomEvent
                    />
                    {playError && <View className={'w-screen h-screen z-10 absolute top-0 left-0 flex flex-col items-center justify-center'}>
                        <Image src={'/assets/images/live-room-bg.png'} className={'w-full h-full block absolute top-0 left-0 z-0'} />
                        <View className={'text-white text-lg z-1 mb-4'}>网络开小差了~~</View>
                        <Button className={'btn btn-primary z-1'} onClick={this.handleReplay}>点击重试</Button>
                    </View>}
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
                                            <Navigator url={'/goods/pages/detail?id=' + item.id}
                                                       className={'bg-white flex items-center shadow-outer rounded-lg overflow-hidden mt-2'}>
                                                <View className={'relative w-28 h-28'}>
                                                    <FallbackImage
                                                        mode={'aspectFill'}
                                                        className={'block w-full h-full'}
                                                        src={utils.resolveUrl(item.images.split(',')[0])}
                                                    />
                                                </View>
                                                <View className={'p-2 space-y-4 flex-1'}>
                                                    <View className={'text-gray-600 text-cut'}>LOT{item.sortNum} {item.title}</View>
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
                        <View onClick={()=>Taro.navigateTo({url: `/goods/pages/detail?id=${merchandises[pushIndex].id}`})} className="push-mer" style={{bottom: merBot+'rpx'}}>
                            <Image className="push-mer-img" mode={'aspectFill'} src={merchandises[pushIndex].images.split(',')[0]}></Image>
                            <View className="push-mer-detail">
                                <View className="push-mer-text">{merchandises[pushIndex].title}</View>
                                <View className="push-mer-price justify-between mt-1">
                                    <View className={'text-cut flex-1'}>
                                    <Text className={'text-sm'}>¥</Text>
                                    <Text>{numeral(merchandises[pushIndex].currentPrice || merchandises[pushIndex].startPrice).format('0,0.00')}</Text>
                                    </View>
                                    <Text onClick={this.showOffer} className={'font-bold'}>出价</Text>
                                </View>
                            </View>
                        </View>
                    }
                    {pushIndex >= 0 &&
                    <View className="modals modals-bottom-dialog" hidden={hideModal}>
                        <View className="bottom-dialog-body bottom-pos" animation={animationOfferData} style={{height: 200}}>
                            <View className="merchandise-container">
                                <View className="merchandise-head">
                                    <View className="m-t">
                                        <Image className="m-list-png" src="../../assets/images/m-list.png"></Image>
                                        <View className="m-title">出价拍品</View>
                                    </View>
                                    <Image className="m-close-png" src="../../assets/images/m-close.png" onClick={this.hideOffer}></Image>
                                </View>
                                <View className={'flex flex-col items-center justify-center space-y-4'}>
                                    <View>当前价：{numeral(merchandises[pushIndex].currentPrice||merchandises[pushIndex].startPrice).format('0,0.00')}</View>
                                    <View className={'flex items-center text-center'}>
                                        <Text onClick={this.subPrice} className={classNames('fa fa-minus-circle mr-2', this.offerInputRef?.current?.value > this.state.nextPrice ? 'text-red-600':'text-gray-600')} style={{fontSize: 24}} />
                                        <Input className={'font-bold text-lg w-30'} disabled={!settings.isCustomOffer} placeholder={'出价价格'} ref={this.offerInputRef} onInput={this.onInputPriceChange} />
                                        {!!settings.isCustomOffer && <Text className={'fa fa-plus-circle ml-2 text-red-600'} style={{fontSize: 24}} onClick={this.addPrice} />}
                                        {!settings.isCustomOffer && <Text className={'fa fa-plus-circle ml-2 text-gray-600'} style={{fontSize: 24}} />}
                                    </View>
                                    {this.state.deposited &&
                                        <View><Button className={'btn btn-danger'} onClick={this.offer}>确认出价</Button></View>
                                    }
                                    {!this.state.deposited &&
                                        <View><Button className={'btn btn-info'} onClick={this.payDeposit}>缴纳保证金</Button></View>
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                    }
                </View>
            </>
        );
    }
}
