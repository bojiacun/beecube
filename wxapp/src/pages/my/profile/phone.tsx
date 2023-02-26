import {Component} from "react";
import PageLayout from "../../../layouts/PageLayout";
import LoginView from "../../../components/login";
import {View} from "@tarojs/components";


export default class Index extends Component<any, any> {
    render() {
        return (
            <PageLayout statusBarProps={{title: '手机号认证'}}>
                <LoginView refreshUserInfo={true}>
                    <View className={'bg-white divide-y divide-gray-100 text-gray-600 mt-4'}>
                        <View className={'flex items-center space-x-2'}>
                            <View>手机号</View>
                        </View>
                        <View className={'flex items-center space-x-2'}>
                        </View>
                    </View>
                </LoginView>
            </PageLayout>
        );
    }
}
