import React, {Component} from "react";
import {Image, Text, View} from "@tarojs/components";
import {connect} from "react-redux";
import Taro from "@tarojs/taro";
import utils from "../../lib/utils";
import request, {API_URL} from "../../lib/request";
import PageLayout from "../../layouts/PageLayout";
import FallbackImage from "../../components/FallbackImage";
import {setUserInfo} from "../../store/actions";
import {Field, Form, Input, Picker, Popup, Button} from "@taroify/core";
import styles from "./index.module.scss";
import classNames from "classnames";
import {saveUserInfo} from "./profile/services";
import PageLoading from "../../components/pageloading";

// @ts-ignore
@connect((state: any) => (
    {
        context: state.context,
        settings: state.context.settings,
    }
), (dispatch) => {
    return {
        updateUserInfo(userInfo) {
            dispatch(setUserInfo(userInfo));
        }
    }
})
export default class Index extends Component<any, any> {
    state: any = {
        sending: false,
        counter: 60,
        userInfo: null,
        saving: false,
        cardImages: ['', ''],
        cardType: '',
        cardTypeOpen: false,
        cardTypes: ['居民身份证', '护照', '港澳居民来往内地通行证（回乡证）', '台胞证'],
    }

    timer: any;
    formRef: any;

    constructor(props: any) {
        super(props);
        this.chooseCardFace = this.chooseCardFace.bind(this);
        this.chooseCardBack = this.chooseCardBack.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSendCode = this.handleSendCode.bind(this);
        this.formRef = React.createRef();
    }

