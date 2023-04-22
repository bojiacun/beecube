import {Component} from "react";
import Taro from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import {Button, View} from "@tarojs/components";
import FallbackImage from "../../components/FallbackImage";
import request, {API_URL, APP_ID} from "../../lib/request";
import utils from "../../lib/utils";

export default class Index extends Component<any, any> {
    state:any = {
        qrcode: null
    }

    constructor(props) {
        super(props);
        this.handleSaveToPhotoAlbum = this.handleSaveToPhotoAlbum.bind(this);
    }


    handleSaveToPhotoAlbum() {
        const token = Taro.getStorageSync("TOKEN");
        Taro.downloadFile({
            url: API_URL+'/app/api/members/qrcode',
            header: {'X-Access-Token': token, 'Authorization': token, 'X-App-Id': APP_ID},
        }).then(res=>{
            Taro.saveImageToPhotosAlbum({filePath: res.tempFilePath}).then(()=>{
                utils.showSuccess(false,'保存成功');
            });
        })
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
                    <Button className={'btn btn-danger'} onClick={this.handleSaveToPhotoAlbum}>保存到相册</Button>
                </View>
            </PageLayout>
        );
    }
}
