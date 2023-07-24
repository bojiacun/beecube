import {Component} from "react";
import {Input, Navigator, Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {Button} from "@taroify/core";
import request from "../../../lib/request";
import PageLayout from "../../../layouts/PageLayout";
import utils from "../../../lib/utils";


export default class Index extends Component<any, any> {
    state: any = {
        amount: 0.00,
        alipayAccount: null,
        posting: false,
        userInfo: null,
    }

    constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
        this.handleAccountInput = this.handleAccountInput.bind(this);
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
    handleAccountInput(e) {
        this.setState({alipayAccount: e.detail.value})
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
        if(!this.state.amount) {
            return utils.showError('请填写提现金额');
        }
        if(!this.state.alipayAccount) {
            return utils.showError('请填写支付宝收款账户');
        }

        this.setState({posting: true});
        request.post('/app/api/members/money/withdraw', {amount: this.state.amount, alipayAccount: this.state.alipayAccount}).then(res => {
            if(res.data.success) {
                utils.showSuccess(true, '申请成功,等待审核');
            }
        });
    }

    render() {
        const {userInfo, posting, amount, alipayAccount} = this.state;

        return (
            <PageLayout statusBarProps={{title: '提现'}}>
                <View className='p-4'>
                    <View className='p-4 space-y-4 bg-white rounded-lg'>
                        <View className=''>提现金额RMB</View>
                        <View className='bg-gray-100 rounded-lg px-2 flex spce-x-4 items-center'>
                            <Text className='font-bold text-2xl'>￥</Text>
                            <Input
                              className='text-lg flex-1'
                              style={{height: 48}}
                              onInput={this.handleInput}
                              placeholder='手动输入提现金额'
                            />
                        </View>
                        <View className='bg-gray-100 rounded-lg px-4 flex spce-x-4 items-center'>
                            <Input
                              className='text-lg flex-1'
                              style={{height: 48}}
                              onInput={this.handleAccountInput}
                              placeholder='填写收款的支付宝账户'
                            />
                        </View>
                        <View className='text-sm text-red-600'>当前余额{parseFloat(userInfo?.money).toFixed(2)}</View>

                        <View className='mt-4 text-center'>
                            <Button block onClick={this.handleWithdraw} color='danger' shape='round' disabled={posting||amount<=0||amount>userInfo?.money||amount == 'NaN'||!alipayAccount}>确认提现</Button>
                        </View>
                    </View>
                    <View className='mt-4 text-center'>
                        <Navigator className='text-stone-400 p-4 mt-6' url='withdraws'>提现记录</Navigator>
                    </View>
                </View>
            </PageLayout>
        );
    }
}
