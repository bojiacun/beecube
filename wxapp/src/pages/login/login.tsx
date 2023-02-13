import { Button, Form, Image, Input, InputProps, View,Navigator } from '@tarojs/components'
import PageLayout from "../../layouts/PageLayout";
import classNames from "classnames";
// @ts-ignore
import styles from './login.module.scss'
import withLogin, {onLoginFailed, onLoginSuccessed} from "../../components/login/login";
import { useRef, useState } from "react";
import request, { API_VERIFY_CODE, SERVICE_WINKT_COMMON_HEADER } from '../../utils/request';
import Taro from '@tarojs/taro';
import getValidator from "../../utils/validator";
import {memberLogin} from "./service";
import {KEY_USERINFO} from "../../utils/we7/util";


const Login = (props) => {
    const {headerHeight, setUserInfo} = props;
    const [isLogin, setIsLogin] = useState(false);
    const mobileRef = useRef<InputProps>();
    const [vcodeTimer, setVcodeTimer] = useState(60);
    const formRef = useRef();


    const sendVCode = () => {
        let mobile = mobileRef.current?.value;
        let timer: any = null;
        if (mobile?.length != 11) {
            return Taro.showModal({ title: '错误提醒', content: '请输入正确的手机号码', showCancel: false });
        }
        setVcodeTimer(59);

        request.post(API_VERIFY_CODE, SERVICE_WINKT_COMMON_HEADER, { mobile: mobile }).then(() => {
            //验证码发送成功
            timer = setInterval(() => {
                setVcodeTimer(v => {
                    if (v > 0) {
                        return v - 1;
                    } else {
                        clearInterval(timer);
                        return 60;
                    }
                })
            }, 1000);
        }).catch(()=>{
            //验证码发送失败
            clearInterval(timer);
            setVcodeTimer(60);
        })
    }
    const login = (e) => {
        setIsLogin(true);
        let validator = getValidator();
        let data = {...e.detail.value};
        //验证数据
        validator.addRule(data, [
            {
                name: 'mobile',
                strategy: 'phone',
                errmsg: '请输入正确的手机号'
            },
            {
                name: 'vcode',
                strategy: 'isEmpty',
                errmsg: '验证码不能为空'
            },
        ]);
        const checked = validator.check();
        if (!checked.isOk) {
            setIsLogin(false);
            return Taro.showModal({title: '错误提醒', content: checked.errmsg, showCancel: false});
        }
        memberLogin(data).then(res=>{
            //登录成功
            Taro.setStorageSync(KEY_USERINFO, res);
            setUserInfo(res);
            setIsLogin(false);
            typeof onLoginSuccessed === 'function' && onLoginSuccessed(res);
            Taro.navigateBack().then();
        }).catch(()=>{
            setIsLogin(false);
            typeof onLoginFailed === 'function' && onLoginFailed(null);
        })
    }

    return (
        <PageLayout statusBarProps={{ title: '账号登录', bgColor: 'transparent', color: '#ffffff' }} style={{ backgroundColor: 'white' }}>
            <Image src='../../assets/images/loginbg.png' mode='widthFix' style={{display: 'block', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0}} />
            <View style={{ minHeight: `calc(100vh - ${headerHeight}px)`, paddingTop: '160rpx' }} className={classNames(styles.container, "flex flex-direction align-center bg-white")}>
                <View style={{ width: '100%', marginBottom: '200rpx' }} className="flex flex-direction align-center">
                    <Image src='../../assets/images/logo.png' mode="widthFix" style={{ width: '70%' }} />
                </View>
                <View style={{ width: '100%' }} className="padding">
                    <Form ref={formRef} onSubmit={login}>
                        <View className="cu-form-group" style={{ background: 'transparent' }}>
                            <View className="title">手机号码</View>
                            <Input name="mobile" placeholder="请输入登录手机号" ref={mobileRef} />
                        </View>
                        <View className="cu-form-group">
                            <View className="title">验证码</View>
                            <Input name="vcode" placeholder="请输入验证码" />
                            <Button disabled={vcodeTimer < 60} className="cu-btn bg-green shadow"
                                onClick={sendVCode}>{vcodeTimer < 60 ? vcodeTimer : '验证码'}</Button>
                        </View>
                        <View className='padding flex justify-end margin-bottom' style={{width: '100%'}}>
                            <Navigator url='register' openType='redirect'>没有账号，去注册</Navigator>
                        </View>
                        <Button loading={isLogin} disabled={isLogin} style={{ width: '70%', marginTop: '140rpx', margin: '0 auto' }} formType='submit' className="cu-btn block lg bg-gradual-green shadow round text-lg">点击登录</Button>
                    </Form>
                </View>
            </View>
        </PageLayout>
    );
}

export default withLogin(Login)
