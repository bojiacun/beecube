import {Component} from "react";
import {Button, Navigator, Text, View} from "@tarojs/components";
import {connect} from "react-redux";
import PageLayout from "../../../layouts/PageLayout";
import PageLoading from "../../../components/pageloading";
import utils from "../../../lib/utils";
import request from "../../../lib/request";
import FallbackImage from "../../../components/FallbackImage";
import Taro from "@tarojs/taro";

const numeral = require('numeral');

const ORDER_TYPES = {
    '1': '拍卖订单',
    '2': '一口价订单'
}
const ORDER_STATUS = {
    '0': '待支付',
    '1': '待发货',
    '2': '待收货',
    '3': '已完成',
    '4': '申请售后',
}

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
        detail: null,
        posting: false,
        address: null
    }

    constructor(props) {
        super(props);
        this.pay = this.pay.bind(this);
        this.requestAfter = this.requestAfter.bind(this);
        this.cancel = this.cancel.bind(this);
    }


    componentDidMount() {

    }

    // @ts-ignore
    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {

    }


    onLoad(options) {
        utils.showLoading();
        this.setState({id: options.id});
        request.get("/paimai/api/members/orders/detail", {params: {id: options.id}}).then(res => {
            let data = res.data.result;
            let address = {
                id: data.deliveryId,
                username: data.deliveryUsername,
                phone: data.deliveryPhone,
                address: data.deliveryAddress,
                city: data.deliveryCity,
                district: data.deliveryDistrict,
                province: data.deliveryProvince
            };
            if (address.id) {
                Taro.setStorageSync('ADDRESS', JSON.stringify(address));
            }
            utils.hideLoading();
            this.setState({detail: data});
        });
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
        if (!this.state.address) {
            return utils.showError("请选择收货地址");
        }

        this.setState({posting: true});
        //支付宝保证金
        request.post('/paimai/api/members/orders/pay', null, {params: {id: this.state.detail.id}}).then(res => {
            let data = res.data.result;
            data.package = data.packageValue;
            Taro.requestPayment(data).then(() => {
                //支付已经完成，提醒支付成功并返回上一页面
                this.setState({posting: false});
                utils.showSuccess(true, '支付成功');
            }).catch(() => this.setState({posting: false}));
        });
    }

    cancel() {
        request.post('/paimai/api/members/orders/cancel', null, {params: {id: this.state.detail.id}}).then(res => {
            let result = res.data.result;
            if (result) {
                utils.showSuccess(true, "取消成功");
            } else {
                utils.showMessage("取消失败");
            }
        });
    }

    requestAfter() {
        Taro.navigateTo({url: 'after'}).then();
    }


    renderButton() {
        const {detail} = this.state;
        switch (detail.status) {
            case 0:
                return (
                    <View className={'flex items-center space-x-2'}>
                        <Button disabled={this.state.posting} className={'btn btn-primary'} onClick={this.pay}>
                            <View>立即支付</View>
                        </Button>
                    </View>
                );
                break;
            case 1:
                return (
                    <View className={'flex items-center space-x-2'}>
                        <Button disabled={this.state.posting} className={'btn btn-outline'} onClick={this.cancel}>
                            <View>取消订单</View>
                        </Button>
                    </View>
                );
                break;
        }
        return <></>
    }

    componentWillUnmount() {

    }

    render() {
        const {detail, address} = this.state;
        const {systemInfo} = this.props;
        if (detail == null) return <PageLoading/>;

        let safeBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom;
        if (safeBottom > 10) safeBottom -= 10;

        return (
            <PageLayout statusBarProps={{title: '订单详情'}}>
                <View className={'space-y-4 p-4'}>
                    <View className={'bg-white p-4 rounded space-y-4'}>
                        <View className={'font-bold'}>商品信息</View>
                        <View className={'space-y-4'}>
                            {detail.orderGoods.map((item: any) => {
                                return (
                                    <View className={'flex space-x-2 items-center'}>
                                        <View className={'flex-none'}>
                                            <FallbackImage style={{width: 50, height: 50}} className={'rounded block'}
                                                           src={utils.resolveUrl(item.goodsImage)}/>
                                        </View>
                                        <View className={'flex-1'}>
                                            <View>{item.goodsName}</View>
                                            <View>{numeral(item.goodsPrice).format('0,0.00')} X {item.goodsCount}</View>
                                        </View>
                                        <View className={'flex flex-col space-y-2 items-center'}>
                                            <View className={'font-bold'}>￥{numeral(item.goodsPrice * item.goodsCount).format('0,0.00')}</View>
                                            {item.isAfter == 0 &&
                                                <Navigator style={{padding: 5, fontSize: 12}} className={'btn btn-outline'}
                                                           url={`after?ogid=${item.id}&oid=${item.orderId}`}>
                                                    <View>申请售后</View>
                                                </Navigator>
                                            }
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                        <View className={'text-right font-bold text-lg'}>总计：￥{numeral(detail.totalPrice).format('0,0.00')}</View>
                    </View>

                    <View className={'bg-white p-4 rounded space-y-4'}>
                        <View className={'font-bold'}>收货信息</View>
                        <View className={'space-y-4'}>
                            <Navigator url={'/pages/my/addresses'} className={'flex items-center justify-between'}>
                                <View className={'flex-1 space-y-2'}>
                                    <View className={'font-bold space-x-2'}>
                                        <Text className={'text-lg'}>{address?.username}</Text><Text>{address?.phone}</Text>
                                    </View>
                                    <View
                                        className={'text-gray-400'}>{address?.province} {address?.city} {address?.district} {address?.address}</View>
                                </View>
                                <View className={'px-2'}>
                                    <Text className={'fa fa-chevron-right'}/>
                                </View>
                            </Navigator>
                        </View>
                    </View>

                    <View className={'bg-white p-4 rounded space-y-4'}>
                        <View className={'font-bold'}>订单信息</View>
                        <View className={'space-y-4'}>
                            <View className={'flex items-center justify-between'}>
                                <View className={'text-gray-400'}>订单类型</View>
                                <View>{ORDER_TYPES[detail.type]}</View>
                            </View>
                            <View className={'flex items-center justify-between'}>
                                <View className={'text-gray-400'}>订单号</View>
                                <View>{detail.id}</View>
                            </View>
                            <View className={'flex items-center justify-between'}>
                                <View className={'text-gray-400'}>下单时间</View>
                                <View>{detail.createTime}</View>
                            </View>
                            <View className={'flex items-center justify-between'}>
                                <View className={'text-gray-400'}>支付时间</View>
                                <View>{detail.payTime}</View>
                            </View>
                            <View className={'flex items-center justify-between'}>
                                <View className={'text-gray-400'}>交易单号</View>
                                <View>{detail.transactionId}</View>
                            </View>
                            <View className={'flex items-center justify-between'}>
                                <View className={'text-gray-400'}>订单状态</View>
                                <View className={'font-bold'}>{ORDER_STATUS[detail.status]}</View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{height: 100}}></View>
                <View className={'bg-white px-4 pt-1 flex items-center justify-end fixed bottom-0 w-full'}
                      style={{paddingBottom: safeBottom}}>
                    {this.renderButton()}
                </View>
            </PageLayout>
        );
    }
}
