import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request, {API_URL, APP_ID} from "../../lib/request";
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
    }
    clocker: any;
    timer: any;
    socket: any;

    constructor(props) {
        super(props);
        this.onShareAppMessage = this.onShareAppMessage.bind(this);
        this.onShareTimeline = this.onShareTimeline.bind(this);
        this.toggleFollow = this.toggleFollow.bind(this);
        this.payDeposit = this.payDeposit.bind(this);
        this.offer = this.offer.bind(this);
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
                //查询是否需要缴纳保证金
                request.get('/paimai/api/members/deposited', {params: {id: this.state.id}}).then(res => {
                    goods.deposited = res.data.result;
                    this.setState({goods: goods});
                });
                request.get('/paimai/api/goods/offers/max', {params: {id: this.state.id}}).then(res=>{
                    goods.currentPrice = res.data.result;
                    this.nextPrice(goods);
                });
                //连接websocket
                const token = Taro.getStorageSync("TOKEN");
                Taro.connectSocket({url: API_URL.replace('https', 'wss')+'/auction/websocket/'+goods.id+'/'+userInfo.id, header: {
                    "X-App-Id": APP_ID,
                        "X-Access-Token": token,
                        "Authorization": token,
                    }}).then(res=>{
                        console.log(res);
                    this.socket = res;
                }).catch(e=>{
                    console.log('websocket连接失败',e);
                    utils.showMessage("消息功能加载失败,无法及时刷新出价信息");
                });
            }
        }
    }

    payDeposit() {
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
            });
        })
    }

    offer() {
        //出价
        request.post('/paimai/api/members/offers', {id: this.state.goods.id, price: this.state.nextPrice}).then(res=>{
            if(res.data.success) {
                utils.showSuccess(false, '出价成功');
                let goods = this.state.goods;
                goods.currentPrice = this.state.nextPrice;
                this.nextPrice(goods);
            }
        })
    }
    nextPrice(newGoods) {
        let goods = newGoods;
        let upgradeConfig = JSON.parse(goods.uprange);
        if(!goods.currentPrice) {
            //说明没有人出价，第一次出价可以以起拍价出价
            return goods.startPrice;
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

            this.setState({goods: data});
            let endDate = new Date(data.endTime);
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
                    <Button className={'btn btn-danger w-56'} onClick={this.offer}>
                        <View>出价</View>
                        <View>RMB {numeral(this.state.nextPrice).format('0,0.00')}</View>
                    </Button>
                </View>
            );
        }
        else {
            return (
                <View>
                    <Button className={'btn btn-primary w-56'} onClick={this.payDeposit}>
                        <View>交保证金</View>
                        <View>RMB {numeral(goods.deposit).format('0,0.00')}</View>
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
            <PageLayout statusBarProps={{title: '拍品详情'}}>
                <CustomSwiper list={images} imageMode={'heightFix'} radius={'0'}/>
                <View className={'p-4 space-y-4 divide-y'}>
                    <View className={'space-y-2'}>
                        <View className={'flex justify-between items-center'}>
                            <View>
                                <View className={'font-bold text-xl'}>
                                    {goods.title}
                                </View>
                                <View className={'text-gray-600 mt-2'}>
                                    起拍价 <Text className={'text-sm text-red-500 font-bold'}>RMB</Text> <Text
                                    className={'text-lg text-red-500 font-bold'}>{numeral(goods.startPrice).format('0,0.00')}</Text>
                                </View>
                            </View>
                            <View className={'flex flex-col items-center text-gray-600'}>
                                <View><Text className={'iconfont icon-daojishi text-3xl'}/></View>
                                <View className={'text-sm'}>结束提醒</View>
                            </View>
                        </View>
                        {this.clocker.isCounting &&
                            <View className={'flex items-center text-sm space-x-1'}>
                                <View className={'border rounded-r-full px-1 border-red-500 border-solid text-red-500'}>竞拍中</View>
                                <View>距结束: <Text className={'text-red-600'}>{numeral(this.clocker.date).format('00')}</Text>天<Text
                                    className={'text-red-600'}>{numeral(this.clocker.hours).format('00')}</Text>小时<Text
                                    className={'text-red-600'}>{numeral(this.clocker.minutes).format('00')}</Text>分<Text
                                    className={'text-red-600'}>{numeral(this.clocker.seconds).format('00')}</Text>秒</View>
                            </View>
                        }
                        {!this.clocker.isCounting &&
                            <View className={'flex items-center text-sm space-x-1'}>
                                <View className={'border rounded-r-full px-1 border-gray-500 border-solid text-gray-500'}>已结束</View>
                                <View>结束时间: {goods.actualEndTime}</View>
                            </View>
                        }
                        <View className={'text-sm text-gray-400 space-x-4'}>
                            <Text>围观{goods.viewCount}人</Text>
                            <Text>出价{goods.offerCount}次</Text>
                        </View>
                    </View>
                    <View>
                        <View className={'py-4 flex justify-between'}>
                            <View className={'font-bold'}>出价记录({goods.offerCount})</View>
                            <Navigator url={`offers?id=${this.state.id}`}>查看全部<Text className={'iconfont icon-youjiantou_huaban'}/></Navigator>
                        </View>
                    </View>
                </View>
                <View className={'bg-white px-4 divide-y'}>
                    <Collapse showArrow={true} title={'拍卖专场'} description={'111'}
                              url={goods.performanceId ? `/pages/performance/detail?id=${goods.performanceId}` : ''}/>
                    <Collapse title={'结束时间'} description={goods.actualEndTime || goods.endTime}/>
                    {goods.fields.map(f => {
                        return <Collapse title={f.key} description={f.value}/>
                    })}
                </View>
                <View className={'p-4'}>
                    <View className={'font-bold'}>拍品描述</View>
                    <View>
                        <RichText nodes={goods.description}/>
                    </View>
                </View>
                <View className={'bg-white px-4 divide-y'}>
                    <Collapse title={'拍卖流程'} showArrow={true}>
                        <RichText nodes={goods.descFlow}/>
                    </Collapse>
                    <Collapse title={'物流运输'} showArrow={true}>
                        <RichText nodes={goods.descDelivery}/>
                    </Collapse>
                    <Collapse title={'注意事项'} showArrow={true}>
                        <RichText nodes={goods.descNotice}/>
                    </Collapse>
                    <Collapse title={'拍卖须知'} showArrow={true}>
                        <RichText nodes={goods.descRead}/>
                    </Collapse>
                    <Collapse title={'保证金说明'} showArrow={true}>
                        <RichText nodes={goods.descDeposit}/>
                    </Collapse>
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
