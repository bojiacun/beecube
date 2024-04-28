import React, {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import Taro from "@tarojs/taro";
import utils from "../../lib/utils";
import {View, Button, Navigator} from "@tarojs/components";
import {Form, Radio, Input, Cell, Button as TaroifyButton} from '@taroify/core';
import {ArrowRight} from '@taroify/icons';
import {connect} from "react-redux";
import FallbackImage from "../../components/FallbackImage";
import avatarImage from '../../assets/images/avatar.png';
import {setUserInfo} from "../../store/actions";
import {saveUserInfo} from "./profile/services";
import request, {API_URL} from "../../lib/request";

// @ts-ignore
@connect((state: any) => (
    {
        systemInfo: state.context.systemInfo,
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
export default class Index extends Component<any, any> {
    state: any = {
        sdkVersion: '',
        saving: false,
        userInfo: null,
    }
    formRef = React.createRef();

    constructor(props: any) {
        super(props);
        this.handleChooseAvatar = this.handleChooseAvatar.bind(this);
        this.handleChooseAvatarNative = this.handleChooseAvatarNative.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleValuesChanged = this.handleValuesChanged.bind(this);
        this.handleNicknameChanged = this.handleNicknameChanged.bind(this);
    }

    componentDidMount() {
        this.setState({sdkVersion: Taro.getAppBaseInfo().SDKVersion});
        request.get('/app/api/members/profile').then(res => {
            let userInfo = res.data.result;
            userInfo.sex = userInfo.sex+'';
            this.setState({userInfo: userInfo});
            this.saveEditUser(userInfo);
            // @ts-ignore
            this.formRef?.current.setFieldsValue(userInfo);
        });
    }

    componentDidShow() {
        const userInfo = this.getEditUser();
        this.setState({userInfo: userInfo});
        // @ts-ignore
        this.formRef?.current?.setFieldsValue(userInfo);
    }

    saveEditUser(newUserInfo: any) {
        Taro.setStorageSync("EDIT-USER", JSON.stringify(newUserInfo));
    }

    getEditUser() {
        let editUser = Taro.getStorageSync("EDIT-USER");
        if (editUser) {
            return JSON.parse(editUser);
        }
    }

    async handleChooseAvatarNative(e) {
        // utils.showLoading('上传中');
        const res = await request.get('/app/api/members/tmptoken');
        const token = res.data.result;
        let file = e.detail.avatarUrl;
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
            let avatar = result.result.url;
            let userInfo = this.state.userInfo;
            userInfo.avatar = avatar;
            this.setState({userInfo: userInfo});
            this.saveEditUser(userInfo);
            utils.showSuccess(false, '上传成功');
        });
    }

    handleChooseAvatar() {
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
                let avatar = result.result.url;
                let userInfo = this.state.userInfo;
                userInfo.avatar = avatar;
                this.setState({userInfo: userInfo});
                this.saveEditUser(userInfo);
                utils.showSuccess(false, '上传成功');
            });
        });
    }


    handleSubmit(e) {
        let userInfo = this.state.userInfo;
        let values = e.detail.value;
        userInfo.nickname = values.nickname;
        userInfo.sex = values.sex;
        if (!userInfo.avatar || userInfo.avatar == '') {
            return utils.showError("请完善头像信息");
        }
        if (!userInfo.nickname || userInfo.nickname == '') {
            return utils.showError("请完善昵称信息");
        }
        if (!userInfo.phone || userInfo.phone == '') {
            return utils.showError("请完善手机信息");
        }
        this.setState({saving: true});
        this.updateUserInfo(userInfo);
        //更新globalData数据
        let app = Taro.getApp();
        if (!app.globalData) {
            app.globalData = {};
        }
        app.globalData.userInfo = userInfo;
    }

    handleValuesChanged(values) {
        console.log('values changed', values);
        const newUserInfo = {...this.state.userInfo, ...values};
        this.setState({userInfo: newUserInfo});
        this.saveEditUser(newUserInfo);
    }

    handleNicknameChanged(e) {
        const nickname = e.detail.value;
        const newUserInfo = this.state.userInfo;
        newUserInfo.nickname = nickname;
        this.saveEditUser(newUserInfo);
    }

    updateUserInfo(userInfo) {
        //提交到远程服务器
        saveUserInfo(userInfo).then(res => {
            this.props.updateUserInfo(res.data.result);
            this.setState({saving: false});
            this.saveEditUser(userInfo);
            utils.showSuccess(true);
        });
    }

    renderNicknameAvatar() {
        const userInfo = this.state.userInfo;
        if (utils.compareVersion(this.state.sdkVersion, '2.21.2')) {
            return (
                <>
                    <Form.Item className={'items-center'} rightIcon={<ArrowRight/>}>
                        <Form.Label>头像</Form.Label>
                        <Form.Control>
                            <Button className={'overflow-hidden rounded-full text-right'} style={{border: 'none', margin: 0, padding: 0, width: '100%', height: 30, display: 'inline-block'}}
                                    onChooseAvatar={this.handleChooseAvatarNative} openType={'chooseAvatar'} plain={true}>
                                <FallbackImage src={userInfo?.avatar} errorImage={avatarImage} className={'h-full rounded-full overflow-hidden'} style={{width: 30, height: 30}} />
                            </Button>
                        </Form.Control>
                    </Form.Item>
                    <Form.Item name={'nickname'} className={'items-center'} rightIcon={<ArrowRight/>}>
                        <Form.Label>昵称</Form.Label>
                        <Form.Control>
                            <Input type={'nickname'} className={'text-right'} onInput={this.handleNicknameChanged} />
                        </Form.Control>
                    </Form.Item>
                </>
            );
        }
        return (
            <>
                <Form.Item className={'items-center'} onClick={this.handleChooseAvatar}>
                    <Form.Label>头像</Form.Label>
                    <Form.Control>
                        <FallbackImage src={userInfo?.avatar} errorImage={avatarImage} style={{width: 30, height: 30}}/>
                    </Form.Control>
                </Form.Item>
                <Form.Item onClick={()=>Taro.navigateTo({url: '/pages/my/realauth'})} className={'items-center'} rightIcon={<ArrowRight/>}>
                    <Form.Label>昵称</Form.Label>
                    <Form.Control>
                        <View>{userInfo?.nickname}</View>
                    </Form.Control>
                </Form.Item>
            </>
        );
    }
    render() {
        const {userInfo} = this.state;
        return (
            <PageLayout statusBarProps={{title: '个人资料'}}>
                <Form onSubmit={this.handleSubmit} controlAlign={'right'} ref={this.formRef}>
                    <View className={'bg-white mt-4 text-gray-600'}>
                        <View className={'text-lg p-4 pb-0'}>基本信息</View>
                        {this.renderNicknameAvatar()}
                        <Form.Item name={'sex'} className={'items-center'}>
                            <Form.Label>性别</Form.Label>
                            <Form.Control>
                                <Radio.Group direction="horizontal">
                                    <Radio name="1" className={'radio-red-color'}>男</Radio>
                                    <Radio name="2" className={'radio-red-color'}>女</Radio>
                                </Radio.Group>
                            </Form.Control>
                        </Form.Item>
                    </View>
                    <View className={'bg-white mt-4 text-gray-600'}>
                        <View className={'text-lg p-4 pb-0'}>实名资料</View>
                        <Form.Item onClick={()=>Taro.navigateTo({url: '/pages/my/realauth'})} className={'items-center'} rightIcon={<ArrowRight/>}>
                            <Form.Label>手机号</Form.Label>
                            <Form.Control>
                                <View>{userInfo?.phone}</View>
                            </Form.Control>
                        </Form.Item>
                        <Form.Item onClick={()=>Taro.navigateTo({url: '/pages/my/realauth'})} className={'items-center'} rightIcon={<ArrowRight/>}>
                            <Form.Label>实名认证</Form.Label>
                            <Form.Control>
                                {userInfo?.authStatus == 0 && <View>未认证</View>}
                                {userInfo?.authStatus == 1 && <View>审核中</View>}
                                {userInfo?.authStatus == 2 && <View>已认证</View>}
                            </Form.Control>
                        </Form.Item>
                    </View>
                    <View className={'bg-white mt-4 text-gray-600'}>
                        <View className={'text-lg p-4 pb-0'}>文化推荐官</View>
                        <Navigator url={'/pages/my/qrcode'}>
                            <Cell rightIcon={<ArrowRight />} title={'我的二维码'} />
                        </Navigator>
                    </View>
                    <View className={'container mx-auto mt-4 text-center'}>
                        <TaroifyButton className={'w-56'} formType={'submit'} color={'danger'} shape={'round'} disabled={this.state.saving}>保存</TaroifyButton>
                    </View>
                </Form>
            </PageLayout>
        );
    }
}
