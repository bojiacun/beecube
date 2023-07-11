import {Component} from "react";
import Taro from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import {Image, Text, View} from "@tarojs/components";
import {Button} from '@taroify/core';
import FallbackImage from "../../components/FallbackImage";
import request, {API_URL, APP_ID} from "../../lib/request";
import utils from "../../lib/utils";
import {connect} from "react-redux";
// @ts-ignore
@connect((state: any) => (
    {
        systemInfo: state.context.systemInfo,
        settings: state.context.settings,
        context: state.context
    }
))
export default class Index extends Component<any, any> {
    state: any = {
        qrcode: null
    }

    constructor(props) {
        super(props);
        this.handleSaveToPhotoAlbum = this.handleSaveToPhotoAlbum.bind(this);
    }

    handleSaveToPhotoAlbum() {
        const token = Taro.getStorageSync("TOKEN");
        Taro.downloadFile({
            url: API_URL + '/app/api/members/qrcode',
            header: {'X-Access-Token': token, 'Authorization': token, 'X-App-Id': APP_ID},
        }).then(res => {
            Taro.saveImageToPhotosAlbum({filePath: res.tempFilePath}).then(() => {
                utils.showSuccess(false, '保存成功');
            });
        })
    }

    componentDidMount() {
        request.get('/app/api/members/qrcode', {responseType: 'arraybuffer'}).then((res: any) => {
            let data = Taro.arrayBufferToBase64(res.data);
            this.setState({qrcode: data});
        });
    }

    render() {
        const {systemInfo, settings, context} = this.props;
        const {userInfo} = context;
        const barTop = systemInfo.statusBarHeight;
        const menuButtonInfo = Taro.getMenuButtonBoundingClientRect();
        // 获取导航栏高度
        const barHeight = menuButtonInfo.height + (menuButtonInfo.top - barTop) * 2;
        return (
            <PageLayout showStatusBar={false} style={{background: 'linear-gradient(to bottom, #df9578, #d23329)', paddingBottom: 0}}>
                <View className={'flex items-center justify-center text-lg relative text-white'} style={{height: barHeight, marginTop: barTop}}>
                    文化推荐官邀请码
                    <Text className={'fa fa-chevron-left absolute left-5'} onClick={() => utils.navigateBack()}/>
                </View>

                <View className={'text-white text-center text-xl m-4'}>邀请好友注册{settings.wxAppName}小程序</View>
                <View className={'bg-white m-4 relative rounded-xl z-0'}>
                    <View className={'p-4'}>
                        <View className={'font-bold text-3xl mb-4'}>Hi,我是{userInfo?.nickname || userInfo?.realname}</View>
                        <View className={'text-lg mb-4'}>{settings.shareQrcodeTitle || '我发现了一个非常值得信赖的拍卖品平台，特邀请您注册，一起发现东方美器'}</View>
                        <View className={'px-6'}>
                            {this.state.qrcode && <FallbackImage src={'data:image/png;base64,' + this.state.qrcode} className={'w-full block'} mode={'widthFix'}/>}
                        </View>
                        <View className={'text-lg mb-4 text-center mt-4'}>{'长按识别二维码'}</View>
                    </View>
                    <View className={'flex items-center justify-center mt-4 p-4 bg-gray-200 h-40'}>
                    </View>
                </View>
                <View className={'w-full text-center overflow-hidden relative'} style={{height: 300, marginTop: -130}}>
                    <Image src={'https://image.winkt.cn/images/sharebg.png'} className={'absolute block w-full h-full left-0 bottom-0 z-1'} mode={'widthFix'} />
                    <Button className={'z-20 mt-8'} formType={'button'} shape={'round'} style={{backgroundColor: 'black', color: 'white'}} onClick={this.handleSaveToPhotoAlbum}>保存到手机相册</Button>
                </View>
            </PageLayout>
        );
    }
}
