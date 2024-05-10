import React, {Component, PropsWithChildren} from "react";
import Taro from "@tarojs/taro";
import {Avatar, Button, ConfigProvider, Field, Form, Input, Radio, Toast} from "@taroify/core";
import PageLayout from "../../layouts/PageLayout";
import {Text, View} from "@tarojs/components";
import {connect} from "react-redux";
import utils from "../../lib/utils";
import request, {APP_ID} from "../../lib/request";
import {setUserInfo} from "../../store/actions";
import styles from "./index.module.scss";
import classNames from "classnames";
import {saveUserInfo} from "./profile/services";

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
        this.handleSendCode = this.handleSendCode.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
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
        request.post('/app/api/sms/send', {mobile: phone}).then(() => {
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

    async handleOnSubmit(e: any) {
        let values = e.detail.value;
        if (!values.phone) {
            return utils.showError('请输入手机号');
        }
        const {settings, context} = this.props;
        const {userInfo} = context;
        if(settings.signName) {
            const res = await request.put("/app/api/sms/check", {mobile: values.phone, ...values});
            if (!res.data.result) {
                return utils.showMessage('验证码不正确').then();
            }
        }
        this.setState({saving: true});
        saveUserInfo({...userInfo, ...values}).then(res=>{
            this.props.updateUserInfo(res.data.result);
            this.setState({saving: false});
            this.saveEditUser(res.data.result);
            utils.showSuccess(true);
        }).catch(()=>this.setState({saving: false}));
    }
    saveEditUser(newUserInfo: any) {
        Taro.setStorageSync("EDIT-USER", JSON.stringify(newUserInfo));
    }

    render() {
        const {settings} = this.props;
        const {app} = this.state;
        return (
            <PageLayout statusBarProps={{title: '绑定手机号'}} containerClassName='flex flex-col items-center'>
                <Form onSubmit={this.handleOnSubmit} ref={this.formRef}>
                    <Toast id='toast' />
                    <View className='py-4 flex flex-col items-center' style={{marginTop: 100}}>
                        <Avatar size='large' src={utils.resolveUrl(app?.logo)} />
                        <View className='font-bold text-xl my-2'>{settings.wxAppName}</View>
                    </View>
                    <View className='mb-4'>
                        <Field className='!p-0' name='phone'>
                            <Input className={styles.bigInput} placeholder='常用手机号' />
                        </Field>
                        <View className='flex ittems-center justify-between w-full'>
                            <Field className='!p-0' name='code'>
                                <Input className={classNames(styles.bigInput, 'flex-1 !mr-4')} placeholder='验证码' />
                            </Field>
                            <View onClick={this.handleSendCode} style={{width: 120, lineHeight: 1}}
                              className={classNames('flex-none flex items-center justify-center !bg-white')}
                            >
                                {this.state.sending ? this.state.counter + '' : '发送验证码'}
                            </View>
                        </View>
                    </View>
                    <Button color='danger' block formType='submit' disabled={this.state.saving}>确认绑定</Button>
                </Form>
            </PageLayout>
        );
    }
}
