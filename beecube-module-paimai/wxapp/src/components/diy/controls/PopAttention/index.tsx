import {View, Image} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {useEffect, useState} from "react";
import utils from '../../../../lib/utils';


/**
 * 弹窗关注公众号
 * @param props
 * @constructor
 */
const PopAttention = (props: any) => {
    const { data, basic, style, ...rest } = props;
    const [hide, setHide] = useState<any>();

    useEffect(()=>{
        //拿到本次要显示的广告图
        let hide = Taro.getStorageSync("CLOSED_ATTENTION");
        setHide(hide);

    },[basic]);
    const handleSaveToPhotoAlbum = () => {
        Taro.downloadFile({
            url: basic.image
        }).then(res=>{
            Taro.saveImageToPhotosAlbum({filePath: res.tempFilePath}).then(()=>{
                utils.showSuccess(false,'保存成功');
                closeAdv();
            });
        })
    }
    const closeAdv = () => {
        Taro.setStorageSync('CLOSED_ATTENTION', 1);
    }
    if(hide) {
        return <></>
    }

    return (
        <View {...rest}  style={{width: '100vw',zIndex: 99999, height: '100vh', top: 0, left: 0, position: 'fixed', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: `rgba(0,0,0,${style.opacity})`}}>
            <View style={{width: '70%', position: 'relative', opacity: 1}}>
                <Image mode={'widthFix'} src={utils.resolveUrl(basic.image)} style={{width: '100%', display: 'block'}} />
                <View className={'flex items-center justify-content'}>
                    <View className={'flex-1 text-gray-600'} onClick={closeAdv}>我知道了</View>
                    <View className={'flex-1 text-red-600'} onClick={handleSaveToPhotoAlbum}>下载二维码</View>
                </View>
            </View>
        </View>
    );
};

export default PopAttention;
