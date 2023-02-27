import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import Taro from "@tarojs/taro";
import utils from "../../lib/utils";
import {View, Navigator, Picker, Input, Form, Button} from "@tarojs/components";
import LoginView from "../../components/login";
import {connect} from "react-redux";
import FallbackImage from "../../components/FallbackImage";
import avatarImage from '../../assets/images/avatar.png';
import {setUserInfo} from "../../store/actions";
import {saveUserInfo} from "./profile/services";
import {API_URL} from "../../lib/request";

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
    state = {
        sdkVersion: '',
        sexes: [
            {id: 1, name: '男'},
            {id: 2, name: '女'},
        ],
        saving: false,
    }

    constructor(props: any) {
        super(props);
        this.handleSexChange = this.handleSexChange.bind(this);
        this.handleChooseAvatar = this.handleChooseAvatar.bind(this);
        this.handleChooseAvatarNative = this.handleChooseAvatarNative.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        this.setState({sdkVersion: Taro.getAppBaseInfo().SDKVersion});
    }

    handleChooseAvatarNative(e) {
        utils.showLoading('上传中');
        const token = Taro.getStorageSync("TOKEN");
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
            this.props.updateUserInfo(userInfo);
            utils.showSuccess(false, '上传成功');
        });
    }

    handleChooseAvatar() {
        Taro.chooseImage({count: 1, sourceType: ['album', 'camera']}).then(res => {
            const file = res.tempFilePaths[0];
            const token = Taro.getStorageSync("TOKEN");
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
                let userInfo = this.props.context.userInfo;
                userInfo.avatar = avatar;
                this.props.updateUserInfo(userInfo);
                utils.showSuccess(false, '上传成功');
            });
        });
    }

    renderNicknameAvatar() {
        const {context} = this.props;
        const {userInfo} = context;

        if (utils.compareVersion(this.state.sdkVersion, '2.21.2')) {
            return (
                <>
                    <View className={''}>
                        <Button style={{border: 'none'}} onChooseAvatar={this.handleChooseAvatarNative} openType={'chooseAvatar'} plain={true}
                                className={'p-4 block border-0 flex items-center justify-between '}>
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
                            <Input name={'nickname'} type={'nickname'} value={userInfo?.nickname} className={'text-right'}/>
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
        this.setState({saving: true});
        let userInfo = this.props.context.userInfo;
        let values = e.detail.value;
        userInfo.nickname = values.nickname;
        this.updateUserInfo(userInfo);
    }

    handleSexChange(e) {
        const index = e.detail.value;
        let userInfo = this.props.context.userInfo;
        userInfo.sex = index + 1;
        this.props.updateUserInfo(userInfo);
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
        const {context} = this.props;
        const {userInfo} = context;

        const userSex = userInfo?.sex ? this.state.sexes[userInfo?.sex - 1].name : '';


        return (
            <PageLayout statusBarProps={{title: '完善您的信息'}}>
                <LoginView>
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
                            <Button className={'btn-primary'} formType={'submit'} disabled={this.state.saving}>保存</Button>
                        </View>
                    </Form>
                </LoginView>
            </PageLayout>
        );
    }
}
