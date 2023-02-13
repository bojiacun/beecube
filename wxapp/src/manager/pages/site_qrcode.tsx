import PageLayout from "../../layouts/PageLayout";
import {Image, View} from "@tarojs/components";
import request, {API_RECYCLERS_QRCODE, SERVICE_WINKT_RECYCLER_HEADER} from "../../utils/request";
import Taro, {useReady} from "@tarojs/taro";
import {useState} from "react";

const SiteQrcode = () => {
    const [qrcode, setQrcode] = useState<string>();

    useReady(()=>{
        request.post(API_RECYCLERS_QRCODE, SERVICE_WINKT_RECYCLER_HEADER, null, true, 'arraybuffer').then(res => {
            setQrcode(Taro.arrayBufferToBase64(res.data));
        });
    })

    return (
        <PageLayout statusBarProps={{title: '服务商二维码'}} showTabBar={false}>
            <View className="flex flex-direction padding">
                <View style={{width: '100%'}}>
                    {qrcode && <Image src={'data:image/png;base64,'+qrcode} mode="widthFix" style={{width: '100%'}} />}
                </View>
                <View className="margin-top text-center">打开小程序=》我的=》扫码服务商=》绑定服务商</View>
            </View>
        </PageLayout>
    );
}

export default SiteQrcode;
