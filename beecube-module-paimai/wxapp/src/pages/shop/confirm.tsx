import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request from "../../lib/request";
import Taro from "@tarojs/taro";
import {Button, Input, Navigator, Text, View} from "@tarojs/components";
import {Button as TaroifyButton, ConfigProvider, Popup, Radio, Tabs} from '@taroify/core';
import {connect} from "react-redux";
import FallbackImage from "../../components/FallbackImage";
import utils from "../../lib/utils";
import './confirm.scss';
import {setUserInfo} from "../../store/actions";

const numeral = require('numeral');
// @ts-ignore
@connect((state: any) => (
    {
        systemInfo: state.context.systemInfo,
        settings: state.context.settings,
        context: state.context
    }
), (dispatch) => {
    return {
        updateUserInfo(userInfo) {
            dispatch(setUserInfo(userInfo));
        }
    }
})
export default class Index extends Component<any, any> {
    state: any = {
        id: null,
        goodsList: [],
        address: null,
        posting: false,
        openCoupon: false,
        openIntegral: false,
        coupons: null,
        postOrderInfo: {useIntegral: 0, ticketId: null, payedPrice: 0, goodsList: null, ticketAmount: 0, address: null, payType: 1},
        selectedTicketId: null,
        payType: 1,
        openNetPay: false,
        openUploadPay: false,
        banks: [],
        file: null,
        note: '',
    }

    constructor(props) {
        super(props);
        this.pay = this.pay.bind(this);
        this.openCoupon = this.openCoupon.bind(this);
        this.useCoupon = this.useCoupon.bind(this);
        this.handleSelectCoupon = this.handleSelectCoupon.bind(this);
        this.fetchPrice = this.fetchPrice.bind(this);
        this.openIntegral = this.openIntegral.bind(this);
        this.handleIntegralChange = this.handleIntegralChange.bind(this);
        this.handlePayTypeChanged = this.handlePayTypeChanged.bind(this);
        this.confirmNetPay = this.confirmNetPay.bind(this);
        this.copyBank = this.copyBank.bind(this);
        this.handleNoteChanged = this.handleNoteChanged.bind(this);
        this.subscribeMessage = this.subscribeMessage.bind(this);
    }

    copyBank(bank) {
        let data = `${bank.bankName} ${bank.bankAddress} ${bank.bankCode}`;
        Taro.setClipboardData({data: data}).then(()=>{
            utils.showSuccess(false, '复制成功');
        }).catch(()=>{
            utils.showError('复制失败');
        });
    }

    onLoad(options) {
        if (options.id) {
            //如果是有ID的情况说明是立即购买则从远程服务器获取商品信息
            this.setState({id: options.id});
            request.get('/paimai/api/goods/detail', {params: {id: options.id}}).then(res => {
                res.data.result.count = 1;
                this.state.goodsList.push(res.data.result);
                this.state.postOrderInfo.goodsList = this.state.goodsList;
                this.setState({goodsList: this.state.goodsList, postOrderInfo: this.state.postOrderInfo});
                this.fetchPrice(this.state.postOrderInfo);
                //获取可用的优惠券
                request.put('/paimai/api/orders/coupons', this.state.postOrderInfo).then(res => {
                    this.setState({coupons: res.data.result});
                });
            });
        } else {
            //从购物车获取商品信息
            let cart = JSON.parse(Taro.getStorageSync("CART") || '[]');
            let goodsList = cart.filter(item => item.selected);
            this.state.postOrderInfo.goodsList = goodsList;
            this.setState({goodsList: goodsList, postOrderInfo: this.state.postOrderInfo});
            this.fetchPrice(this.state.postOrderInfo);
            //获取可用的优惠券
            request.put('/paimai/api/orders/coupons', this.state.postOrderInfo).then(res => {
                this.setState({coupons: res.data.result});
            });
        }

        //加载银行信息
        request.get('/paimai/api/banks').then(res => {
            this.setState({banks: res.data.result});
        });
    }

