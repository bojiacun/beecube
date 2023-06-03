import React, {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import Taro from "@tarojs/taro";
import utils from "../../lib/utils";
import {View, Navigator, Button} from "@tarojs/components";
import {Form, Radio, Input} from '@taroify/core';
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

    constructor(props: any) {
        super(props);
        this.handleSexChange = this.handleSexChange.bind(this);
        this.handleChooseAvatar = this.handleChooseAvatar.bind(this);
        this.handleChooseAvatarNative = this.handleChooseAvatarNative.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({sdkVersion: Taro.getAppBaseInfo().SDKVersion});
        request.get('/app/api/members/profile').then(res => {
            let userInfo = res.data.result;
            this.setState({userInfo: userInfo});
            setTimeout(() => {
            }, 500);
            Taro.setStorageSync("EDIT-USER", JSON.stringify(userInfo));
        });
    }

    componentDidShow() {
        this.setState({userInfo: this.getEditUser()});
    }

    saveEditUser() {
        Taro.setStorageSync("EDIT-USER", JSON.stringify(this.state.userInfo));
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
            this.saveEditUser();
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
                this.saveEditUser();
                utils.showSuccess(false, '上传成功');
            });
        });
    }

    renderNicknameAvatar() {
        const userInfo = this.state.userInfo;

        if (utils.compareVersion(this.state.sdkVersion, '2.21.2')) {
            return (
                <>
                    <Form.Item name={'avatar'} className={'items-center'} rightIcon={<ArrowRight/>}>
                        <Form.Label className={'font-bold'}>头像</Form.Label>
                        <Form.Control>
                            <Button className={'overflow-hidden rounded-full'} style={{border: 'none', margin: 0, padding: 0, width: 30, height: 30}}
                                    onChooseAvatar={this.handleChooseAvatarNative} openType={'chooseAvatar'} plain={true}>
                                <FallbackImage src={userInfo?.avatar} errorImage={avatarImage} className={'w-full h-full'}/>
                            </Button>
                        </Form.Control>
                    </Form.Item>
                    <Form.Item name={'nickname'} className={'items-center'} rightIcon={<ArrowRight/>}>
                        <Form.Label className={'font-bold'}>昵称</Form.Label>
                        <Form.Control>
                            <Input name={'nickname'} type={'nickname'} className={'text-right'}/>
                        </Form.Control>
                    </Form.Item>
                </>
            );
        }
        return (
            <>
                <Form.Item name={'avatar'} className={'items-center'} onClick={this.handleChooseAvatar}>
                    <Form.Label>头像</Form.Label>
                    <Form.Control>
                        <FallbackImage src={userInfo?.avatar} errorImage={avatarImage} style={{width: 30, height: 30}}/>
                    </Form.Control>
                </Form.Item>
                <Form.Item name={'nickname'} className={'items-center'} rightIcon={<ArrowRight/>}>
                    <Form.Label className={'font-bold'}>昵称</Form.Label>
                    <Form.Control>
                        <View>{userInfo?.nickname}</View>
                    </Form.Control>
                </Form.Item>
            </>
        );
    }

    handleSubmit(e) {

        let userInfo = this.state.userInfo;
        let values = e.detail.value;
        userInfo.nickname = values.nickname;

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

    handleSexChange(e) {
        const index = e.detail.value;
        this.state.userInfo.sex = parseInt(index) + 1;
        this.setState({userInfo: this.state.userInfo});
        this.saveEditUser();
    }

    updateUserInfo(userInfo) {
        //提交到远程服务器
        saveUserInfo(userInfo).then(res => {
            this.props.updateUserInfo(res.data.result);
            this.setState({saving: false});
            this.saveEditUser();
            utils.showSuccess(true);
        });
    }

    render() {
        const {userInfo} = this.state;

        return (
            <PageLayout statusBarProps={{title: '个人资料'}}>
                <Form onSubmit={this.handleSubmit} controlAlign={'right'}>
                    <View className={'bg-white mt-4 text-gray-600'}>
                        <View className={'font-bold text-lg p-4 pb-0'}>基本信息</View>
                        {this.renderNicknameAvatar()}
                        <Form.Item name={'sex'} className={'items-center'}>
                            <Form.Label className={'font-bold'}>性别</Form.Label>
                            <Form.Control>
                                <Radio.Group direction="horizontal">
                                    <Radio name="1">男</Radio>
                                    <Radio name="2">女</Radio>
                                </Radio.Group>
                            </Form.Control>
                        </Form.Item>
                    </View>
                    <View className={'bg-white mt-4 text-gray-600'}>
                        <View className={'font-bold text-lg p-4 pb-0'}>实名资料</View>
                        <Form.Item onClick={()=>Taro.navigateTo({url: 'profile/phone'})} name={'mobile'} className={'items-center'} rightIcon={<ArrowRight/>}>
                            <Form.Label className={'font-bold'}>手机号</Form.Label>
                            <Form.Control>
                                <View>{userInfo?.phone}</View>
                            </Form.Control>
                        </Form.Item>
                        {/*<View className={''}>*/}
                        {/*    <Navigator className={'flex items-center justify-between p-4'} url={'profile/email'}>*/}
                        {/*        <View className={'flex items-center space-x-2'}>*/}
                        {/*            <View>邮箱</View>*/}
                        {/*        </View>*/}
                        {/*        <View className={'flex items-center space-x-2'}>*/}
                        {/*            <View>{userInfo?.email}</View>*/}
                        {/*            <View className={'iconfont icon-youjiantou_huaban'}/>*/}
                        {/*        </View>*/}
                        {/*    </Navigator>*/}
                        {/*</View>*/}
                        <Form.Item onClick={()=>Taro.navigateTo({url: 'profile/auth'})} name={'auth'} className={'items-center'} rightIcon={<ArrowRight/>}>
                            <Form.Label className={'font-bold'}>实名认证</Form.Label>
                            <Form.Control>
                                <View>{userInfo?.authStatus == 2 ? '已认证' : '未认证'}</View>
                            </Form.Control>
                        </Form.Item>
                    </View>
                    <View className={'container mx-auto mt-4 text-center'}>
                        <Button className={'btn btn-danger w-56'} formType={'submit'} disabled={this.state.saving}>保存</Button>
                    </View>
                </Form>
            </PageLayout>
        );
    }
}
