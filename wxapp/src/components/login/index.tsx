import {Component, PropsWithChildren} from "react";
import Taro, {getCurrentInstance} from '@tarojs/taro';
import request from "../../lib/request";
import {connect} from "react-redux";
import {setUserInfo} from "../../store/actions";

// @ts-ignore
@connect((state: any) => (
    {
        context: state.context
    }
), (dispatch)=>{
    return {
        updateUserInfo: (userInfo) => {
            dispatch(setUserInfo(userInfo))
        }
    }
})
export default class LoginView extends Component<LoginViewProps, any> {
    $instance = getCurrentInstance();

    componentWillMount() {
    }

    componentDidMount() {
        const token = Taro.getStorageSync("TOKEN");
        //本地未存储token则执行登录操作
        if (!token) {
            Taro.login().then(res => {
                request.get('/app/api/wxapp/login', {params: {code: res.code}}).then(res => {
                    Taro.setStorageSync("TOKEN", res.data.result);
                    if(this.props.refreshUserInfo) {
                        request.get('/app/api/members/profile').then(res => {
                            this.props.updateUserInfo!(res.data.result);
                        })
                    }
                });
            })
        }else if(this.props.refreshUserInfo){
            //刷新新用户信息
            request.get('/app/api/members/profile').then(res=>{
                this.props.updateUserInfo!(res.data.result);
            })
        }
    }


    render() {
        return this.props.children;
    }
}

export interface LoginViewProps extends PropsWithChildren {
    refreshUserInfo?: boolean;
    updateUserInfo?: Function;
}
