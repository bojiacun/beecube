import {Component, PropsWithChildren} from "react";
import Taro, {eventCenter, getCurrentInstance} from '@tarojs/taro';
import request from "../../lib/request";
import {connect} from "react-redux";
import {setUserInfo} from "../../store/actions";

// @ts-ignore
@connect((state: any) => (
    {
        context: state.context
    }
), (dispatch) => {
    return {
        updateUserInfo: (userInfo) => {
            dispatch(setUserInfo(userInfo))
        }
    }
})
export default class LoginView extends Component<LoginViewProps, any> {
    $instance = getCurrentInstance();

    constructor(props: any) {
        super(props);
        this.onShow = this.onShow.bind(this);
    }

    componentWillMount() {
        const onShowEventId = this.$instance.router!.onShow
        // 监听
        eventCenter.on(onShowEventId, this.onShow)
    }

    onShow() {
        console.log('child component on show');
        const token = Taro.getStorageSync("TOKEN");
        if (token && this.props.refreshUserInfo) {
            request.get('/app/api/members/profile').then(res => {
                this.props.updateUserInfo!(res.data.result);
            })
        }
    }

    componentDidMount() {
        const token = Taro.getStorageSync("TOKEN");
        //本地未存储token则执行登录操作
        if (!token) {
            Taro.login().then(res => {
                request.get('/app/api/wxapp/login', {params: {code: res.code}}).then(res => {
                    Taro.setStorageSync("TOKEN", res.data.result);
                    request.get('/app/api/members/profile').then(res => {
                        this.props.updateUserInfo!(res.data.result);
                    })
                });
            })
        }
        else if(!this.props.refreshUserInfo) {
            request.get('/app/api/members/profile').then(res => {
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
