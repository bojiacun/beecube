import {Component} from "react";
import Taro, {getCurrentInstance} from "@tarojs/taro";
import {connect} from "react-redux";
import request from "../../lib/request";
import {Image, Text, View, ScrollView, Navigator, Button} from "@tarojs/components";
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
        newBot: 0,
        preOffered: false,
        offers: [],
        deposited: undefined,
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
        this.fadeIn = this.fadeIn.bind(this);
        this.fadeDown = this.fadeDown.bind(this);
        this.showModal = this.showModal.bind(this);
        this.onRoomEvent = this.onRoomEvent.bind(this);
        this.showOffer = this.showOffer.bind(this);
        // this.onStreamUrlUpdate = this.onStreamUrlUpdate.bind(this);
    }

    async componentDidUpdate(prevProps: Readonly<any>, prevState) {
        const {page} = getCurrentInstance();
        const {userInfo} = this.props.context;
        const {message, settings} = this.props;
        const goodsList = this.state.merchandises;
        const pushIndex = this.state.pushIndex;

        if (!this.liveRoom && userInfo) {
            // @ts-ignore
            this.liveRoom = page?.selectComponent('#live-room');
            this.liveRoom.init();
            this.setState({merBot: this.liveRoom.getData().meBot, newBot: this.liveRoom.getData().newBot});
            //查询是否需要缴纳保证金
            request.get('/paimai/api/members/deposited/liveroom', {params: {id: this.state.liveRoom.id}}).then(res => {
                this.setState({deposited: res.data.result});
            });
        }
        else if(this.liveRoom && message && message.id != prevProps.message.id){
            this.liveRoom.onMessageReceived(message);
        }
        if(pushIndex != prevState.pushIndex) {
            let addBot = (pushIndex > - 1 ? 130:0)
            this.liveRoom?.setData({meBot: this.state.merBot + addBot, newBot: this.state.newBot + addBot});
        }
        if (!goodsList || !message || message.id == prevProps.message.id) return;

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
                        goods.currentPrice = parseFloat(message.price).toFixed(2);
                        this.liveRoom?.getNextPrice(goods);
                        let offers = this.state.offers;
                        if (offers.length >= 3) {
                            offers.pop();
                        }
                        offers.unshift(
                            {
                                memberAvatar: message.fromUserAvatar,
                                memberName: message.fromUserName,
                                memberId: message.fromUserId,
                                price: message.price,
                                offerTime: message.createTime
                            }
                        );
                        goods.offerCount++;
                    }
                });
                break;
        }
        this.setState(this.resolveGoods(goodsList));
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
            case 'doOffer': {
                console.log('doOffer', content);
                //发送HTTP请求进行出价
                this.offer(content.price).then();
                break;
            }
            case 'payDeposit': {
                console.log('payDeposit', content);
                //发送HTTP请求进行出价
                this.payDeposit();
                break;
            }
            default: {
                // console.log('onRoomEvent default: ', e);
                break;
            }
        }
    }
    payDeposit() {
        this.setState({posting: true});
        //支付宝保证金
        request.post('/paimai/api/members/deposits/liveroom', null, {params: {id: this.state.liveRoom.id}}).then(res => {
            let data = res.data.result;
            data.package = data.packageValue;
            Taro.requestPayment(data).then(() => {
                //支付已经完成，提醒支付成功并返回上一页面
                Taro.showToast({title: '支付成功', duration: 2000}).then(() => {
                    let liveRoom = this.state.liveRoom;
                    liveRoom.deposited = true;
                    this.setState({liveRoom: liveRoom, deposited: true});
                });
                this.setState({posting: false});
            }).catch(() => this.setState({posting: false}));
        })
    }
    async offer(nextPrice:number) {
        const {context, settings} = this.props;
        const {userInfo} = context;
        const {pushIndex, merchandises, preOffered} = this.state;
        const goods = merchandises[pushIndex];
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
            request.post('/paimai/api/members/offers', {id: goods.id, price: nextPrice, randomStr: utils.randomString(6)}).then(res => {
                this.setState({posting: false});
                if (res.data.success) {
                    utils.showSuccess(false, '出价成功');
                    if (offers.length >= 3) {
                        offers.pop();
                    }
                    offers.unshift({
                        memberAvatar: userInfo.avatar,
                        memberId: userInfo.id,
                        memberName: userInfo.realname || userInfo.nickname,
                        price: this.state.nextPrice,
                        offerTime: moment(new Date()).format('yyyy-MM-DD HH:mm:ss'),
                    });
                    goods.offerCount++;
                    this.setState({offers: offers});
                } else {
                    utils.showError(res.data.message || '出价失败');
                }
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

    onLoad(options) {
        this.options = options;
        request.get('/paimai/api/live/rooms/' + options.roomId).then(res => {
            let room = res.data.result;
            this.setState({liveRoom: room});
            request.get('/paimai/api/live/room/goods', {params: {roomId: room.id}}).then(res => {
                let goodsList = res.data.result;
                this.setState(this.resolveGoods(goodsList));
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
        return {merchandises: goodsList, pushIndex: currentIndex};
    }

    showOffer(e) {
        if(e) {
            e.stopPropagation();
            e.preventDefault();
        }
        this.liveRoom?.showOffer(this.state.merchandises[this.state.pushIndex], this.state.deposited || this.state.liveRoom.deposit == 0);
        return false;
    }


    componentWillUnmount() {
        //用户退出直播间
        request.put('/paimai/api/live/room/logout', this.state.liveRoom).then();
    }

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
                        isImReady={context.isImReady && liveRoom}
                        navBarHeight={barTop}
                        settings={this.props.settings}
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
                        <View onClick={()=>Taro.navigateTo({url: `/pages/goods/detail?id=${merchandises[pushIndex].id}`})} className="push-mer" style={{bottom: merBot+'rpx'}}>
                            <Image className="push-mer-img" mode={'aspectFit'} src={merchandises[pushIndex].images.split(',')[0]}></Image>
                            <View className="push-mer-detail">
                                <Text className="push-mer-text">{merchandises[pushIndex].title}</Text>
                                <Text className="push-mer-price">当前价：¥{numeral(merchandises[pushIndex].currentPrice || merchandises[pushIndex].startPrice).format('0,0.00')}</Text>
                            </View>
                            <View onClick={this.showOffer} className={'flex items-center justify-center mr-2'}><Button className={'btn btn-danger btn-sm'}>出价</Button></View>
                        </View>
                    }
                </View>
            </>
        );
    }
}
