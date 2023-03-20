import React, {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import Taro from "@tarojs/taro";
import utils from "../../lib/utils";
import {View, Navigator, Picker, Input, Form, Button} from "@tarojs/components";
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
    state:any = {
        sdkVersion: '',
        sexes: [
            {id: 1, name: '男'},
            {id: 2, name: '女'},
        ],
        saving: false,
        userInfo: null,
    }

    nicknameInputRef = React.createRef();

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
            setTimeout(()=>{
                // @ts-ignore
                this.nicknameInputRef.current.value = userInfo.nickname;
            }, 500);
            Taro.setStorageSync("EDIT-USER", JSON.stringify(userInfo));
        });
    }

    componentDidShow() {
        let editUser = Taro.getStorageSync("EDIT-USER");
        if(editUser) {
            this.setState({userInfo: JSON.parse(editUser)});
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
            let userInfo = this.props.context.userInfo;
            userInfo.avatar = avatar;
            this.setState({userInfo: userInfo});
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
                utils.showSuccess(false, '上传成功');
            });
        });
    }

    renderNicknameAvatar() {
        const userInfo = this.state.userInfo;

        if (utils.compareVersion(this.state.sdkVersion, '2.21.2')) {
            return (
                <>
                    <View className={''}>
                        <Button style={{border: 'none'}} onChooseAvatar={this.handleChooseAvatarNative} openType={'chooseAvatar'} plain={true}
                                className={'p-4 block border-0 flex items-center justify-between p-4'}>
                            <View className={'flex items-center space-x-2'}>
                                <View>我的头像</View>
                            </View>
                            <View className={'flex items-center space-x-2'}>
                                <FallbackImage src={userInfo?.avatar} errorImage={avatarImage} style={{width: 20, height: 20}}/>
                                <View className={'iconfont icon-youjiantou_huaban'}/>
                            </View>
                        </Button>
                    </View>
                    <View className={'flex items-center justify-between p-4'}>
                        <View className={'flex items-center space-x-2'}>
                            <View>昵称</View>
                        </View>
                        <View className={'flex items-center space-x-2'}>
                            <Input ref={this.nicknameInputRef} name={'nickname'} type={'nickname'} className={'text-right'} />
                            <View className={'iconfont icon-youjiantou_huaban'}/>
                        </View>
                    </View>
                </>
            );
        }
        return (
            <>
                <View className={'flex items-center justify-between p-4'} onClick={this.handleChooseAvatar}>
                    <View className={'flex items-center space-x-2'}>
                        <View>我的头像</View>
                    </View>
                    <View className={'flex items-center space-x-2'}>
                        <FallbackImage src={userInfo?.avatar} errorImage={avatarImage} style={{width: 20, height: 20}}/>
                        <View className={'iconfont icon-youjiantou_huaban'}/>
                    </View>
                </View>
                <View className={''}>
                    <Navigator className={'flex items-center justify-between p-4'} url={'profile/nickname'}>
                        <View className={'flex items-center space-x-2'}>
                            <View>昵称</View>
                        </View>
                        <View className={'flex items-center space-x-2'}>
                            <View>{userInfo?.nickname}</View>
                            <View className={'iconfont icon-youjiantou_huaban'}/>
                        </View>
                    </Navigator>
                </View>
            </>
        );
    }

    handleSubmit(e) {

        let userInfo = this.state.userInfo;
        let values = e.detail.value;
        userInfo.nickname = values.nickname;

        if(!userInfo.avatar || userInfo.avatar == '') {
            return utils.showError("请完善头像信息");
        }
        if(!userInfo.nickname || userInfo.nickname == '') {
            return utils.showError("请完善昵称信息");
        }
        if(!userInfo.phone || userInfo.phone == '') {
            return utils.showError("请完善手机信息");
        }


        this.setState({saving: true});
        this.updateUserInfo(userInfo);
    }

    handleSexChange(e) {
        const index = e.detail.value;
        this.state.userInfo.sex = parseInt(index) + 1;
        this.setState({userInfo: this.state.userInfo});
    }

    updateUserInfo(userInfo) {
        //提交到远程服务器
        saveUserInfo(userInfo).then(res => {
            this.props.updateUserInfo(res.data.result);
            this.setState({saving: false});
            utils.showSuccess(true);
        });
    }

    render() {
        const {userInfo} = this.state;
        const {sexes} = this.state;
        const userSex = sexes[userInfo?.sex - 1]?.name || '';

        return (
            <PageLayout statusBarProps={{title: '完善您的信息'}}>
                <Form onSubmit={this.handleSubmit}>
                    <View className={'bg-white divide-y divide-gray-100 text-gray-600'}>
                        {this.renderNicknameAvatar()}
                        <View className={'p-4'}>
                            <Picker onChange={this.handleSexChange} range={this.state.sexes} rangeKey={'name'}>
                                <View className={'flex items-center justify-between'}>
                                    <View className={'flex items-center space-x-2'}>
                                        <View>性别</View>
                                    </View>
                                    <View className={'flex items-center space-x-2'}>
                                        <View>{userSex}</View>
                                        <View className={'iconfont icon-youjiantou_huaban'}/>
                                    </View>
                                </View>
                            </Picker>
                        </View>
                        <View className={''}>
                            <Navigator className={'flex items-center justify-between p-4'} url={'profile/phone'}>
                                <View className={'flex items-center space-x-2'}>
                                    <View>手机号</View>
                                </View>
                                <View className={'flex items-center space-x-2'}>
                                    <View>{userInfo?.phone}</View>
                                    <View className={'iconfont icon-youjiantou_huaban'}/>
                                </View>
                            </Navigator>
                        </View>
                        <View className={''}>
                            <Navigator className={'flex items-center justify-between p-4'} url={'profile/email'}>
                                <View className={'flex items-center space-x-2'}>
                                    <View>邮箱</View>
                                </View>
                                <View className={'flex items-center space-x-2'}>
                                    <View>{userInfo?.email}</View>
                                    <View className={'iconfont icon-youjiantou_huaban'}/>
                                </View>
                            </Navigator>
                        </View>
                        <View className={''}>
                            <Navigator className={'flex items-center justify-between p-4'} url={'profile/auth'}>
                                <View className={'flex items-center space-x-2'}>
                                    <View>实名认证</View>
                                </View>
                                <View className={'flex items-center space-x-2'}>
                                    <View>{userInfo?.authStatus ? '已认证' : '未认证'}</View>
                                    <View className={'iconfont icon-youjiantou_huaban'}/>
                                </View>
                            </Navigator>
                        </View>
                    </View>
                    <View className={'container mx-auto mt-4 text-center'}>
                        <Button className={'btn btn-danger w-56'} formType={'submit'} disabled={this.state.saving}>保存</Button>
                    </View>
                </Form>
            </PageLayout>
        );
    }
}
