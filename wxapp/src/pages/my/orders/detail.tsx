import {Component} from "react";
import {Button, Navigator, Text, View} from "@tarojs/components";
import {connect} from "react-redux";
import PageLayout from "../../../layouts/PageLayout";
import LoginView from "../../../components/login";
import PageLoading from "../../../components/pageloading";
import utils from "../../../lib/utils";
import request from "../../../lib/request";
import FallbackImage from "../../../components/FallbackImage";

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
        detail: null,
        posting: false,
    }

    constructor(props) {
        super(props);
        this.pay= this.pay.bind(this);
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
            utils.hideLoading();
            this.setState({detail: data});
        });
    }





    pay() {
    }


    renderButton() {
        return (
            <View className={'flex items-center space-x-2'}>
                <Button disabled={this.state.posting} className={'btn btn-primary'} onClick={this.pay}>
                    <View>立即支付</View>
                </Button>
            </View>
        );
    }

    componentWillUnmount() {

    }

    render() {
        const {detail} = this.state;
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
                        {detail.orderGoods.map((item:any)=>{
                            return (
                                <View className={'flex space-x-2 items-center'}>
                                    <View className={'flex-none'}>
                                        <FallbackImage style={{width: 50, height: 50}} className={'rounded block'} src={utils.resolveUrl(item.goodsImage)}/>
                                    </View>
                                    <View className={'flex-1'}>
                                        <View>{item.goodsName}</View>
                                        <View>{numeral(item.goodsPrice).format('0,0.00')} X {item.goodsCount}</View>
                                    </View>
                                    <View className={'font-bold'}>￥{numeral(item.goodsPrice * item.goodsCount).format('0,0.00')}</View>
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
                                        <Text className={'text-lg'}>{detail?.username}</Text><Text>{detail?.phone}</Text>
                                    </View>
                                    <View className={'text-gray-400'}>{detail?.province} {detail?.city} {detail?.district} {detail?.address}</View>
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
                                <View>{detail.type_dictText}</View>
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
                                <View>{detail.status_dictText}</View>
                            </View>
                        </View>
                    </View>


                </View>
                <LoginView>
                    <View className={'bg-white px-4 pt-1 flex items-center justify-end fixed bottom-0 w-full'}
                          style={{paddingBottom: safeBottom}}>
                        {this.renderButton()}
                    </View>
                </LoginView>
            </PageLayout>
        );
    }
}
