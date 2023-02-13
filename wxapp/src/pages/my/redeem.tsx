import Taro from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import {Button, Form, Input, OfficialAccount, View} from "@tarojs/components";
import {useRef, useState} from "react";
import request, {
    API_MEMBER_INFO,
    SERVICE_WINKT_MEMBER_HEADER,
} from "../../utils/request";
// @ts-ignore
import styles from './index.module.scss';
import withLogin from "../../components/login/login";
import {refreshMemberInfo} from "../../global";


const RedeemPage = (props) => {
    const {checkLogin, makeLogin} = props;
    const [posting, setPosting] = useState(false);
    const [code, setCode] = useState<string>();
    const formRef = useRef();
    const isLogined = checkLogin();

    const onFinish = (e) => {
        const data = e.detail.value;
        if (!data.code) {
            return Taro.showModal({title: '错误提醒', content: '请输入兑换码', showCancel: false});
        }
        setPosting(true);
        request.put("wxapp/redeems/use/" + data.code, SERVICE_WINKT_MEMBER_HEADER, null, true).then((res) => {
            let data = res.data.data;
            data.package = data.packageValue;
            Taro.requestPayment(data).then(() => {
                //支付已经完成，提醒支付成功并返回上一页面
                Taro.showToast({title: '微信支付成功', duration: 2000}).then(() => {
                    setPosting(false);
                    Taro.showToast({title: '兑换成功', icon: 'success'}).then();
                    //刷新本地用户信息
                    setTimeout(() => {
                        request.get(API_MEMBER_INFO, SERVICE_WINKT_MEMBER_HEADER, null, true).then(res => refreshMemberInfo(res.data.data));
                        Taro.navigateBack().then();
                    }, 1000);
                });
            }).catch(() => setPosting(false));
        }).catch(() => setPosting(false));
    }


    return (
        <PageLayout showTabBar={false} statusBarProps={{title: '兑换礼品'}}>
            <View className="cu-card no-card article margin-top-sm">
                <View className="cu-item">
                    <View className="title">兑换说明</View>
                    <View className="content">
                        一个兑换码只能使用一次，请妥善保存兑换码
                    </View>
                </View>
            </View>
            <Form onSubmit={onFinish} ref={formRef}>
                <View className="margin-top-sm">
                    <View className="cu-form-group">
                        <View className="title text-bold">兑换码</View>
                        <Input type="text" name={'code'} onInput={(e) => setCode(e.detail.value)}
                               placeholder="输入兑换码兑换礼品" style={{textAlign: 'right'}}/>
                    </View>
                </View>
                <OfficialAccount />
                {isLogined && <Button loading={posting} disabled={posting || !code} formType="submit"
                                      className="cu-btn block margin lg bg-orange">确认兑换</Button>}
                {!isLogined &&
                    <Button onClick={() => makeLogin()} className="cu-btn block lg margin bg-orange">点击登录</Button>}

            </Form>

        </PageLayout>
    );
}

export default withLogin(RedeemPage)
