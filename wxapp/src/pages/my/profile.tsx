import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import Taro from "@tarojs/taro";
import utils from "../../lib/utils";
import {View} from "@tarojs/components";
import LoginView from "../../components/login";
import {connect} from "react-redux";
import FallbackImage from "../../components/FallbackImage";
import avatarImage from '../../assets/images/avatar.png';

// @ts-ignore
@connect((state: any) => (
    {
        systemInfo: state.context.systemInfo,
        settings: state.context.settings,
        context: state.context
    }
))
export default class Index extends Component<any, any> {
    state = {
        sdkVersion: '',
    }

    componentWillMount() {
        this.setState({sdkVersion: Taro.getAppBaseInfo().SDKVersion});
    }

    renderNicknameAvatar() {
        const {context} = this.props;
        const {userInfo} = context;

        if (utils.compareVersion(this.state.sdkVersion, '2.21.2')) {
            return (
                <>
                    <View className={'flex items-center justify-between py-2.5 px-4'}>
                        <View className={'flex items-center space-x-2'}>
                            <View>我的头像</View>
                        </View>
                        <View className={'flex items-center space-x-2'}>
                            <FallbackImage src={userInfo?.avatar} errorImage={avatarImage}  style={{width: 20, height: 20}} />
                            <View className={'iconfont icon-youjiantou_huaban'}/>
                        </View>
                    </View>
                </>
            );
        }
        return <></>
    }

    render() {
        return (
            <PageLayout statusBarProps={{title: '完善您的信息'}}>
                <LoginView refreshUserInfo={true}>
                    <View className={'bg-white divide-y divide-gray-100 text-gray-600'}>
                        {this.renderNicknameAvatar()}
                    </View>
                </LoginView>
            </PageLayout>
        );
    }
}
