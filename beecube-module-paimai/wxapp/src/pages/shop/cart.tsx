import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import Taro from "@tarojs/taro";
import {connect} from "react-redux";
import {View, Text, CheckboxGroup, Checkbox, Label, Button} from "@tarojs/components";
import FallbackImage from "../../components/FallbackImage";
import utils from "../../lib/utils";
import NoData from "../../components/nodata";

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
        this.toggleCheckAll = this.toggleCheckAll.bind(this);
        this.handleCheckChanged = this.handleCheckChanged.bind(this);
    }


    componentDidShow() {
        const cartInfo = JSON.parse(Taro.getStorageSync("CART") || '[]');
        this.setState({cart: cartInfo})
    }

    handleAdd(item) {
        item.count++;
        this.setState({cart: this.state.cart});
        Taro.setStorageSync("CART", JSON.stringify(this.state.cart));
    }

    handleRemove(item, index) {
        item.count--;
        if(item.count <= 0) {
            return utils.showMessage('要移除该商品吗?', () => {
                this.state.cart.splice(index, 1);
                this.setState({cart: this.state.cart});
                Taro.setStorageSync("CART", JSON.stringify(this.state.cart));
            }, true).then(() =>{});
        }
        else {
            this.setState({cart: this.state.cart});
            Taro.setStorageSync("CART", JSON.stringify(this.state.cart));
        }
    }
    handleCheckChanged(e) {
        let values = e.detail.value;
        this.state.cart.forEach(item=>{
            let selected = false;
            values.forEach(v => {
                if(v == item.id) {
                    selected = true;
                }
            });
            item.selected = selected;
        });
        this.setState({cart: this.state.cart});
        Taro.setStorageSync("CART", JSON.stringify(this.state.cart));
    }
    toggleCheckAll() {
        if(this.isCheckedAll) {
            this.state.cart.forEach(item=>{
                item.selected = false;
            });
            this.setState({cart: this.state.cart});
        }
        else {
            this.state.cart.forEach(item=>{
                item.selected = true;
            });
            this.setState({cart: this.state.cart});
        }
        Taro.setStorageSync("CART", JSON.stringify(this.state.cart));
    }

    get isCheckedAll() {
        let cart = this.state.cart;
        if(cart.length == 0) return false;
        return cart.length == cart.filter(item=>item.selected).length;
    }

    get calcCartPrice() {
        let checkedGoods = this.state.cart.filter(item => item.selected);

        if (checkedGoods.length > 0) {
            return checkedGoods.map(item => item.startPrice*item.count).reduce((n, m) => n + m);
        }
        return 0;
    }

    render() {
        const {systemInfo} = this.props;
        const {cart} = this.state;
        let safeBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom;
        if (safeBottom > 10) safeBottom -= 10;
        return (
            <PageLayout statusBarProps={{title: '购物车'}} showTabBar={true}>
                <CheckboxGroup onChange={this.handleCheckChanged}>
                    <View className={'grid pb-4 grid-cols-1 divide-y divide-gray-100'}>
                        {cart.length == 0 && <NoData text={'您的购物车是空的！'} />}
                        {cart.map((item: any, index) => {
                            return (
                                <View className={'bg-white py-4 px-4 relative overflow-hidden flex items-center'}>
                                    <View><Checkbox value={item.id} checked={item.selected} /></View>
                                    <View className={'flex-1 flex space-x-2 text-lg'}>
                                        <FallbackImage mode={'aspectFit'} src={utils.resolveUrl(item.images.split(',')[0])}
                                                       style={{width: Taro.pxTransform(60), height: Taro.pxTransform(60)}}/>
                                        <View>
                                            <View className={'text-lg'}>{item.title}</View>
                                            <View className={'text-red-500'}>￥{numeral(item.startPrice).format('0,0.00')}</View>
                                        </View>
                                    </View>
                                    <View className={'w-20 flex items-center justify-center'}>
                                        <View className={'flex text-xl text-gray-400 w-full items-center justify-between'}>
                                            <Text className={'fa fa-minus-circle'} onClick={()=>this.handleRemove(item, index)}/>
                                            <Text className={'flex-1 text-lg text-center'}>{item.count}</Text>
                                            <Text className={'fa fa-plus-circle'} onClick={()=>this.handleAdd(item)}/>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </CheckboxGroup>

                <View style={{height: Taro.pxTransform(124)}}/>
                {cart.length > 0 &&
                    <View className={'bg-white flex items-center fixed py-2 px-4 w-full text-lg'} style={{bottom: Taro.pxTransform(56 + safeBottom)}}>
                        <View className={'flex-1 flex items-center'}>
                            <Checkbox id={'all'} value={'all'} checked={this.isCheckedAll} onClick={this.toggleCheckAll}/>
                            <Label for={'all'} onClick={this.toggleCheckAll}>全选</Label>
                            <Text className={'ml-4 font-bold text-red-500'}>总计：</Text>
                            <Text className={'text-red-500 font-bold'}>￥{numeral(this.calcCartPrice).format('0,0.00')}</Text>
                        </View>
                        <View>
                            <Button disabled={this.calcCartPrice <= 0} className={'btn btn-danger'}
                                    onClick={() => Taro.navigateTo({url: 'confirm'})}>去结算</Button>
                        </View>
                    </View>
                }
            </PageLayout>
        );
    }
}
