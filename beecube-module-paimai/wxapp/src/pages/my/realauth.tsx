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
import {syncEvent} from "@tarojs/components/lib/react/react-component-lib/utils";
import classNames from "classnames";
import {ArrowRight} from "@taroify/icons";

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
    state = {
        saving: false,
        cardImages: ['', ''],
        cardType: '',
        cardTypeOpen: false,
        cardTypes: ['居民身份证', '护照', '港澳居民来往内地通行证（回乡证）', '台胞证'],
    }

    realnameInputRef = React.createRef();
    idCardInputRef = React.createRef();

    constructor(props: any) {
        super(props);
        this.chooseCardFace = this.chooseCardFace.bind(this);
        this.chooseCardBack = this.chooseCardBack.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {

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

                let userInfo = JSON.parse(Taro.getStorageSync("EDIT-USER"));
                // @ts-ignore
                userInfo.realname = this.realnameInputRef.current.value;
                // @ts-ignore
                userInfo.idCard = this.idCardInputRef.current.value;
                Taro.setStorageSync("EDIT-USER", JSON.stringify(userInfo));

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
                let userInfo = JSON.parse(Taro.getStorageSync("EDIT-USER"));
                // @ts-ignore
                userInfo.realname = this.realnameInputRef.current.value;
                // @ts-ignore
                userInfo.idCard = this.idCardInputRef.current.value;
                Taro.setStorageSync("EDIT-USER", JSON.stringify(userInfo));
                this.setState({cardImages: this.state.cardImages});
                utils.showSuccess(false, '上传成功');
            });
        });
    }

    handleSubmit(e) {
        this.setState({saving: true});
        let values = e.detail.value;
        let userInfo = JSON.parse(Taro.getStorageSync("EDIT-USER"));
        userInfo.realname = values.realname;
        userInfo.idCard = values.idCard;
        userInfo.cardFace = this.state.cardImages[0];
        userInfo.cardBack = this.state.cardImages[1];
        Taro.setStorageSync("EDIT-USER", JSON.stringify(userInfo));
        Taro.navigateBack().then();
    }

    render() {
        const {settings} = this.props;
        const {cardType, cardTypeOpen, cardTypes} = this.state;
        let userInfo = JSON.parse(Taro.getStorageSync("EDIT-USER"));

        return (
            <PageLayout statusBarProps={{title: '实名认证'}} style={{backgroundColor: 'white'}}>
                {settings.authPageBanner && <Image src={settings.authPageBanner} className={'w-full'} mode={'widthFix'}/>}
                <Form onSubmit={this.handleSubmit}>
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
                            <Field className={'!p-0'} name={'code'}>
                                <View className={'flex ittems-center justify-between w-full'}>
                                    <Input className={classNames(styles.bigInput, 'flex-1 !mr-4')} placeholder={'验证码'}/>
                                    <View style={{width: 120, lineHeight: 1}} className={classNames(styles.bigInput, 'flex-none flex items-center justify-center !bg-white')}>
                                        发送验证码
                                    </View>
                                </View>
                            </Field>
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
                                        {!this.state.cardImages[0] && <FallbackImage src={'https://static.winkt.cn/card1.png'} className={'block w-full h-full'} />}
                                    </View>
                                    {!this.state.cardImages[0] && <View className={'text-center text-black-600 mt-2'}>上传正面人像照片</View>}
                                </View>
                                <View onClick={this.chooseCardBack}>
                                    <View className={'flex relative flex-col items-center justify-center rounded-lg h-28'}>
                                        {this.state.cardImages[1] && <FallbackImage mode={'aspectFit'} src={this.state.cardImages[1]} className={'block w-full h-full'}/>}
                                        {!this.state.cardImages[1] && <FallbackImage src={'https://static.winkt.cn/card2.png'} className={'block w-full h-full'} />}
                                    </View>
                                    {!this.state.cardImages[1] && <View className={'text-center text-black-600 mt-2'}>上传背面国徽照片</View>}
                                </View>
                            </View>
                            <View className={'text-sm text-stone-400 mt-4'}>
                                <Text className={'text-red-600'}>提示:</Text>
                                <Text>如因证件不清晰导致识别不准确，请重新上传，请上传真实有效证件，信息提交后不可更改</Text>
                            </View>
                        </View>
                    </View>


                    <View className={'container mx-auto mt-4 text-center'}>
                        {userInfo?.authStatus == 0 && <Button className={'btn btn-danger w-56'} formType={'submit'} disabled={this.state.saving}>保存并返回</Button>}
                        {userInfo?.authStatus == 1 && <Button className={'btn btn-warning w-56'} onClick={() => utils.navigateBack()}>审核中,点击返回</Button>}
                        {userInfo?.authStatus == 2 && <Button className={'btn btn-success w-56'} onClick={() => utils.navigateBack()}>已认证通过</Button>}
                    </View>
                </Form>
            </PageLayout>
        );
    }
}
