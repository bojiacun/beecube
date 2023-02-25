import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import Taro from "@tarojs/taro";


export default class Index extends Component<any, any> {
    state = {
        sdkVersion: '',
    }
    componentWillMount() {
        this.setState({sdkVersion: Taro.getAppBaseInfo().SDKVersion});
    }

    render() {
        return (
            <PageLayout statusBarProps={{title: '完善您的信息'}}>

            </PageLayout>
        );
    }
}
