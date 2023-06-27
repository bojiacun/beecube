import {Component} from "react";
import PageLayout from "../../../layouts/PageLayout";
import {Button, Input, View} from "@tarojs/components";
import request from "../../../lib/request";
import utils from "../../../lib/utils";
import Taro from "@tarojs/taro";


export default class Index extends Component<any, any> {
    state: any = {
        amount: 0.00,
        posting: false,
        userInfo: null,
    }

    constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
        this.handleWithdraw = this.handleWithdraw.bind(this);
    }

    componentDidShow() {
        //刷新余额
        request.get('/app/api/members/profile').then(res => {
            this.setState({userInfo: res.data.result});
        });
    }

    handleInput(e) {
        this.setState({amount: parseFloat(e.detail.value).toFixed(2)})
    }

    async handleWithdraw() {
        let checkResult = await request.get('/paimai/api/members/check');
        if (checkResult.data.result == 0) {
            return utils.showMessage("请完善您的个人信息(手机号、昵称、头像)", function () {
                Taro.navigateTo({url: '/pages/my/profile'}).then();
            });
        } else if (checkResult.data.result == -1) {
            return utils.showMessage("请完成实名认证", function () {
                Taro.navigateTo({url: '/pages/my/realauth'}).then();
            });
        }

        this.setState({posting: true});
        request.post('/app/api/members/money/withdraw', {amount: this.state.amount}).then(res => {
            if(res.data.success) {
                utils.showSuccess(true, '申请成功,等待审核');
            }
        });
    }

    render() {
        const {userInfo, posting, amount} = this.state;

        return (
            <PageLayout statusBarProps={{title: '提现'}}>
                <View className={'p-4'}>
                    <View className={'p-4 space-y-4 bg-white rounded-lg'}>
                        <View className={'text-sm'}>提现金额RMB</View>
                        <View>
                            <Input
                                className={'text-3xl font-bold border-b border-gray-400'}
                                style={{height: 64}}
                                onInput={this.handleInput}
                                placeholder={'请输入要提现金额'}
                            />
                        </View>
                        <View className={'text-sm'}>当前余额{parseFloat(userInfo?.money).toFixed(2)}</View>
                    </View>
                    <View className={'mt-4 text-center'}>
                        <Button onClick={this.handleWithdraw} className={'btn btn-primary w-56'} disabled={posting||amount<=0||amount>userInfo?.money||amount == 'NaN'}>确认提现</Button>
                    </View>
                </View>
            </PageLayout>
        );
    }
}
