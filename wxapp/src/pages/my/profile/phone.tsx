import React, {Component} from "react";
import PageLayout from "../../../layouts/PageLayout";
import LoginView from "../../../components/login";
import {Button, Form, Input, View} from "@tarojs/components";
import {connect} from "react-redux";
import request from "../../../lib/request";
import utils from "../../../lib/utils";

// @ts-ignore
@connect((state: any) => (
    {
        context: state.context
    }
))
export default class Index extends Component<any, any> {

    state = {
        sending: false,
        counter: 60,
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
                    }
                    return v;
                })
            }, 1000);
            this.setState({sending: false});
        });
    }

    handleSubmit(e) {
        console.log(e);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        const {userInfo} = this.props.context;
        return (
            <PageLayout statusBarProps={{title: '手机号认证'}}>
                <LoginView refreshUserInfo={true}>
                    <Form onSubmit={this.handleSubmit}>
                        <View className={'bg-white divide-y divide-gray-100 text-gray-600 mt-4'}>
                            <View className={'p-4 flex items-center justify-between'}>
                                <View className={'flex items-center space-x-2'}>
                                    <View>手机号</View>
                                </View>
                                <View className={'flex items-center space-x-2'}>
                                    <Input ref={this.mobileRef} value={userInfo.phone} className={'text-right'} />
                                </View>
                            </View>
                            <View className={'p-4 flex items-center justify-between'}>
                                <View className={'flex items-center space-x-2'}>
                                    <View>验证码</View>
                                </View>
                                <View className={'flex items-center space-x-2'}>
                                    <Input value={userInfo.phone} className={'text-right'} />
                                    <Button className={'px-4 py-2'} onClick={this.handleSendCode} disabled={this.state.sending}>{this.state.sending ? this.state.counter:'获取验证码'}</Button>
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
