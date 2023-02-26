import React, {Component} from "react";
import PageLayout from "../../../layouts/PageLayout";
import LoginView from "../../../components/login";
import {Button, Form, Input, View} from "@tarojs/components";
import {connect} from "react-redux";
import request from "../../../lib/request";
import utils from "../../../lib/utils";
import {setUserInfo} from "../../../store/actions";
import classNames from "classnames";

// @ts-ignore
@connect((state: any) => (
    {
        context: state.context
    }
), (dispatch) => {
    return {
        updateUserInfo(userInfo) {
            dispatch(setUserInfo(userInfo));
        }
    }
})
export default class Index extends Component<any, any> {

    state = {
        sending: false,
        counter: 60,
        saving: false,
    }
    timer: any;
    mobileRef: any;

    constructor(props:any) {
        super(props);
        this.handleSendCode = this.handleSendCode.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.mobileRef = React.createRef();
    }

    handleSendCode() {
        if(!this.mobileRef.current?.value) {
            return utils.showMessage('请输入手机号');
        }
        this.setState({sending: true});
        request.post('/app/api/sms/send', {mobile: this.mobileRef.current.value}).then(()=>{
            this.timer = setInterval(()=>{
                this.setState((v)=>{
                    v.counter--;
                    if(v.counter <= 0) {
                        clearInterval(this.timer);
                        v.counter = 60;
                        v.sending = false;
                    }
                    return v;
                })
            }, 1000);
        });
    }

    handleSubmit(e) {
        let values = e.detail.value;
        this.setState({saving: true});

        request.put("/app/api/sms/check", values).then(res=>{
            if(res.data.result) {
                let userInfo = this.props.context.userInfo;
                userInfo.phone = values.mobile;
                this.props.updateUserInfo(userInfo);
                utils.showSuccess(true);
            }
            else {
                utils.showMessage('验证码不正确').then();
            }
            this.setState({saving: false});
        })
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        return (
            <PageLayout statusBarProps={{title: '手机号认证'}}>
                <LoginView>
                    <Form onSubmit={this.handleSubmit}>
                        <View className={'bg-white divide-y divide-gray-100 text-gray-600 mt-4'}>
                            <View className={'p-4 flex items-center justify-between'}>
                                <View className={'flex items-center space-x-2'}>
                                    <View>手机号</View>
                                </View>
                                <View className={'flex items-center space-x-2'}>
                                    <Input name={'mobile'} ref={this.mobileRef} className={'text-right'} />
                                </View>
                            </View>
                            <View className={'p-4 flex items-center justify-between'}>
                                <View className={'flex items-center space-x-2'}>
                                    <View>验证码</View>
                                </View>
                                <View className={'flex items-center space-x-2'}>
                                    <Input name={'code'}  className={'text-right'} />
                                    <Button className={classNames('px-4 py-2')} style={{color: 'black'}} onClick={this.handleSendCode} disabled={this.state.sending}>{this.state.sending ? this.state.counter+'':'获取验证码'}</Button>
                                </View>
                            </View>
                        </View>
                        <View className={'container mx-auto mt-4 text-center'}>
                            <Button className={'btn-primary'} formType={'submit'} disabled={this.state.saving}>确定</Button>
                        </View>
                    </Form>
                </LoginView>
            </PageLayout>
        );
    }
}
