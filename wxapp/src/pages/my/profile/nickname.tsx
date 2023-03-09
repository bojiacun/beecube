import {Component} from "react";
import PageLayout from "../../../layouts/PageLayout";
import {Button, Form, Input, View} from "@tarojs/components";
import {connect} from "react-redux";
import {setUserInfo} from "../../../store/actions";
import Taro from "@tarojs/taro";

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
        userInfo.nickname = e.detail.value.nickname;
        this.props.updateUserInfo(userInfo);
        Taro.navigateBack().then();
    }

    render() {
        return (
            <PageLayout statusBarProps={{title: '修改昵称'}}>
                <Form onSubmit={this.handleSubmit}>
                    <View className={'bg-white divide-y divide-gray-100 text-gray-600 mt-4'}>
                        <View className={'p-4'}>
                            <View className={'flex items-center space-x-2'}>
                                <Input name={'nickname'} className={'block w-full'} placeholder={'修改昵称'}/>
                            </View>
                        </View>
                    </View>

                    <View className={'container mx-auto mt-4 text-center'}>
                        <Button className={'btn btn-primary w-56'} formType={'submit'} disabled={this.state.saving}>确定</Button>
                    </View>
                </Form>
            </PageLayout>
        );
    }
}
