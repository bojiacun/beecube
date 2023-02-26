import {Component} from "react";
import PageLayout from "../../../layouts/PageLayout";
import LoginView from "../../../components/login";
import {Button, Form, Input, View} from "@tarojs/components";
import {connect} from "react-redux";
import {saveUserInfo} from "./services";
import {setUserInfo} from "../../../store/actions";
import utils from "../../../lib/utils";

// @ts-ignore
@connect((state: any) => (
    {
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
        saving: false
    }

    constructor(props: any) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleSubmit(e) {
        this.setState({saving: true});
        const {userInfo} = this.props.context;
        userInfo.email = e.detail.value.email;
        saveUserInfo(userInfo).then(res => {
            this.props.updateUserInfo(res.data.result);
            this.setState({saving: false});
            utils.showSuccess(true);
        })
    }

    render() {
        return (
            <PageLayout statusBarProps={{title: '修改邮箱'}}>
                <LoginView>
                    <Form onSubmit={this.handleSubmit}>
                        <View className={'bg-white divide-y divide-gray-100 text-gray-600 mt-4'}>
                            <View className={'p-4'}>
                                <View className={'flex items-center space-x-2'}>
                                    <Input name={'email'} className={'block w-full'} placeholder={'修改邮箱'}/>
                                </View>
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
