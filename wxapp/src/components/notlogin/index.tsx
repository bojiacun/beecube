import React from "react";
import withLogin from "../login/login";
import {Button, View} from "@tarojs/components";

export declare interface NotLoginProps {
    height?: string,
    onLogin: Function
}

const NotLogin: React.FC<NotLoginProps> = withLogin((props) => {
    const {checkLogin, height, makeLogin, onLogin} = props;

    const doLogin = () => {
        if(!checkLogin()) {
            makeLogin(onLogin);
        }
    }

    return (
        <View className="flex flex-direction align-center justify-center container" style={{height}}>
            <Button className="cu-btn bg-gradual-orange lg block" style={{width: '80%'}} onClick={doLogin}>点击登录</Button>
        </View>
    );
});

NotLogin.defaultProps = {
    height: 'calc(100vh - 128rpx)'
}


export default NotLogin;