    componentDidMount() {
        request.get('/app/api/members/profile').then(res=>{
            let userInfo = res.data.result;
            this.setState({userInfo, cardImages:[userInfo.cardFace, userInfo.cardBack], cardType: userInfo.cardType});
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

    async chooseCardFace() {
        Taro.chooseImage({count: 1, sourceType: ['album', 'camera']}).then(async res => {
            const file = res.tempFilePaths[0];
            const res1 = await request.get('/app/api/members/tmptoken');
            const token = res1.data.result;
            //upload image
            utils.showLoading('上传中');
            Taro.uploadFile({
                url: API_URL + '/sys/oss/file/upload',
                name: 'file',
                filePath: file,
                header: {
                    "X-Access-Token": token,
                    "Authorization": token,
                    "Content-Type": 'application/json'
                }
            }).then((res: any) => {
                let result = JSON.parse(res.data);
                this.state.cardImages[0] = result.result.url;
                this.setState({cardImages: this.state.cardImages});
                utils.showSuccess(false, '上传成功');
            });
        });
    }

    async chooseCardBack() {
        Taro.chooseImage({count: 1, sourceType: ['album', 'camera']}).then(async res => {
            const file = res.tempFilePaths[0];
            const res1 = await request.get('/app/api/members/tmptoken');
            const token = res1.data.result;
            //upload image
            utils.showLoading('上传中');
            Taro.uploadFile({
                url: API_URL + '/sys/oss/file/upload',
                name: 'file',
                filePath: file,
                header: {
                    "X-Access-Token": token,
                    "Authorization": token,
                    "Content-Type": 'application/json'
                }
            }).then((res: any) => {
                let result = JSON.parse(res.data);
                this.state.cardImages[1] = result.result.url;
                this.setState({cardImages: this.state.cardImages});
                utils.showSuccess(false, '上传成功');
            });
        });
    }

    async handleSubmit(e) {
        const {settings, context} = this.props;
        const {userInfo} = context;
        let values = e.detail.value;
        values.cardType = this.state.cardType;
        values.cardFace = this.state.cardImages[0];
        values.cardBack = this.state.cardImages[1];
        values.id = userInfo.id;
        if (!values.realname) {
            return utils.showError('请输入真实姓名');
        }
        if (!values.phone) {
            return utils.showError('请输入手机号');
        }
        if (!values.code) {
            return utils.showError('请输入验证码');
        }
        if (!values.cardType) {
            return utils.showError('请选择证件类型');
        }
        if (!values.cardFace) {
            return utils.showError('请上传正面人像照');
        }
        if (!values.cardBack) {
            return utils.showError('请上传背面国徽照');
        }
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
        const {cardType, cardTypeOpen, cardTypes, userInfo} = this.state;

        if(!userInfo) return <PageLoading />;

        return (
            <PageLayout statusBarProps={{title: '实名认证'}} style={{backgroundColor: 'white'}}>
                {settings.authPageBanner && <Image src={settings.authPageBanner} className={'w-full'} mode={'widthFix'}/>}
                <Form onSubmit={this.handleSubmit} ref={this.formRef} defaultValues={userInfo}>
                    <View className={'p-4 space-y-4'}>
                        <View>
                            <Form.Label>真实姓名<Text className={'text-red-600'}>*</Text></Form.Label>
                            <Field className={'!p-0'} name={'realname'}>
                                <Input className={styles.bigInput} placeholder={'请输入真实姓名'}/>
                            </Field>
                        </View>
                        <View>
                            <Form.Label>手机号<Text className={'text-red-600'}>*</Text></Form.Label>
                            <Field className={'!p-0'} name={'phone'}>
                                <Input className={styles.bigInput} placeholder={'常用手机号'}/>
                            </Field>
                            <View className={'flex ittems-center justify-between w-full'}>
                                <Field className={'!p-0'} name={'code'}>
                                    <Input className={classNames(styles.bigInput, 'flex-1 !mr-4')} placeholder={'验证码'}/>
                                </Field>
                                <View onClick={this.handleSendCode} style={{width: 120, lineHeight: 1}}
                                      className={classNames(styles.bigInput, 'flex-none flex items-center justify-center !bg-white')}>
                                    {this.state.sending ? this.state.counter + '' : '发送验证码'}
                                </View>
                            </View>
                        </View>
                        <View>
                            <Form.Label>证件类型<Text className={'text-red-600'}>*</Text></Form.Label>
                            <Input value={cardType} onClick={() => this.setState({cardTypeOpen: true})} readonly className={styles.bigInput}/>
                            <Popup mountOnEnter={false} open={cardTypeOpen} rounded placement="bottom" onClose={() => this.setState({cardTypeOpen: false})}>
                                <Picker
                                    onCancel={() => this.setState({cardTypeOpen: false})}
                                    onConfirm={(newValue) => {
                                        if (newValue.length == 0) {
                                            newValue = [cardTypes[0]];
                                        }
                                        this.setState({cardTypeOpen: false, cardType: newValue[0]});
                                    }}
                                >
                                    <Picker.Toolbar>
                                        <Picker.Button>取消</Picker.Button>
                                        <Picker.Button>确认</Picker.Button>
                                    </Picker.Toolbar>
                                    <Picker.Column>
                                        {cardTypes.map((item: any) => {
                                            return (
                                                <Picker.Option value={item}>{item}</Picker.Option>
                                            );
                                        })};
                                    </Picker.Column>
                                </Picker>
                            </Popup>
                        </View>
                        <View>
                            <Form.Label>上传身份证<Text className={'text-red-600'}>*</Text></Form.Label>
                            <View className={'grid grid-cols-2 gap-4 mt-4'}>
                                <View onClick={this.chooseCardFace}>
                                    <View className={'flex relative flex-col items-center justify-center rounded-lg h-28'}>
                                        {this.state.cardImages[0] && <FallbackImage mode={'aspectFit'} src={this.state.cardImages[0]} className={'block w-full h-full'}/>}
                                        {!this.state.cardImages[0] && <FallbackImage src={'https://static.winkt.cn/card1.png'} className={'block w-full h-full'}/>}
                                    </View>
                                    {!this.state.cardImages[0] && <View className={'text-center text-black-600 mt-2'}>上传正面人像照片</View>}
                                </View>
                                <View onClick={this.chooseCardBack}>
                                    <View className={'flex relative flex-col items-center justify-center rounded-lg h-28'}>
                                        {this.state.cardImages[1] && <FallbackImage mode={'aspectFit'} src={this.state.cardImages[1]} className={'block w-full h-full'}/>}
                                        {!this.state.cardImages[1] && <FallbackImage src={'https://static.winkt.cn/card2.png'} className={'block w-full h-full'}/>}
                                    </View>
                                    {!this.state.cardImages[1] && <View className={'text-center text-black-600 mt-2'}>上传背面国徽照片</View>}
                                </View>
                            </View>
                            <View className={'text-sm text-stone-400 mt-4'}>
                                <Text className={'text-red-600'}>提示:</Text>
                                <Text>如因证件不清晰导致识别不准确，请重新上传，请上传真实有效证件，信息提交后不可更改</Text>
                            </View>
                        </View>
                        <View className={'my-4'}>
                            {!userInfo?.authStatus && <Button color={'danger'} block formType={'submit'} disabled={this.state.saving}>保存并返回</Button>}
                            {userInfo?.authStatus == 1 && <Button disabled block onClick={() => utils.navigateBack()}>审核中请耐心等待</Button>}
                            {userInfo?.authStatus == 2 && <Button color={'success'} block onClick={() => utils.navigateBack()}>已认证通过</Button>}
                        </View>
                    </View>
                </Form>
            </PageLayout>
        );
    }
}
