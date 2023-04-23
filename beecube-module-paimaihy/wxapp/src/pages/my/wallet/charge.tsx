import {Component} from "react";
import PageLayout from "../../../layouts/PageLayout";
import {Button, Input, View} from "@tarojs/components";
import request from "../../../lib/request";
import Taro from "@tarojs/taro";
import utils from "../../../lib/utils";


export default class Index extends Component<any, any> {
    state:any = {
        amount: 0.00,
        posting: false,
        userInfo: null,
    }
    constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
        this.handleCharge = this.handleCharge.bind(this);
    }

    componentDidShow() {
        //刷新余额
        request.get('/app/api/members/profile').then(res=>{
            this.setState({userInfo: res.data.result});
        });
    }

    handleInput(e) {
        this.setState({amount: parseFloat(e.detail.value).toFixed(2)})
    }

    handleCharge() {
        this.setState({posting: true});
        request.put('/app/api/members/money/charge', {amount: this.state.amount}).then(res=>{
            //发起微信支付
            let data = res.data.result;
            data.package = data.packageValue;
            Taro.requestPayment(data).then(() => {
                //支付已经完成，提醒支付成功并返回上一页面
                this.setState({posting: false});
                utils.showSuccess(true, '支付成功');
            }).catch(() => this.setState({posting: false}));
        });
    }

    render() {
        const {userInfo, amount, posting} = this.state;

        return (
            <PageLayout statusBarProps={{title: '充值'}}>
                <View className={'p-4'}>
                    <View className={'p-4 space-y-4 bg-white rounded-lg'}>
                        <View className={'text-sm'}>充值金额RMB</View>
                        <View>
                            <Input className={'text-3xl font-bold border-b border-gray-400'} style={{height: 64}} onInput={this.handleInput} placeholder={'请输入充值金额'} />
                        </View>
                        <View className={'text-sm'}>当前余额{parseFloat(userInfo?.money).toFixed(2)}</View>
                    </View>
                    <View className={'mt-4 text-center'}>
                        <Button onClick={this.handleCharge} className={'btn btn-primary w-56'} disabled={amount <= 0||posting}>微信支付</Button>
                    </View>
                </View>
            </PageLayout>
        );
    }
}
