import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request, {connectWebSocketServer} from "../../lib/request";
import utils from "../../lib/utils";
import CustomSwiper, {CustomSwiperItem} from "../../components/swiper";
import {Button, Navigator, RichText, Text, View} from "@tarojs/components";
import Clocker from 'clocker-js/Clocker';
import Collapse from "../../components/collapse";
import Taro from "@tarojs/taro";
import {connect} from "react-redux";
import classNames from "classnames";
import LoginView from "../../components/login";
import PageLoading from "../../components/pageloading";
import md5 from 'blueimp-md5';
import FallbackImage from "../../components/FallbackImage";
import moment from "moment";
import Modal from "../../components/modal";

const numeral = require('numeral');

// @ts-ignore
@connect((state: any) => (
    {
        systemInfo: state.context.systemInfo,
        settings: state.context.settings,
        context: state.context
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
    }
    clocker: any;
    timer: any;
    socket: any;
    randomStr: string;

    constructor(props) {
        super(props);
        this.onShareAppMessage = this.onShareAppMessage.bind(this);
        this.onShareTimeline = this.onShareTimeline.bind(this);
        this.toggleFollow = this.toggleFollow.bind(this);
        this.payDeposit = this.payDeposit.bind(this);
        this.offer = this.offer.bind(this);
        this.onMessageReceive = this.onMessageReceive.bind(this);
        this.randomStr = utils.randomString(6);
    }


    componentDidMount() {

    }

    // @ts-ignore
    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
        if(prevProps.context.userInfo == null || prevState.goods == null) {
            const {context} = this.props;
            const {userInfo} = context;
            let {goods} = this.state;
            if(userInfo != null && goods) {
                //记录浏览记录
                request.post('/paimai/api/members/views', null, {params: {id: this.state.id}}).then(res => {
                    console.log(res.data.result);
                });
                //查询是否关注
                request.get('/paimai/api/members/isfollow', {params: {id: this.state.id}}).then(res => {
                    goods.followed = res.data.result;
                    this.setState({goods: goods});
                });
                //查询出价记录
                request.get('/paimai/api/goods/offers', {params: {id: goods.id, pageSize: 3}}).then(res=>{
                    this.setState({offers: res.data.result.records});
                });
                //查询是否需要缴纳保证金
                request.get('/paimai/api/members/deposited', {params: {id: this.state.id}}).then(res => {
                    goods.deposited = res.data.result;
                    this.setState({goods: goods});
                    if(goods.deposited) {
                        //需要出价的时候再连接websocket
                        connectWebSocketServer('/auction/websocket/' + goods.id + '/' + userInfo.id).then(res => {
                            this.socket = res;
                            this.socket.onMessage(this.onMessageReceive);
                        });
                    }
                });
            }
        }
    }

    onMessageReceive(message:any) {
        const {context} = this.props;
        const {userInfo} = context;
        let {goods} = this.state;
        const messageSessionId = md5(goods.id+':'+userInfo.id+':'+this.randomStr);
        let msg = JSON.parse(message.data);

        //如果是自身产生的消息则忽略
        if(msg.id === messageSessionId) {
            return;
        }
        switch (msg.type) {
            case 'MSG_TYPE_OFFER':
                goods.currentPrice = parseFloat(msg.price).toFixed(2);
                this.setState({goods: goods});
                this.nextPrice(goods);
                let offers = this.state.offers;
                if(offers.length >=3 ) {
                    offers.pop();
                    offers.unshif(
                        msg.map(m => ({
                            memberAvatar: m.memberAvatar,
                            memberName: m.memberName,
                            memberId: m.memberId,
                            price: m.price,
                            offerTime: m.createTime
                        }))
                    );
                }
                this.setState({offers: [...offers]});
                break;
            case 'MSG_TYPE_DELAY':
                goods.actualEndTime = msg.newTime;
                this.setState({goods: goods});
                //更新计时器
                this.clocker.targetDate = msg.newTime;
                break;
        }
    }

    payDeposit() {
        this.setState({posting: true});
        //支付宝保证金
        request.post('/paimai/api/members/deposits', null, {params: {id: this.state.id}}).then(res=>{
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
            }).catch(()=>this.setState({posting: false}));
        })
    }

    offer() {
        const {context} = this.props;
        const {userInfo} = context;
        const {goods} = this.state;
        this.setState({posting: true});
        //出价
        request.post('/paimai/api/members/offers', {id: goods.id, price: this.state.nextPrice, randomStr: this.randomStr}).then(res=>{
            if(res.data.success) {
                this.setState({posting: false});
                utils.showSuccess(false, '出价成功');
                goods.currentPrice = this.state.nextPrice;
                let offers = this.state.offers;
                if(offers.length >= 3) {
                    offers.pop();
                    offers.unshift({
                        memberAvatar: userInfo.avatar,
                        memberId: userInfo.id,
                        memberName: userInfo.phone || userInfo.realname,
                        price: this.state.nextPrice,
                        offerTime: moment(new Date()).format('yyyy-MM-dd HH:mm:ss'),
                    });
                }
                this.setState({offers: [...offers]});
                this.nextPrice(goods);
                //出价成功加入队列
            }
        })
    }
    nextPrice(newGoods) {
        let goods = newGoods;
        let upgradeConfig = goods.uprange;
        if(!goods.currentPrice) {
            //说明没有人出价，第一次出价可以以起拍价出价
            this.setState({nextPrice:goods.startPrice, goods: goods});
            return;
        }
        let currentPrice = parseFloat(goods.currentPrice);

        let rangePirce = 0;
        for (let i = 0; i < upgradeConfig.length; i++) {
            let config = upgradeConfig[i];
            let min = parseFloat(config.min);
            let price = parseFloat(config.price);
            if(currentPrice >= min) {
                rangePirce = price;
            }
        }
        this.setState({nextPrice:currentPrice + rangePirce, goods: goods});
    }

    onLoad(options) {
        utils.showLoading();
        this.setState({id: options.id});
        request.get("/paimai/api/goods/detail", {params: {id: options.id}}).then(res => {
            let data = res.data.result;
            data.fields = JSON.parse(data.fields || '[]');
            data.uprange = JSON.parse(data.uprange);
            this.nextPrice(data);
            let endDate = new Date(data.actualEndTime || data.endTime);
            this.clocker = new Clocker(endDate);
            this.clocker.countDown = true;
            utils.hideLoading();
            if (this.clocker.isCounting) {
                this.timer = setInterval(() => {
                    if (this.clocker.isCounting) {
                        this.setState({counting: this.clocker.isCounting});
                    } else {
                        clearInterval(this.timer);
                    }
                }, 1000);
            }
        });
    }

    onShareTimeline() {
        return {
            title: this.state.goods?.title,
        }
    }

    onShareAppMessage() {
        return {
            title: this.state.goods?.title,
            path: '/pages/goods/detail?id=' + this.state.id
        }
    }

    toggleFollow() {
        request.put('/paimai/api/members/follow/toggle', {id: this.state.id}).then(res => {
            let goods = this.state.goods;
            goods.followed = res.data.result;
            this.setState({goods: goods});
        });
    }

    renderButton() {
        const {goods} = this.state;
        if(!this.clocker.isCounting) {
            //拍品结束
            return (
                <View>
                    <Button className={'btn w-56'} disabled={true}>
                        <View>已结束</View>
                    </Button>
                </View>
            );
        }
        if(!goods.deposit || goods.deposited) {
            return (
                <View>
                    <Button disabled={this.state.posting} className={'btn btn-danger w-56'} onClick={this.offer}>
                        <View>出价</View>
                        <View>RMB {numeral(this.state.nextPrice).format('0,0.00')}</View>
                    </Button>
                </View>
            );
        }
        else {
            return (
                <View>
                    <Button disabled={this.state.posting} className={'btn btn-primary w-56'} onClick={this.payDeposit}>
                        <View>交保证金</View>
                        <View>RMB {numeral(goods.performanceDeposit||goods.deposit).format('0,0.00')}</View>
                    </Button>
                </View>
            );
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer);
        this.socket?.close();
    }

    render() {
        const {goods} = this.state;
        const {systemInfo} = this.props;
        if (goods == null) return <PageLoading />;

        const images: CustomSwiperItem[] = goods.images.split(',').map((item, index) => {
            return {id: index, url: '#', image: item};
        });
        let safeBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom;
        if (safeBottom > 10) safeBottom -= 10;

        return (
            <PageLayout statusBarProps={{title: '商品详情'}}>
                <CustomSwiper list={images} imageMode={'heightFix'} radius={'0'}/>
                <View className={'grid bg-white grid-cols-1 px-4 divide-y divide-gray-200'}>
                    <View className={'space-y-4 py-4'}>
                        <View className={'flex justify-between items-center'}>
                            <View className={'space-y-2'}>
                                <View className={'font-bold text-xl'}>
                                    {goods.title}
                                </View>
                                <View className={'text-gray-400'}>
                                    {goods.subTitle}
                                </View>
                                <View className={'text-gray-600 mt-2'}>
                                    一口价 <Text className={'text-sm text-red-500 font-bold'}>RMB</Text> <Text
                                    className={'text-lg text-red-500 font-bold'}>{numeral(goods.startPrice).format('0,0.00')}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View className={'bg-white p-4 mt-4'}>
                    <View className={'font-bold'}>商品详情</View>
                    <View>
                        <RichText nodes={goods.description}/>
                    </View>
                </View>

                <View style={{height: Taro.pxTransform(124)}}/>

                <LoginView>
                    <View className={'bg-white px-4 pt-1 flex items-center justify-between fixed bottom-0 w-full'}
                          style={{paddingBottom: safeBottom}}>
                        <View>
                            <Button openType={'share'} plain={true} className={'block flex flex-col items-center'}>
                                <View className={'iconfont icon-fenxiang text-lg'}/>
                                <View>分享</View>
                            </Button>
                        </View>
                        <View>
                            <Button openType={'contact'} plain={true} className={'block flex flex-col items-center'}>
                                <View className={'iconfont icon-lianxikefu text-xl'}/>
                                <View>客服</View>
                            </Button>
                        </View>
                        <View onClick={this.toggleFollow}
                              className={classNames('flex flex-col items-center space-y-1', goods.followed ? 'text-red-500' : '')}>
                            <View className={classNames('iconfont icon-31guanzhu1 text-xl')}/>
                            <View>关注</View>
                        </View>
                        {this.renderButton()}
                    </View>
                </LoginView>
            </PageLayout>
        );
    }
}