    fetchPrice(postOrderInfo: any) {
        request.put('/paimai/api/orders/price/calc', postOrderInfo).then(res => {
            this.setState({postOrderInfo: res.data.result});
        });
    }

    handleSelectCoupon(value: string) {
        this.setState({selectedTicketId: value});
    }

    handleNoteChanged(e) {
        this.setState({note: e.detail.value});
    }
    handleIntegralChange(value) {
        const postOrderInfo = this.state.postOrderInfo;
        if (value == '1') {
            postOrderInfo.useIntegral = this.calcAvailableIntegral;
        } else {
            //不使用积分
            postOrderInfo.useIntegral = 0;
        }
        this.setState({postOrderInfo: postOrderInfo});
        this.fetchPrice(postOrderInfo);
    }

    useCoupon() {
        const postOrderInfo = this.state.postOrderInfo;
        postOrderInfo.ticketId = this.state.selectedTicketId;
        this.setState({postOrderInfo: postOrderInfo, openCoupon: false});
        this.fetchPrice(postOrderInfo);
    }

    openIntegral() {
        this.setState({openIntegral: true});
        request.get('/app/api/members/profile').then(res => {
            this.props.updateUserInfo(res.data.result);
        });
    }

    openCoupon() {
        //获取用户可用优惠券
        const postOrderInfo = this.state.postOrderInfo;
        postOrderInfo.goodsList = this.state.goodsList;
        this.setState({postOrderInfo: postOrderInfo});
        request.put('/paimai/api/orders/coupons', postOrderInfo).then(res => {
            this.setState({coupons: res.data.result});
        });
        this.setState({openCoupon: true});
    }

