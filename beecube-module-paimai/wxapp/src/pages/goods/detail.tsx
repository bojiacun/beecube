import React, {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request, {API_URL, APP_ID} from "../../lib/request";
import utils from "../../lib/utils";
import CustomSwiper, {CustomSwiperItem} from "../../components/swiper";
import {Button, Image, Input, Navigator, Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {connect} from "react-redux";
import classNames from "classnames";
import PageLoading from "../../components/pageloading";
import FallbackImage from "../../components/FallbackImage";
import Uprange from "./components/uprange";
import Descs from "./components/descs";
import TimeCountDowner, {TimeCountDownerMode, TimeCountDownerStatus} from "../../components/TimeCountDowner";
import MessageType from "../../utils/message-type";
import EventBus from '../../utils/event-bus';
import EventType from '../../utils/event-type';
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
        id: 0,
        goods: null,
        counting: false,
        nextPrice: undefined,
        offers: [],
        posting: false,
        uprangeShow: false,
        status: undefined,
        message: false,
        preOffered: false,
        hideModal: true,
        customGoods: null,
        shareAdv: null,
        loadingShareAdv: false,
    }
    socket: any;
    randomStr: string;
    animation: any;
    offerInputRef: any;


    constructor(props) {
        super(props);
        this.onShareAppMessage = this.onShareAppMessage.bind(this);
        this.onShareTimeline = this.onShareTimeline.bind(this);
        this.toggleFollow = this.toggleFollow.bind(this);
        this.payDeposit = this.payDeposit.bind(this);
        this.offer = this.offer.bind(this);
        this.onMessageReceive = this.onMessageReceive.bind(this);
        this.noticeMe = this.noticeMe.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
        this.randomStr = utils.randomString(6);
        this.hideModal = this.hideModal.bind(this);
        this.showModal = this.showModal.bind(this);
        this.addPrice = this.addPrice.bind(this);
        this.subPrice = this.subPrice.bind(this);
        this.onInputPriceChange = this.onInputPriceChange.bind(this);
        this.openShareGoods = this.openShareGoods.bind(this);
        this.handleSaveToPhotoAlbum = this.handleSaveToPhotoAlbum.bind(this);
        this.offerInputRef = React.createRef();
    }

    showModal() {
        this.setState({
            hideModal: false
        });
        this.animation = Taro.createAnimation({
            duration: 150, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快
            timingFunction: 'linear', //动画的效果 默认值是linear
        });
        if(this.offerInputRef?.current){
            this.offerInputRef.current.value = this.state.nextPrice;
        }
        setTimeout(() => {
            this.fadeIn(); //调用显示动画
        }, 10);
    }
    hideModal() {
        this.setState({hideModal: true});
        this.fadeDown();
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
    // @ts-ignore
    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
        const {context} = this.props;
        const {userInfo} = context;
        let {goods, status} = this.state;
        if (!userInfo || !goods) return;
        if (prevState.goods == null) {
            //记录浏览记录
            request.post('/paimai/api/members/views', null, {params: {id: this.state.id}}).then(res => {
                console.log(res.data.result);
            });
            //查询是否关注
            request.get('/paimai/api/members/isfollow', {params: {id: this.state.id}}).then(res => {
                goods.followed = res.data.result;
                this.setState({goods: goods});
            });
            //查询是否需要缴纳保证金
            request.get('/paimai/api/members/deposited', {params: {id: this.state.id}}).then(res => {
                goods.deposited = res.data.result;
                this.setState({goods: goods});
            });
        }
        if (prevState.status != status && status != TimeCountDownerStatus.ENDED) {
            request.get('/paimai/api/members/messaged', {
                params: {
                    type: this.state.status == TimeCountDownerStatus.NOT_START ? 1 : 2,
                    goodsId: goods.id
                }
            }).then(res => {
                this.setState({message: res.data.result});
            })
        }
    }

    onMessageReceive(message: any) {
        const {context} = this.props;
        const {userInfo} = context;
        let {goods} = this.state;
        let msg = message;
        //如果是自身产生的消息则忽略
        if (msg.isme) {
            return;
        }
        if (msg.goodsId != goods.id) return;
        switch (msg.type) {
            case MessageType.OFFER:
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
                break;
            case MessageType.AUCTION_DELAYED:
                goods.actualEndTime = msg.newTime;
                this.setState({goods: goods});
                break;
            case MessageType.GOODS_UPDATE:
                const {settings} = this.props;
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
                if (msg.state == 3) {
                    //成交了
                    if (msg.dealUserId == userInfo.id) {
                        //中拍的人就是我
                        utils.showMessage('恭喜您成功拍到此拍品，是否立即支付拍品款项?', function () {
                            Taro.navigateTo({url: '/pages/my/orders?status=0'}).then();
                        }, true, () => {
                        }, '恭喜中拍', '立即支付', '稍后支付').then();
                    } else {
                        utils.showMessage('很遗憾您没有中拍!').then();
                    }
                } else if (msg.state == 4) {
                    utils.showMessage('很遗憾您没有中拍!').then();
                }
                break;
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
        request.post('/paimai/api/members/deposits', null, {params: {id: this.state.id}}).then(res => {
            let data = res.data.result;
            data.package = data.packageValue;
            Taro.requestPayment(data).then(() => {
                //支付已经完成，提醒支付成功并返回上一页面
                Taro.showToast({title: '支付成功', duration: 2000}).then(() => {
                    let goods = this.state.goods;
                    goods.deposited = true;
                    this.setState({goods: goods});
                });
                this.setState({posting: false});
            }).catch(() => this.setState({posting: false}));
        })
    }

    async offer() {
        const {context, settings} = this.props;
        const {userInfo} = context;
        const {goods, preOffered} = this.state;
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
                this.fadeDown();
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
        if(this.offerInputRef.current.value <= this.state.nextPrice) {
            return;
        }
        let goods = this.state.customGoods || {...this.state.goods};
        goods.currentPrice = this.offerInputRef.current.value = this.prevPrice(goods, false);
        goods.offerCount--;
        this.setState({customGoods: goods});
    }
    addPrice(){
        let goods = this.state.customGoods || {...this.state.goods, currentPrice: this.state.nextPrice};
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
        update && this.setState({nextPrice: currentPrice - rangePrice, goods: goods});
        return currentPrice - rangePrice;
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
        update && this.setState({nextPrice: currentPrice + rangePrice, goods: goods});
        return currentPrice + rangePrice;
    }

    onLoad(options) {
        utils.showLoading();
        this.setState({id: options.id});
        request.get("/paimai/api/goods/detail", {params: {id: options.id}}).then(res => {
            let data = res.data.result;
            data.fields = JSON.parse(data.fields || '[]');
            data.uprange = JSON.parse(data.uprange);
            this.nextPrice(data);
            utils.hideLoading();
            //注册全局事件
            EventBus.register(EventType.onMessageData, this.onMessageReceive);
        });
        //查询出价记录
        request.get('/paimai/api/goods/offers', {params: {id: options.id, pageSize: 3}}).then(res => {
            this.setState({offers: res.data.result.records});
        });
    }

    onShareTimeline() {
        let mid = this.props.context?.userInfo?.id || '';
        return {
            title: this.state.goods?.title,
            query: {mid: mid},
        }
    }

    onShareAppMessage() {
        let mid = this.props.context?.userInfo?.id || '';
        return {
            title: this.state.goods?.title,
            path: '/pages/goods/detail?id=' + this.state.id + '&mid=' + mid
        }
    }

    handlePreview(item) {
        const images = this.state.goods.images.split(',').map((item) => {
            return utils.resolveUrl(item);
        });
        Taro.previewImage({urls: images, current: item.url}).then();
        return true;
    }

    toggleFollow() {
        request.put('/paimai/api/members/follow/toggle', {id: this.state.id}).then(res => {
            let goods = this.state.goods;
            goods.followed = res.data.result;
            this.setState({goods: goods});
        });
    }

    renderButton() {
        const {goods, status} = this.state;
        //判断按钮状态

        if ((goods.performanceDeposit || goods.deposit) && !goods.deposited && goods.state < 2 && status != TimeCountDownerStatus.ENDED) {
            //需要交保证金的情况
            return (
                <View>
                    <Button disabled={this.state.posting} className={'btn btn-primary w-56'} onClick={this.payDeposit}>
                        <View>交保证金</View>
                        <View>RMB {numeral(goods.performanceDeposit || goods.deposit).format('0,0.00')}</View>
                    </Button>
                </View>
            );
        }
        if ((goods.performanceType == 2 && goods.state == 1 && goods.performanceState == 1) || (status == TimeCountDownerStatus.STARTED && goods.state < 2)) {
            //可以出价的情况
            return (
                <View>
                    <Button disabled={this.state.posting} className={'btn btn-danger w-56'} onClick={this.showModal}>
                        <View>出价</View>
                    </Button>
                </View>
            );
        }
        if ((goods.performanceType == 2 && (goods.state == 0 || goods.performanceState == 0)) || status == TimeCountDownerStatus.NOT_START) {
            //未开始的情况
            return (
                <View>
                    <Button className={'btn w-56'} disabled={true}>
                        <View>未开始</View>
                    </Button>
                </View>
            );
        }
        if ((goods.performanceType == 2 && (goods.state > 1 || goods.performanceState > 1)) || status == TimeCountDownerStatus.ENDED || goods.state > 1) {
            //结束的情况
            return (
                <View>
                    <Button className={'btn w-56'} disabled={true}>
                        <View>已结束</View>
                    </Button>
                </View>
            );
        }
        return <></>;
    }

    clickMask(){
        this.setState({hideModal: true, loadingShareAdv: false});
        this.fadeDown();
    }
    openShareGoods(){
        this.setState({hideModal: false, loadingShareAdv:true});
        request.get('/paimai/api/members/share/goods', {params: {id: this.state.goods.id}, responseType: 'arraybuffer'}).then((res:any)=>{
            let data = Taro.arrayBufferToBase64(res.data);
            this.setState({shareAdv: data});
        });
    }
    handleSaveToPhotoAlbum() {
        const token = Taro.getStorageSync("TOKEN");
        Taro.downloadFile({
            url: API_URL+'/paimai/api/members/share/goods?id='+this.state.goods.id,
            header: {'X-Access-Token': token, 'Authorization': token, 'X-App-Id': APP_ID},
        }).then(res=>{
            Taro.saveImageToPhotosAlbum({filePath: res.tempFilePath}).then(()=>{
                utils.showSuccess(false,'保存成功');
                this.clickMask();
            });
        })
    }

    async noticeMe() {
        const {message, status} = this.state;
        const {settings} = this.props;

        let templateId, type;

        if (status == TimeCountDownerStatus.NOT_START) {
            //开始提醒
            type = 1;
            templateId = settings.startTemplateId;
        } else if (status == TimeCountDownerStatus.STARTED) {
            type = 2;
            templateId = settings.endTemplateId;
        }

        if (!message && templateId) {
            const res = await Taro.requestSubscribeMessage({tmplIds: [templateId]});
            if (res[templateId] == 'accept' || res[templateId] == 'acceptWithAudio') {
                if (type) {
                    request.put('/paimai/api/members/messages/toggle', {
                        type: type,
                        goodsId: this.state.goods.id,
                        templateId: templateId,
                    }).then(res => {
                        this.setState({message: res.data.result});
                    });
                }
            }
        } else {
            if (type) {
                request.put('/paimai/api/members/messages/toggle', {
                    type: type,
                    goodsId: this.state.goods.id,
                    templateId: templateId,
                }).then(res => {
                    this.setState({message: res.data.result});
                });
            }
        }
    }

    componentWillUnmount() {
        this.socket?.close();
        EventBus.unregister(EventType.onMessageData, this.onMessageReceive);
    }

    render() {
        const {goods, message, hideModal,animationData} = this.state;
        const {systemInfo, settings} = this.props;
        settings.isCustomOffer = parseInt(settings.isCustomOffer);
        if (goods == null) return <PageLoading/>;

        const images: CustomSwiperItem[] = goods.images.split(',').map((item, index) => {
            return {id: index, url: '#', image: item};
        });
        let safeBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom;
        if (safeBottom > 10) safeBottom -= 10;

        return (
            <PageLayout statusBarProps={{title: '拍品详情'}}>
                <CustomSwiper list={images} imageMode={'aspectFit'} radius={'0'} height={systemInfo.safeArea.width} onItemClick={this.handlePreview}/>
                <View className={'grid grid-cols-1 px-4 divide-y divide-gray-200'}>
                    <View className={'space-y-4 py-4'}>
                        <View className={'flex justify-between items-center'}>
                            <View>
                                <View className={'font-bold text-xl'}>
                                    {goods.title}
                                </View>
                                {goods.state < 3 &&
                                    <View className={'text-gray-600 mt-2'}>
                                        <View className={'space-x-1'}>
                                            估价 <Text className={'text-red-500 text-sm font-bold'}>RMB</Text>
                                            <Text className={'text-lg font-bold'}>{goods.evaluatePrice}</Text>
                                        </View>
                                        <View>
                                            当前价 <Text className={'text-sm text-red-500 font-bold'}>RMB</Text> <Text
                                            className={'text-lg text-red-500 font-bold'}>{numeral(goods.currentPrice || goods.startPrice).format('0,0.00')}</Text>
                                        </View>
                                    </View>
                                }
                                {goods.state == 3 &&
                                    <View className={'text-gray-600 mt-2'}>
                                        落槌价 <Text className={'text-sm text-red-500 font-bold'}>RMB</Text> <Text
                                        className={'text-lg text-red-500 font-bold'}>{numeral(goods.dealPrice).format('0,0.00')}</Text>
                                    </View>
                                }
                                {goods.state == 4 &&
                                    <View className={'text-gray-600 mt-2'}>
                                        流拍
                                    </View>
                                }
                            </View>
                            {(this.state.status == TimeCountDownerStatus.NOT_START || this.state.status == TimeCountDownerStatus.STARTED) &&
                                <View className={'w-20'}>
                                    {!message &&
                                        <View className={'flex flex-col items-center text-gray-600'} onClick={this.noticeMe}>
                                            <View><Text className={'iconfont icon-daojishi text-3xl'}/></View>
                                            <View
                                                className={'text-sm'}>{this.state.status == TimeCountDownerStatus.NOT_START ? '开始' : '结束'}提醒</View>
                                        </View>
                                    }
                                    {message &&
                                        <View className={'flex flex-col items-center text-red-600'} onClick={this.noticeMe}>
                                            <View><Text className={'iconfont icon-daojishi text-3xl'}/></View>
                                            <View className={'text-sm'}>取消提醒</View>
                                        </View>
                                    }
                                </View>
                            }
                        </View>
                        {goods.performanceType != 2 && goods.state < 2 &&
                            <TimeCountDowner
                                mode={TimeCountDownerMode.TimeBase}
                                onStatusChanged={status => {
                                    this.setState({status: status});
                                }}
                                className={'flex items-center text-sm space-x-1'}
                                endTime={goods.actualEndTime || goods.endTime}
                                startTime={goods.startTime}
                                startedTip={<><View
                                    className={'border rounded-r-full px-1 border-red-500 border-solid text-red-500'}>竞拍中</View><Text>距结束：</Text></>}
                                notStartTip={<><View
                                    className={'border rounded-r-full px-1 border-indigo-500 border-solid text-indigo-500'}>预展中</View><Text>距开始：</Text></>}
                            />
                        }
                        <View className={'text-sm text-gray-400 space-x-4'}>
                            <Text>围观{goods.viewCount}人</Text>
                            <Text>出价{goods.offerCount}次</Text>
                        </View>
                    </View>
                    <View className={'py-4 space-y-4'}>
                        <View className={'flex'}>
                            <View className={'flex-1'}>保证金：￥{numeral(goods.deposit).format('0,0.00')}</View>
                            <View className={'flex-1'}>加价幅度：<Text className={'text-indigo-400'}
                                                                      onClick={() => this.setState({uprangeShow: true})}>查看详情</Text></View>
                        </View>
                        <View className={'flex'}>
                            <View className={'flex-1'}>起拍价：￥{numeral(goods.startPrice).format('0,0.00')}</View>
                            <View className={'flex-1'}>拍卖佣金：{goods.commission}%</View>
                            {/*<View className={'flex-1'}>延时周期：<Text>{goods.delayTime}分钟</Text></View>*/}
                        </View>
                    </View>
                    <View className={'py-4'}>
                        <View className={'flex justify-between'}>
                            <View className={'font-bold'}>出价记录({goods.offerCount})</View>
                            <Navigator url={`offers?id=${this.state.id}`}>查看全部<Text className={'iconfont icon-youjiantou_huaban'}/></Navigator>
                        </View>
                        <View className={'space-y-4 mt-4'}>
                            {this.state.offers.map((o, index) => {
                                return (
                                    <View className={'flex justify-between items-center bg-white rounded-full overflow-hidden p-1 shadow-outer'}>
                                        <View className={'flex items-center space-x-2'}>
                                            <FallbackImage src={o.memberAvatar} className={'rounded-full'}
                                                           style={{width: Taro.pxTransform(52), height: Taro.pxTransform(52)}}/>
                                            <View>
                                                <View>{o.memberName}</View>
                                                <View className={'font-bold'}>￥{numeral(o.price).format('0,0.00')}</View>
                                            </View>
                                        </View>
                                        <View className={'text-right pr-4'}>
                                            {index == 0 && <View className={'text-indigo-600 font-bold'}>领先</View>}
                                            {index != 0 && <View className={'font-bold text-gray-400'}>出局</View>}
                                            <View className={'text-sm text-gray-400'}>{o.offerTime}</View>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </View>
                <Descs goods={goods}/>

                <View style={{height: Taro.pxTransform(124)}}/>

                <View className={'bg-white px-4 pt-1 flex items-center justify-between fixed bottom-0 w-full'}
                      style={{paddingBottom: safeBottom}}>
                    <View>
                        <Button onClick={this.openShareGoods} plain={true} className={'block flex flex-col items-center p-0'}>
                            <View className={'iconfont icon-fenxiang text-xl'}/>
                            <View>分享</View>
                        </Button>
                    </View>
                    <View>
                        <Button openType={'contact'} plain={true} className={'block flex flex-col items-center p-0'}>
                            <View className={'iconfont icon-lianxikefu text-xl'}/>
                            <View>客服</View>
                        </Button>
                    </View>
                    <View onClick={this.toggleFollow}
                          className={classNames('flex flex-col items-center space-y-1', goods.followed ? 'text-red-500' : '')}>
                        <View className={classNames('iconfont icon-31guanzhu1 text-xl')}/>
                        <View>收藏</View>
                    </View>
                    {this.renderButton()}
                </View>
                <Uprange uprangeShow={this.state.uprangeShow} onClose={() => this.setState({uprangeShow: false})} goods={goods} />

                <View className="modals modals-bottom-dialog" hidden={hideModal}>
                    <View className="bottom-dialog-body bottom-pos" animation={animationData} style={{height: 200}}>
                        <View className="merchandise-container">
                            <View className="merchandise-head">
                                <View className="m-t">
                                    <Image className="m-list-png" src="../../assets/images/m-list.png"></Image>
                                    <View className="m-title">出价拍品</View>
                                </View>
                                <Image className="m-close-png" src="../../assets/images/m-close.png" onClick={this.hideModal}></Image>
                            </View>
                            <View className={'flex flex-col items-center justify-center space-y-4'}>
                                <View>当前价：{numeral(goods.currentPrice||goods.startPrice).format('0,0.00')}</View>
                                <View className={'flex items-center text-center'}>
                                    <Text onClick={this.subPrice} className={classNames('fa fa-minus-circle mr-2', this.offerInputRef?.current?.value > this.state.nextPrice ? 'text-red-600':'text-gray-600')} style={{fontSize: 24}} />
                                    <Input className={'font-bold text-lg w-30'} disabled={!settings.isCustomOffer} placeholder={'出价价格'} ref={this.offerInputRef} onInput={this.onInputPriceChange} />
                                    {!!settings.isCustomOffer && <Text className={'fa fa-plus-circle ml-2 text-red-600'} style={{fontSize: 24}} onClick={this.addPrice} />}
                                    {!settings.isCustomOffer && <Text className={'fa fa-plus-circle ml-2 text-gray-600'} style={{fontSize: 24}} />}
                                </View>
                                <View><Button className={'btn btn-danger'} onClick={this.offer}>确认出价</Button></View>
                            </View>
                        </View>
                    </View>
                </View>
                <View className={'modals-mask'} style={{display: hideModal ? 'none': 'block'}} onClick={this.clickMask} />
                {this.state.loadingShareAdv && <View className={'w-full h-full flex flex-col z-100 items-center justify-center absolute top-0 right-0'}>
                    <View className={'flex flex-col items-center'} style={{height: '70%'}}>
                    {this.state.shareAdv && <FallbackImage className={'flex-1 block'} src={'data:image/png;base64,'+this.state.shareAdv} mode={'aspectFit'} />}
                    {!this.state.shareAdv && <PageLoading style={{height: 500}} />}
                    <View className={'space-x-4 mt-4 flex-none'}>
                        <Button openType={'share'} className={'btn btn-info'}>发给好友</Button>
                        <Button onClick={this.handleSaveToPhotoAlbum} className={'btn btn-warning'}>保存到相册</Button>
                    </View>
                    </View>
                </View>}
            </PageLayout>
        );
    }
}
