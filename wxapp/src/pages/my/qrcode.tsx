import {Component} from "react";
import Taro from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import {Button, View} from "@tarojs/components";
import FallbackImage from "../../components/FallbackImage";
import request from "../../lib/request";

export default class Index extends Component<any, any> {
    state:any = {
        qrcode: null
    }


    componentDidMount() {
        request.get('/app/api/members/qrcode', {responseType: 'arraybuffer'}).then((res:any)=>{
            let data = Taro.arrayBufferToBase64(res.data);
            this.setState({qrcode: data});
        });
    }

    render() {
        return (
            <PageLayout statusBarProps={{title: '我的二维码'}}>
                <View className={'p-4 bg-white m-4 relative'}>
                    {this.state.qrcode && <FallbackImage src={'data:image/png;base64,'+this.state.qrcode} className={'w-full block'} mode={'widthFix'} />}
                </View>
                <View className={'mt-4 text-center'}>
                    <Button className={'btn btn-danger'}>保存到相册</Button>
                </View>
            </PageLayout>
        );
    }
}
