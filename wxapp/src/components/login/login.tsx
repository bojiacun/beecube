import Taro from "@tarojs/taro";
import {useState} from "react";
import {Button, Text, View} from "@tarojs/components";
import Modal from "../modal/modal";
import util, {KEY_USERINFO} from "../../utils/we7/util";
import {connect} from "react-redux";
import {setTabs, setUserInfo} from "../../store/actions";
import {Context} from "../../types/context";

let callbackFunc: Function;
let failCallbackFunc: Function;

declare interface LoginProps {
    context: Context

    setUserInfo(userInfo: any): void

    dispatch(): void
}

export let onLoginSuccessed: (value: unknown) => void;
export let onLoginFailed: (value: unknown) => void;

const withLogin = Component => {
    // @ts-ignore
    return connect(state => ({context: state.context, tabs: state.tabs}), dispatch => ({
        setUserInfo(userInfo) {
            dispatch(setUserInfo(userInfo));
        },
        dispatch(action) {
            dispatch(action);
        }
    }))((props: any) => {
        const {context, setUserInfo, dispatch, forwardedRef, tabs} = props;
        const [loginVisible, setLoginVisible] = useState(false);
        const [isLogin, setIsLogin] = useState(false);
        const [isMobileLogin, setIsMobileLogin] = useState(false);
        const [code, setCode] = useState<string>('');
        const hasUserProfile = Taro.canIUse('getUserProfile');
        const token = context.userInfo;
        const settings = context.settings;
        const {systemInfo} = context;

        //检测是否登录，没有登录跳转登录页面
        const checkLogin = (): boolean => {
            let logined = !(token === undefined
                || token === null
                || !token.memberInfo
                || token.memberInfo.requireRelogin
                || token.memberInfo.nickname === undefined
                || token.memberInfo.nickname === null
                || token.memberInfo.nickname == ''
            );
            return logined;
        }


        //执行登录操作
        const makeLogin = (callback, failCallback = () => {
        }, registerFirst = true) => {
            callbackFunc = callback;
            failCallbackFunc = failCallback;
            let redirectUrl = registerFirst ? '/pages/login/register' : '/pages/login/login';
            if (!checkLogin()) {
                if (settings && settings.normalLoginMode === 'true') {
                    //传统方式登录,跳转到登录页面
                    new Promise((resolve, reject) => {
                        Taro.navigateTo({url: redirectUrl}).then(() => {
                            onLoginFailed = reject;
                            onLoginSuccessed = resolve;
                        });
                    }).then((value) => {
                        setLoginVisible(false);
                        typeof callbackFunc === 'function' && callbackFunc(value);
                    }).catch(() => {
                        typeof failCallbackFunc === 'function' && failCallbackFunc();
                    });
                } else {
                    Taro.login().then((res) => {
                        setCode(res.code);
                        setLoginVisible(true);
                    });
                }
            } else {
                checkIsRequireMobile(token)
            }
        }
        const checkIsRequireMobile = (userInfo: any): void => {
            // @ts-ignore
            if (settings && settings.requireMobile == 'true' && !userInfo.memberInfo.mobile) {
                //需要手机号登录
                setIsMobileLogin(true);
                setLoginVisible(true);
            } else {
                setLoginVisible(false);
                typeof callbackFunc === 'function' && callbackFunc(userInfo);
            }
        }
        const isRequireMobile = (userInfo: any): boolean => {
            return settings && settings.requireMobile == 'true' && !userInfo?.memberInfo?.mobile;
        }
        const getUserProfile = () => {
            setIsLogin(true);
            Taro.getUserProfile({
                lang: 'zh_CN',
                desc: '用于登陆',
            }).then(r => {
                util.getUserInfo(function (userInfo) {
                    setUserInfo(userInfo);
                    Taro.setStorageSync(KEY_USERINFO, userInfo);
                    setIsLogin(false);
                    setLoginVisible(false);
                    checkIsRequireMobile(userInfo);
                }, r, code);
            }).catch(() => {
                //用户取消获取头像授权，清空当前对象信息
                Taro.removeStorageSync(KEY_USERINFO);
                setIsLogin(false);
                setLoginVisible(false);
                typeof failCallbackFunc === 'function' && failCallbackFunc();
            })
        }
        const getUserInfo = event => {
            let userInfo = event.detail;
            setIsLogin(true);
            util.getUserInfo(function (r) {
                setUserInfo(r);
                Taro.setStorageSync(KEY_USERINFO, r);
                setIsLogin(false);
                setLoginVisible(false);
                checkIsRequireMobile(r);
            }, userInfo);
        }
        const getPhone = event => {
            const detail = event.detail;
            util.updateMobile(detail, userInfo => {
                setUserInfo(userInfo);
                Taro.setStorageSync(KEY_USERINFO, userInfo);
                setIsLogin(false);
                setLoginVisible(false);
                typeof callbackFunc === 'function' && callbackFunc(userInfo);
            })
        }
        const logout = () => {
            setUserInfo(null);
            Taro.removeStorageSync(KEY_USERINFO);
            //刷新tab
            dispatch(setTabs([...tabs]));
        }
        const isIpx = (systemInfo && (systemInfo.model.match(/iphone x/i) || systemInfo.model.match(/iphone 11/i) || systemInfo.model.match(/iphone 12/i)));
        return (
            <>
                <Component
                    ref={forwardedRef}
                    {...props}
                    checkLogin={checkLogin}
                    makeLogin={makeLogin}
                    dispatch={dispatch}
                    headerHeight={context.headerHeight}
                    isIpx={isIpx}
                    logout={logout}
                />
                <Modal
                    visible={loginVisible}
                    onClose={() => {
                        setLoginVisible(false);
                        setIsLogin(false);
                        setIsMobileLogin(false);
                        if (isRequireMobile(token)) {
                            logout();
                        }
                    }}
                >
                    <View className='flex flex-direction justify-center align-center' style={{height: '100%'}}>
                        <View className='text-xl padding text-black text-bold margin-bottom'>请允许授权以便为您提供给服务</View>
                        {
                            isMobileLogin ?
                                <Button className='cu-btn bg-gradual-red shadow' disabled={isLogin}
                                        openType='getPhoneNumber' onGetPhoneNumber={getPhone}>
                                    {isLogin && <Text className='fa fa-spin fa-spinner margin-right-xs'/>}
                                    一键获取手机号
                                </Button>
                                :
                                (
                                    hasUserProfile ?
                                        <Button className="cu-btn bg-gradual-orange lg shadow" disabled={isLogin}
                                                loading={isLogin} onClick={getUserProfile}>一键授权登录</Button>
                                        :
                                        <Button className='cu-btn bg-gradual-orange shadow' disabled={isLogin}
                                                openType='getUserInfo'
                                                onGetUserInfo={getUserInfo}
                                                loading={isLogin}
                                        >
                                            一键授权登录
                                        </Button>
                                )
                        }
                    </View>
                </Modal>
            </>
        );
    })
}

export default withLogin
