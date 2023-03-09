import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request from "../../lib/request";
import Taro from "@tarojs/taro";
import {Button, Text, View, Navigator} from "@tarojs/components";
import {connect} from "react-redux";
import FallbackImage from "../../components/FallbackImage";
import utils from "../../lib/utils";

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
        id: null,
        goodsList: [],
        address: null,
        posting: false,
    }

    constructor(props) {
        super(props);
        this.pay = this.pay.bind(this);
    }


    onLoad(options) {
        if (options.id) {
            //如果是有ID的情况说明是立即购买则从远程服务器获取商品信息
            this.setState({id: options.id});
            request.get('/app/api/goods/detail', {params: {id: options.id}}).then(res => {
                res.data.result.count = 1;
                this.state.goodsList.push(res.data.result);
                this.setState({goodsList: this.state.goodsList});
            });
        } else {
            //从购物车获取商品信息
            let cart = JSON.parse(Taro.getStorageSync("CART") || '[]');
            this.setState({goodsList: cart.filter(item => item.selected)});
        }

    }

    componentDidShow() {
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

    pay() {
        this.setState({posting: true});
        utils.showLoading('发起支付中');
        let data = {goodsList: this.state.goodsList, address: this.state.address};
        //支付宝保证金
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
                utils.hideLoading()
            });
        })
    }

    get calcCartPrice() {
        if (this.state.goodsList.length == 0) {
            return 0;
        }
        return this.state.goodsList.map(item => item.startPrice * item.count).reduce((n, m) => n + m);
    }

    render() {
        const {systemInfo} = this.props;
        const {goodsList, address} = this.state;
        let safeBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom;
        if (safeBottom > 10) safeBottom -= 10;

        return (
            <PageLayout statusBarProps={{title: '确认商城订单'}}>
                <View className={'grid grid-cols-1 divide-y divide-gray-100 bg-white'}>
                    <View className={'p-4'}>
                        <View className={'font-bold text-lg'}>选择收货地址</View>
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
                    <View className={'p-4'}>
                        <View className={'font-bold text-lg'}>商品信息</View>
                        {goodsList.map((item) => {
                            return (
                                <View className={'bg-white relative py-4 overflow-hidden flex items-center'}>
                                    <View className={'flex-1 flex space-x-2'}>
                                        <FallbackImage mode={'aspectFit'} src={utils.resolveUrl(item.images.split(',')[0])}
                                                       style={{width: Taro.pxTransform(60), height: Taro.pxTransform(60)}}/>
                                        <View>
                                            <View className={'text-lg'}>{item.title}</View>
                                            <View className={'text-red-500'}>￥{numeral(item.startPrice).format('0,0.00')}</View>
                                        </View>
                                    </View>
                                    <View className={'w-20 flex items-center justify-center'}> X {item.count} </View>
                                </View>
                            );
                        })}
                    </View>

                </View>


                <View style={{height: Taro.pxTransform(124)}}/>
                <View className={'bg-white flex items-center fixed px-4 w-full bottom-0'} style={{paddingBottom: Taro.pxTransform(safeBottom)}}>
                    <View className={'flex-1 flex items-center'}>
                        <Text className={'ml-4 font-bold text-red-500'}>总计：</Text>
                        <Text className={'text-red-500 font-bold text-lg'}>￥{numeral(this.calcCartPrice).format('0,0.00')}</Text>
                    </View>
                    <View>
                        <Button disabled={this.calcCartPrice <= 0 || this.state.posting} className={'btn btn-danger'}
                                onClick={this.pay}>立即支付</Button>
                    </View>
                </View>
            </PageLayout>
        );
    }
}
