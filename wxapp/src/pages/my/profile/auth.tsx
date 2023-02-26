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

    state = {
        saving: false,
    }

    handleSubmit(e) {
        console.log(e);
    }

    render() {
        return (
            <PageLayout statusBarProps={{title: '实名认证'}}>
                <LoginView refreshUserInfo={true}>
                    <Form onSubmit={this.handleSubmit}>
                        <View className={'bg-white divide-y divide-gray-100 text-gray-600 mt-4'}>
                            <View className={'p-4 flex items-center justify-between'}>
                                <View className={'flex items-center space-x-2'}>
                                    <View>真实姓名</View>
                                </View>
                                <View className={'flex items-center space-x-2'}>
                                    <Input name={'realname'} className={'text-right'}/>
                                </View>
                            </View>
                            <View className={'p-4 flex items-center justify-between'}>
                                <View className={'flex items-center space-x-2'}>
                                    <View>身份证号</View>
                                </View>
                                <View className={'flex items-center space-x-2'}>
                                    <Input name={'idCard'} className={'text-right'}/>
                                </View>
                            </View>
                        </View>
                        <View className={'grid grid-cols-2 gap-4 mt-4 px-4'}>
                            <View>
                                <View className={'flex flex-col items-center justify-center space-y-4 bg-gray-200 rounded-lg h-28'}>
                                    <View>身份证正面照</View>
                                    <View></View>
                                </View>
                            </View>
                            <View>

                            </View>
                        </View>
                        <View className={'container mx-auto mt-4 text-center'}>
                            <Button className={'btn-primary'} formType={'submit'} disabled={this.state.saving}>确定</Button>
                        </View>

                    </Form>

                </LoginView>
            </PageLayout>
        );
    }
}