    componentDidShow() {
        Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: 'transparent'}).then();
        //获取用户默认地址, 优先读取本地存储的地址信息，没有则读取远程服务器信息
        const address = Taro.getStorageSync('ADDRESS');
        if (address) {
            this.setState({address: JSON.parse(address)});
        } else {
            request.get('/app/api/members/addresses/default', {params: {id: ''}}).then(res => {
                this.setState({address: res.data.result});
            })
        }
    }

    async subscribeMessage() {
        const settings = this.props.settings;
        if(settings.orderNotPayTemplateId || settings.orderDeliveryTemplateId) {
            await Taro.requestSubscribeMessage({tmplIds: [settings.orderNotPayTemplateId, settings.orderDeliveryTemplateId]});
        }
        return true;
    }

    async confirmNetPay() {
        const subs = await this.subscribeMessage();
        if(!subs) return;

        this.setState({posting: true});
        utils.showLoading('订单提交中');
        let data = this.state.postOrderInfo;
        data.payType = parseInt(this.state.payType);
        data.address = this.state.address;
        data.payedPrice = parseFloat(data.payedPrice).toFixed(2);
        data.note = this.state.note;


        request.post('/paimai/api/members/goods/buy', data).then(res => {
            let data = res.data.result;
            if(data) {
                //支付已经完成，提醒支付成功并返回上一页面
                Taro.showToast({title: '下单成功', duration: 2000}).then(() => {
                    //清空购物车
                    let cart = JSON.parse(Taro.getStorageSync("CART"));
                    let newCart: any[] = [];
                    cart.forEach((item: any) => {
                        this.state.goodsList.forEach(g => {
                            if (item.id != g.id) {
                                newCart.push(item);
                            }
                        });
                    });
                    Taro.setStorageSync("CART", JSON.stringify(newCart));
                    setTimeout(() => {
                        utils.hideLoading();
                        Taro.navigateBack().then();
                    }, 2000);
                });
                this.setState({posting: false});
            }
        });
    }
    handlePayTypeChanged(value) {
        this.setState({payType: value});
    }

    async pay() {
        const subs = await this.subscribeMessage();
        if(!subs) return;
        this.setState({posting: true});
        let data = this.state.postOrderInfo;
        data.payType = parseInt(this.state.payType);
        data.address = this.state.address;
        data.payedPrice = parseFloat(data.payedPrice).toFixed(2);
        data.note = this.state.note;

        if (data.payType == 1) {
            utils.showLoading('发起支付中');
            //发起支付
            request.post('/paimai/api/members/goods/buy', data).then(res => {
                let data = res.data.result;
                data.package = data.packageValue;
                Taro.requestPayment(data).then(() => {
                    //支付已经完成，提醒支付成功并返回上一页面
                    Taro.showToast({title: '支付成功', duration: 2000}).then(() => {
                        //清空购物车
                        let cart = JSON.parse(Taro.getStorageSync("CART"));
                        let newCart: any[] = [];
                        cart.forEach((item: any) => {
                            this.state.goodsList.forEach(g => {
                                if (item.id != g.id) {
                                    newCart.push(item);
                                }
                            });
                        });
                        Taro.setStorageSync("CART", JSON.stringify(newCart));
                        setTimeout(() => {
                            utils.hideLoading();
                            Taro.navigateBack().then();
                        }, 2000);
                    });
                    this.setState({posting: false});
                }).catch(() => {
                    this.setState({posting: false})
                    setTimeout(() => {
                        utils.showError('取消支付');
                        Taro.navigateBack().then();
                    }, 2000);
                });
            })
        } else {
            //网银支付
            this.setState({openNetPay: true});
        }
    }

    get calcCartPrice() {
        return this.state.postOrderInfo.payedPrice;
    }

    get totalPrice() {
        if (this.state.goodsList.length == 0) {
            return 0;
        }
        return this.state.goodsList.map(item => item.startPrice * item.count).reduce((n, m) => n + m);
    }

    get calcAvailableIntegral() {
        const integralRatio = parseInt(this.props.settings.integralRatio) || 100;
        const userInfo = this.props.context.userInfo;
        //计算商品可抵扣的总金额
        let totalIntegralPrice = 0;
        this.state.goodsList.forEach(g => {
            if (g.maxIntegralPercent) {
                totalIntegralPrice += g.startPrice * g.maxIntegralPercent / 100 * g.count;
            }
        });
        let integral = Math.min(totalIntegralPrice * integralRatio, userInfo.score);
        return integral / integralRatio;
    }

    render() {
        const {systemInfo, context, settings} = this.props;
        const {userInfo} = context;
        const {goodsList, address, openCoupon, coupons, postOrderInfo, openIntegral, openNetPay, banks} = this.state;
        const integralRatio = parseInt(settings.integralRatio) || 100;
        let safeBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom;
        if (safeBottom > 10) safeBottom -= 10;
        const barTop = systemInfo.statusBarHeight;
        const menuButtonInfo = Taro.getMenuButtonBoundingClientRect();
        // 获取导航栏高度
        const barHeight = menuButtonInfo.height + (menuButtonInfo.top - barTop) * 2;


        return (
            <PageLayout showStatusBar={false}>
                <View className={'px-4 flex flex-col relative head-bg'} style={{paddingTop: barTop}}>
                    <View className={'flex items-center justify-center text-lg relative text-white'} style={{height: barHeight}}>
                        确认订单
                        <Text className={'fa fa-chevron-left absolute left-0'} onClick={() => utils.navigateBack()}/>
                    </View>
                    <View className={'bg-white p-4 rounded-lg mt-6'}>
                        <View className={'font-bold text-lg item-title mb-2'}>收货地址</View>
                        <Navigator url={'/pages/my/addresses'} className={'flex items-center justify-between'}>
                            <View className={'flex-1 space-y-2'}>
                                <View className={'font-bold space-x-2'}>
                                    <Text className={'text-lg'}>{address?.username}</Text><Text>{address?.phone}</Text>
                                </View>
                                <View className={'text-gray-400'}>{address?.address}</View>
                            </View>
                            <View className={'px-2'}>
                                <Text className={'fa fa-chevron-right'}/>
                            </View>
                        </Navigator>
                    </View>
                </View>
                <View className={'p-4 m-4 rounded-lg bg-white space-y-4'}>
                    <View className={'font-bold text-lg item-title'}>商品信息</View>
                    {goodsList.map((item) => {
                        return (
                            <View className={'relative py-4 overflow-hidden flex items-center text-lg'}>
                                <View className={'flex-1 flex space-x-2'}>
                                    <FallbackImage mode={'aspectFill'} src={utils.resolveUrl(item.images.split(',')[0])}
                                                   style={{width: Taro.pxTransform(60), height: Taro.pxTransform(60)}}/>
                                    <View className={'flex flex-col justify-between'}>
                                        <View className={'font-bold'}>{item.title}</View>
                                        <View className={'text-red-500 font-bold'}>￥{numeral(item.startPrice).format('0,0.00')}</View>
                                    </View>
                                </View>
                                <View className={'w-20 flex items-center justify-center'}> X {item.count} </View>
                            </View>
                        );
                    })}
                    <View className={'flex justify-between items-center'}>
                        <View className={'font-bold'}>售后免邮</View>
                        <View className={'text-stone-400'}>官方赠送</View>
                    </View>
                    <View className={'flex justify-between items-center'}>
                        <View className={'font-bold'}>配送方式</View>
                        <View className={'text-stone-400'}>快递配送</View>
                    </View>
                    <View className={'flex items-center'}>
                        <View className={'font-bold'}>买家留言</View>
                        <View className={'ml-4'}><Input placeholder={'请填写内容与平台确认，限制50字以内'} onInput={this.handleNoteChanged} /></View>
                    </View>
                </View>
                <View className={'p-4 m-4 rounded-lg bg-white space-y-4'}>
                    <View className={'font-bold text-lg item-title'}>结算信息</View>
                    <View className={'flex items-center justify-between'}>
                        <View className={'font-bold'}>商品总价</View>
                        <View>￥{numeral(this.totalPrice).format('0,0.00')}</View>
                    </View>
                    <View className={'flex items-center justify-between'} onClick={this.openCoupon}>
                        <View className={'font-bold'}>优惠券</View>
                        <View className={'space-x-2'}>
                            {postOrderInfo.ticketAmount > 0 && <Text className={'text-red-600'}>-￥{numeral(postOrderInfo.ticketAmount).format('0,0.00')}</Text>}
                            {(postOrderInfo.ticketAmount == 0 && coupons?.available.length > 0) && <Text className={'text-red-600'}>{coupons.available.length}张</Text>}
                            {(postOrderInfo.ticketAmount == 0 && !coupons?.available.length) && <Text className={'text-stone-400'}>无可用优惠券</Text>}
                            <Text className={'fa fa-angle-right text-stone-400'}/>
                        </View>
                    </View>
                    <View className={'flex items-center justify-between'} onClick={this.openIntegral}>
                        <View className={'font-bold'}>积分</View>
                        <View className={'space-x-2'}>
                            {(userInfo.score > 0 && postOrderInfo.useIntegral > 0) && <Text className={'text-red-600'}>-￥{postOrderInfo.useIntegral}</Text>}
                            {(userInfo.score > 0 && postOrderInfo.useIntegral <= 0) && <Text className={'text-red-600'}>有可用积分</Text>}
                            {userInfo.score <= 0 && <Text className={'text-stone-400'}>无可用积分</Text>}
                            <Text className={'fa fa-angle-right text-stone-400'}/>
                        </View>
                    </View>
                    <View className={'flex items-center justify-between'}>
                        <View className={'font-bold'}>运费</View>
                        <View className={''}>+ ￥{numeral(postOrderInfo.deliveryPrice).format('0,0.00')}</View>
                    </View>
                    <View className={'flex items-center justify-between'}>
                        <View className={'font-bold'}>支付方式</View>
                        <View className={'space-x-2 text-sm'}>
                            <Radio.Group defaultValue={'1'} direction={'horizontal'} size={14} className={'radio-red-color'} onChange={this.handlePayTypeChanged}>
                                <Radio name={'1'}>微信支付</Radio>
                                <Radio name={'2'}>网银转账</Radio>
                            </Radio.Group>
                        </View>
                    </View>
                </View>

                <View style={{height: Taro.pxTransform(124)}}/>
                <View className={'bg-white flex items-center fixed px-4 py-2 w-full bottom-0'} style={{paddingBottom: Taro.pxTransform(safeBottom)}}>
                    <View className={'flex-1 flex items-center'}>
                        <Text className={'ml-4 font-bold'}>总计：</Text>
                        <Text className={'text-red-500 font-bold text-xl'}>￥{numeral(this.calcCartPrice).format('0,0.00')}</Text>
                    </View>
                    <View>
                        <Button disabled={this.calcCartPrice <= 0 || this.state.posting} className={'btn btn-danger'} onClick={this.pay}>
                            {this.state.payType == 1 ? '立即支付' : '立即下单'}
                        </Button>
                    </View>
                </View>


                {/*优惠券*/}
                <ConfigProvider theme={{
                    tabsNavBackgroundColor: 'transparent',
                }}>
                    <Popup style={{height: 530}} className={'!bg-gray-100'} open={openCoupon} rounded placement={'bottom'} onClose={() => this.setState({openCoupon: false})}>
                        <View className={'text-2xl sticky top-0 !bg-gray-100 z-100'}>
                            <View className={'flex py-4 items-center justify-center text-xl font-bold'}>优惠券</View>
                            <Popup.Close/>
                        </View>
                        <Tabs sticky defaultValue={'available'}>
                            <Tabs.TabPane value={'available'} title={'可用优惠券'}>
                                <View className={'m-4'} style={{paddingBottom: 80}}>
                                    <Radio.Group className={'space-y-4'} onChange={this.handleSelectCoupon}>
                                        {coupons?.available.map((item: any) => {
                                            return (
                                                <View>
                                                    <View className={'text-white flex'}>
                                                        <View className={'flex flex-col items-center justify-center rounded-t-lg bg-red-700 flex-none'}
                                                              style={{width: 100, height: 80}}>
                                                            <View className={'font-bold'}>
                                                                <Text>￥</Text>
                                                                <Text className={'text-4xl'}>
                                                                    {item.coupon.amount}
                                                                </Text>
                                                            </View>
                                                            <View className={'text-sm text-gray-400'}>满{item.coupon.minPrice}可用</View>
                                                        </View>
                                                        <View className={'rounded-t-lg bg-red-700 flex-1 flex items-center px-4'}>
                                                            <View className={'flex-1'}>
                                                                <View className={'text-white font-bold text-lg'}>{item.coupon.title}</View>
                                                                <View className={'text-sm text-gray-400 mt-2'}>有效期至{item.endTime}</View>
                                                            </View>
                                                            <View className={'w-10'}><Radio className={'radio-red-color'} name={item.id}/></View>
                                                        </View>
                                                    </View>
                                                    <View className={'bg-white text-cut rounded-b-lg p-4 text-stone-400'}>
                                                        {item.coupon.description}
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </Radio.Group>
                                    <View className={'my-4'}><TaroifyButton color={'danger'} onClick={this.useCoupon} block>确定</TaroifyButton></View>
                                </View>
                            </Tabs.TabPane>
                            <Tabs.TabPane value={'unAvailable'} title={`不可用优惠券(${coupons?.unAvailable.length})`}>
                                <View className={'m-4'} style={{paddingBottom: 80}}>
                                    <Radio.Group className={'space-y-4'}>
                                        {coupons?.unAvailable.map((item: any) => {
                                            return (
                                                <View style={{filter: 'grayscale(100%)'}}>
                                                    <View className={'text-white flex'}>
                                                        <View className={'flex flex-col items-center justify-center rounded-t-lg bg-red-700 flex-none'}
                                                              style={{width: 100, height: 80}}>
                                                            <View className={'font-bold'}>
                                                                <Text>￥</Text>
                                                                <Text className={'text-4xl'}>
                                                                    {item.coupon.amount}
                                                                </Text>
                                                            </View>
                                                            <View className={'text-sm text-gray-400'}>满{item.coupon.minPrice}可用</View>
                                                        </View>
                                                        <View className={'rounded-t-lg bg-red-700 flex-1 flex items-center px-4'}>
                                                            <View className={'flex-1'}>
                                                                <View className={'text-white font-bold text-lg'}>{item.coupon.title}</View>
                                                                <View className={'text-sm text-gray-400 mt-2'}>有效期至{item.endTime}</View>
                                                            </View>
                                                            <View className={'w-10'}><Radio disabled name={item.id}/></View>
                                                        </View>
                                                    </View>
                                                    <View className={'bg-white text-cut rounded-b-lg p-4 text-stone-400'}>
                                                        {item.coupon.description}
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </Radio.Group>
                                </View>
                            </Tabs.TabPane>
                        </Tabs>
                    </Popup>
                </ConfigProvider>


                {/*积分*/}
                <ConfigProvider theme={{
                    tabsNavBackgroundColor: 'transparent',
                }}>
                    <Popup style={{height: 330}} className={'!bg-gray-100'} open={openIntegral} rounded placement={'bottom'} onClose={() => this.setState({openIntegral: false})}>
                        <View className={'text-2xl'}>
                            <View className={'flex py-4 items-center justify-center text-xl font-bold'}>积分抵扣</View>
                            <Popup.Close/>
                        </View>
                        <View className={'px-4 space-y-4 flex flex-col justify-between'} style={{paddingBottom: 84}}>
                            <Radio.Group defaultValue={"0"} onChange={this.handleIntegralChange}>
                                <Radio className={'radio-red-color'} name={'1'} disabled={userInfo.score <= 0}>
                                    当前有<Text className={'text-red-600'}>{userInfo.score}</Text>积分，
                                    消耗<Text className={'text-red-600'}>{this.calcAvailableIntegral * integralRatio}</Text>积分，
                                    可抵扣<Text className={'text-red-600'}>{this.calcAvailableIntegral}</Text>元
                                </Radio>
                                <Radio className={'radio-red-color'} name={'0'}>不使用积分抵扣</Radio>
                            </Radio.Group>
                        </View>
                    </Popup>
                </ConfigProvider>


                <Popup style={{height: 330}} className={'!bg-gray-100'} open={openNetPay} rounded placement={'bottom'} onClose={() => this.setState({openNetPay: false})}>
                    <View className={'text-2xl'}>
                        <View className={'flex py-4 items-center justify-center text-xl font-bold'}>网银转账</View>
                        <Popup.Close/>
                    </View>
                    <View className={'px-4 space-y-4 flex flex-col justify-between'} style={{paddingBottom: 84}}>
                        <View className={'font-bold text-lg'}>平台对公银行账户:</View>
                        <View className={'divide-y'}>
                            {banks.map((item: any) => {
                                return (
                                    <View className={'flex'}>
                                        <View className={'flex-1 space-y-2'}>
                                            <View>{item.bankName}</View>
                                            <View>{item.bankAddress}</View>
                                            <View>{item.bankCode}</View>
                                        </View>
                                        <View className={'flex-none'}><Button className={'btn btn-sm btn-outline'} onClick={()=>this.copyBank(item)}>复制</Button></View>
                                    </View>
                                );
                            })}
                        </View>
                        <View><TaroifyButton color={'danger'} block onClick={this.confirmNetPay}>确认下单</TaroifyButton></View>
                    </View>
                </Popup>



            </PageLayout>
        );
    }
}
