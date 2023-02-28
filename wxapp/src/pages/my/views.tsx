import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {View} from "@tarojs/components";


export default class Index extends Component<any, any> {
    render() {
        return (
            <PageLayout statusBarProps={{title: '我的足迹'}}>
                <View className={'grid grid-cols-2 gap-4 p-4'}>

                </View>
            </PageLayout>
        );
    }

}
