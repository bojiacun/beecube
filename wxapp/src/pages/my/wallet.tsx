import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {View} from "@tarojs/components";


export default class Index extends Component<any, any> {
    render() {
        return (
            <PageLayout statusBarProps={{title: '我的余额'}}>
                <View className={'p-4'}>

                </View>
            </PageLayout>
        );
    }
}
