import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {Button, View} from "@tarojs/components";
import FallbackImage from "../../components/FallbackImage";
import {API_URL} from "../../lib/request";

export default class Index extends Component<any, any> {
    render() {
        return (
            <PageLayout statusBarProps={{title: '我的二维码'}}>
                <View className={'p-4 bg-white m-4 relative'}>
                    <FallbackImage src={API_URL+'/app/members/qrcode'} className={'w-full block'} mode={'widthFix'} />
                </View>
                <View className={'mt-4 text-center'}>
                    <Button className={'btn btn-danger'}>保存到相册</Button>
                </View>
            </PageLayout>
        );
    }
}
