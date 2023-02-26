import {Component} from "react";
import PageLayout from "../../../layouts/PageLayout";
import LoginView from "../../../components/login";
import {Button, Form, Input, View} from "@tarojs/components";
import {connect} from "react-redux";

// @ts-ignore
@connect((state: any) => (
    {
        context: state.context
    }
))
export default class Index extends Component<any, any> {

    handleSubmit(e) {
        console.log(e);
    }

    render() {
        const {userInfo} = this.props.context;
        return (
            <PageLayout statusBarProps={{title: '实名认证'}}>
                <LoginView refreshUserInfo={true}>
                    <Form onSubmit={this.handleSubmit}>
                        <View className={'bg-white divide-y divide-gray-100 text-gray-600 mt-4'}>
                            <View className={'flex items-center space-x-2'}>
                                <View>手机号</View>
                            </View>
                            <View className={'flex items-center space-x-2'}>
                                <Input value={userInfo.phone}/>
                            </View>
                        </View>
                        <View className={'bg-white divide-y divide-gray-100 text-gray-600 mt-4'}>
                            <View className={'flex items-center space-x-2'}>
                                <View>验证码</View>
                            </View>
                            <View className={'flex items-center space-x-2'}>
                                <Button>获取验证码</Button>
                            </View>
                        </View>
                    </Form>
                </LoginView>
            </PageLayout>
        );
    }
}
