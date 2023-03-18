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
    }
    constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
        this.handleCharge = this.handleCharge.bind(this);
    }

    handleInput(e) {
        this.setState({amount: parseFloat(e.detail.value).toFixed(2)})
    }
    handleCharge() {
        this.setState({posting: true});
        request.post('/app/api/members/money/charge', {amount: this.state.amount}).then(res=>{
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
        return (
            <PageLayout statusBarProps={{title: '提现'}}>
                <View className={'p-4'}>
                    <View className={'p-4 bg-white rounded-lg'}>
                        <View className={'text-sm'}>充值金额RMB</View>
                        <Input className={'text-xl font-bold'} style={{lineHeight: 2}} onInput={this.handleInput} placeholder={'请输入充值金额'} />
                    </View>
                    <View className={'mt-4 text-center'}>
                        <Button onClick={this.handleCharge} className={'btn btn-primary'} disabled={this.state.posting}>确认提现</Button>
                    </View>
                </View>
            </PageLayout>
        );
    }
}
