import {Component} from "react";
import Taro from "@tarojs/taro";
import {View, Picker, Form, Button, Textarea} from "@tarojs/components";
import {connect} from "react-redux";
import PageLayout from "../../../layouts/PageLayout";
import utils from "../../../lib/utils";
import FallbackImage from "../../../components/FallbackImage";
import request from "../../../lib/request";
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
    state:any = {
        types: [
            {id: 1, name: '退货'},
            {id: 2, name: '换货'},
        ],
        typeIndex: 0,
        saving: false,
        goodsList: [],
        options: {},
    }

    constructor(props: any) {
        super(props);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    onLoad(options) {
        if (options.ogid) {
            request.get('/paimai/api/orders/goods/detail', {params: {id: options.ogid}}).then(res => {
                res.data.result.count = 1;
                this.state.goodsList.push(res.data.result);
                this.setState({goodsList: this.state.goodsList});
            });
        }
        this.setState({options: options});
    }
    componentWillMount() {
        this.setState({sdkVersion: Taro.getAppBaseInfo().SDKVersion});
    }



    handleSubmit(e) {
        this.setState({saving: true});
        let values = e.detail.value;
        values.type = this.state.types[this.state.typeIndex];
        values.orderId = this.state.options.oid;
        values.orderGoodsId = this.state.options.ogid;
        request.post('/paimai/api/orders/afters', values).then(()=> {
            utils.showSuccess(true);
        });
    }

    handleTypeChange(e) {
        const index = e.detail.value;
        this.setState({typeIndex: index});
    }



    render() {
        const {goodsList} = this.state;

        return (
            <PageLayout statusBarProps={{title: '申请售后'}}>
                <Form onSubmit={this.handleSubmit}>
                    <View className={'space-y-4'}>
                        <View className={'p-4'}>
                            <View className={'font-bold text-lg'}>商品信息</View>
                            {goodsList.map((item:any) => {
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
                        <View className={'p-4'}>
                            <Picker onChange={this.handleTypeChange} range={this.state.types} rangeKey={'name'}>
                                <View className={'flex items-center justify-between'}>
                                    <View className={'flex items-center space-x-2'}>
                                        <View>处理类型</View>
                                    </View>
                                    <View className={'flex items-center space-x-2'}>
                                        <View>{this.state.types[this.state.typeIndex].name}</View>
                                        <View className={'iconfont icon-youjiantou_huaban'}/>
                                    </View>
                                </View>
                            </Picker>
                        </View>
                        <View className={'p-4'}>
                            <View className={'font-bold text-lg'}>商品信息</View>
                            <View>
                                <Textarea name={'description'} className={'h-20'}></Textarea>
                            </View>
                        </View>

                    </View>
                    <View className={'container mx-auto mt-4 text-center'}>
                        <Button className={'btn btn-primary w-56'} formType={'submit'} disabled={this.state.saving}>保存</Button>
                    </View>
                </Form>
            </PageLayout>
        );
    }
}
