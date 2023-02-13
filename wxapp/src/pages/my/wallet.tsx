import {useRef, useState} from "react";
import Taro from '@tarojs/taro';
import {useReady} from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import {Button, Form, Input, Navigator, Text, View} from "@tarojs/components";
import withLogin from "../../components/login/login";
import request, {
    API_MEMBER_INFO,
    API_MONEY_INVEST,
    API_MONEY_WITHDRAW,
    SERVICE_WINKT_MEMBER_HEADER
} from "../../utils/request";
import classNames from "classnames";
import {InputProps} from "@tarojs/components/types/Input";


const Wallet = (props) => {
    const {checkLogin, makeLogin} = props;
    const [user, setUser] = useState<any>(null);
    const [posting, setPosting] = useState<boolean>(false);
    const [investVisible, setInvestVisible] = useState<boolean>(false);
    const [withdrawVisible, setWithdrawVisible] = useState<boolean>(false);
    const isLogin = checkLogin();
    const inputPriceRef = useRef<InputProps>();


    const loadUser = () => {
        request.get(API_MEMBER_INFO, SERVICE_WINKT_MEMBER_HEADER, null, true).then(res => {
            setUser(res.data.data);
            if(inputPriceRef.current) {
                inputPriceRef.current.value = res.data.data.money;
            }
        })
    }

    useReady(()=>{
        if(isLogin) {
            loadUser();
        }
    })

    const doWithdraw = (e) => {
        let amount = e.detail.value.price;
        setPosting(true);
        request.post(API_MONEY_WITHDRAW, SERVICE_WINKT_MEMBER_HEADER, amount, true).then(res=>{
            if(res.data.data) {
                Taro.showToast({title: '申请成功', icon: 'success'}).then()
            }
            setWithdrawVisible(false);
            setPosting(false);
        }).catch(()=>setPosting(false))
    }
    const doInvest = (e) => {
        let amount = e.detail.value.price;
        setPosting(true);
        request.post(API_MONEY_INVEST, SERVICE_WINKT_MEMBER_HEADER, amount, true).then(res=>{
            let data = res.data.data;
            data.package = data.packageValue;
            Taro.requestPayment(data).then(() => {
                //支付已经完成，提醒支付成功并返回上一页面
                loadUser();
                Taro.showToast({title: '支付成功', duration: 2000}).then();
            })
            setInvestVisible(false);
            setPosting(false);
        }).catch(()=>setPosting(false))
    }

    return (
        <PageLayout statusBarProps={{title: '我的钱包'}}>
            <View className="padding bg-white flex flex-direction align-center justify-center" style={{height: '600rpx'}}>
                <View className="cu-avatar bg-orange round xl text-center">
                    <Text className="cuIcon-moneybag text-white" style={{fontSize: '84rpx', marginLeft: '8rpx'}} />
                </View>
                <View className="margin-top">
                    {isLogin ? <View className="text-red text-xl text-bold">￥{user?.money}</View>: <Button className="cu-btn bg-orange shadow" onClick={()=>makeLogin(()=>loadUser())}>登录查看</Button>}
                </View>
            </View>
            {isLogin &&
            <View className="flex justify-center padding flex-direction align-center">
                <View className={'flex'} style={{width: '100%'}}>
                    <Button onClick={()=>setInvestVisible(true)} className="cu-btn block lg bg-orange margin-right-sm flex-sub">充值</Button>
                    <Button onClick={()=>setWithdrawVisible(true)} className="cu-btn block lg bg-green margin-left-sm flex-sub">提现</Button>
                </View>
                <Navigator url="wallet_water" className="margin-top-sm text-gray">资金流水</Navigator>
            </View>
            }
            <View className={classNames("cu-modal", investVisible? 'show' : '')}>
                <Form onSubmit={(e) => doInvest(e)}>
                    <View className="cu-dialog">
                        <View className="cu-bar bg-white justify-end">
                            <View className="content">输入充值额度</View>
                            <View className="action" onClick={() => setWithdrawVisible(false)}>
                                <Text className="cuIcon-close text-red" />
                            </View>
                        </View>
                        <View className="padding bg-white">
                            <View className="cu-form-group">
                                <View className="title">充值额度</View>
                                <Input name="price" type="digit" placeholder="请输入本次充值额度（元）" />
                            </View>
                        </View>
                        <View className="cu-bar bg-white justify-end">
                            <View className="action">
                                <Button className="cu-btn line-green text-green" onClick={() => setInvestVisible(false)}>取消 </Button>
                                <Button formType="submit" loading={posting} disabled={posting} className="cu-btn bg-orange margin-left">确定</Button>
                            </View>
                        </View>
                    </View>
                </Form>
            </View>
            <View className={classNames("cu-modal", withdrawVisible ? 'show' : '')}>
                <Form onSubmit={(e) => doWithdraw(e)}>
                    <View className="cu-dialog">
                        <View className="cu-bar bg-white justify-end">
                            <View className="content">输入提现额度</View>
                            <View className="action" onClick={() => setWithdrawVisible(false)}>
                                <Text className="cuIcon-close text-red" />
                            </View>
                        </View>
                        <View className="padding bg-white">
                            <View className="cu-form-group">
                                <View className="title">提现额度</View>
                                <Input name="price" type="digit" placeholder="请输入本次提现额度（元）" ref={inputPriceRef} />
                            </View>
                        </View>
                        <View className="cu-bar bg-white justify-end">
                            <View className="action">
                                <Button className="cu-btn line-green text-green" onClick={() => setWithdrawVisible(false)}>取消 </Button>
                                <Button formType="submit" loading={posting} disabled={posting} className="cu-btn bg-orange margin-left">确定</Button>
                            </View>
                        </View>
                    </View>
                </Form>
            </View>
        </PageLayout>
    );
}

export default withLogin(Wallet);
