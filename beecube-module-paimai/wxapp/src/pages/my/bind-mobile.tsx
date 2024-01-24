import React, {Component, PropsWithChildren} from "react";
import Taro from "@tarojs/taro";
import {Avatar, Button, ConfigProvider, Radio, Toast} from "@taroify/core";
import PageLayout from "../../layouts/PageLayout";
import {View} from "@tarojs/components";
import {connect} from "react-redux";
import utils from "../../lib/utils";
import request, {APP_ID} from "../../lib/request";
import {setUserInfo} from "../../store/actions";

// @ts-ignore
@connect((state: any) => (
    {
        settings: state.context.settings,
        context: state.context
    }
), (dispatch) => {
    return {
        updateUserInfo(userInfo) {
            dispatch(setUserInfo(userInfo));
        }
    }
})
export default class Index extends Component<PropsWithChildren<any>, any> {
    state: any = {
        sending: false,
        counter: 60,
        saving: false,
        app: null,
    }
    timer: any;
    formRef: any;

    constructor(props) {
        super(props);
        this.getPhoneNumber = this.getPhoneNumber.bind(this);
        this.handleSendCode = this.handleSendCode.bind(this);
        this.formRef = React.createRef();
    }

    componentDidMount() {
        request.get('/app/api/app/' + APP_ID).then(res => {
            this.setState({app: res.data.result});
        })
    }

    handleSendCode() {
        if (this.state.sending) return false;
        let phone = this.formRef.current.getValues('phone').phone;
        if (!phone) {
            return utils.showMessage('请输入手机号');
        }
        this.setState({sending: true});
        request.post('/api/member/sms', {mobile: phone, smsmode: 2}).then(() => {
            this.timer = setInterval(() => {
                this.setState((v) => {
                    v.counter--;
                    if (v.counter <= 0) {
                        clearInterval(this.timer);
                        v.counter = 60;
                        v.sending = false;
                    }
                    return v;
                })
            }, 1000);
        });
    }

    getPhoneNumber(res:any) {
        this.setState({saving: true});
        const phoneCode = res.detail.code;
        const data:any = {phoneCode, code: null};
        Taro.login().then(res => {
            data.code = res.code;
            request.post('/api/login/mobile', data).then(res => {
                let loginInfo = res.data.result;
                Toast.open({
                    message: '授权成功!', onClose(opened: boolean) {
                        if (!opened) {
                            utils.navigateBack();
                        }
                    },
                    duration: 1000,
                });
            }).finally(() => this.setState({saving: false}));
        })
    }

    render() {
        const {settings} = this.props;
        const {app} = this.state;
        return (
            <PageLayout statusBarProps={{title: '绑定手机号'}} containerClassName='flex flex-col items-center'>
                <Toast id='toast' />
                <View className='py-4 flex flex-col items-center' style={{marginTop: 100}}>
                    <Avatar size='large' src={utils.resolveUrl(app?.logo)} />
                    <View className='font-bold text-xl my-2'>{settings.wxAppName}</View>
                </View>
                <View className='w-full text-center' style={{margin: "16px"}}>
                    <Button style={{width: '70%'}} shape='round' color='danger' onGetPhoneNumber={this.getPhoneNumber} openType='getPhoneNumber' disabled={this.state.saving} loading={this.state.saving}>
                        手机号快捷授权
                    </Button>
                </View>
            </PageLayout>
        );
    }
}
