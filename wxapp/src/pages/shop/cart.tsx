import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import Taro from "@tarojs/taro";
import {connect} from "react-redux";
import {View, Text, CheckboxGroup, Checkbox, Label} from "@tarojs/components";
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
        cart: [],
    }

    constructor(props) {
        super(props);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }


    componentDidShow() {
        const cartInfo = JSON.parse(Taro.getStorageSync("CART") || '[]');
        this.setState({cart: cartInfo})
    }

    handleAdd(item) {

    }

    handleRemove(item) {

    }

    render() {
        const {systemInfo} = this.props;
        const {cart} = this.state;
        let safeBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom;
        if (safeBottom > 10) safeBottom -= 10;
        return (
            <PageLayout statusBarProps={{title: '商城购物车'}}>
                <CheckboxGroup>
                    <View className={'grid p-4 grid-cols-1 divide-y divide-gray-100'}>
                        {cart.map((item: any) => {
                            return (
                                <View className={'bg-white flex items-center'}>
                                    <View className={'flex-1 flex space-x-2'}>
                                        <FallbackImage mode={'aspectFit'} src={utils.resolveUrl(item.images.split(',')[0])}
                                                       style={{width: Taro.pxTransform(60), height: Taro.pxTransform(60)}}/>
                                        <View>
                                            <View className={'text-lg'}>{item.title}</View>
                                            <View className={'text-red-500'}>￥{numeral(item.startPrice).format('0,0.00')}</View>
                                        </View>
                                    </View>
                                    <View className={'w-12 flex items-center justify-center'}>
                                        <View className={'flex items-center justify-between'}>
                                            <Text className={'fa fa-minus-circle'}/>
                                            <Text>{item.count}</Text>
                                            <Text className={'fa fa-plus-circle'}/>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </CheckboxGroup>

                <View className={'bg-white fixed bottom-0 w-full'} style={{paddingBottom: safeBottom}}>
                    <Checkbox id={'all'} value={'all'} />
                    <Label for={'all'}>全选</Label>
                    <Text>总计：</Text>
                    <Text>￥{numeral(cart.filter(item=>item.selected).map(item=>item.startPrice).reduce((n,m) => n + m)).format('0,0.00')}</Text>
                </View>
            </PageLayout>
        );
    }
}
