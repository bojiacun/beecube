import {Image, Text, View} from "@tarojs/components";
import Taro, {useRouter} from '@tarojs/taro';
import {useEffect, useState} from "react";


export declare interface StatusbarProps {
    statusHeight: number,
    navBarHeight: number,
    isFixed: boolean,
    bgColor: string,
    color: string,
    title: string,
    fontWeight: string,
    titleCenter: boolean,
    fontSize: string,
    display: string,
    alignItems: string,
    button: any,
    hide: boolean,
    position: string,
}

const StatusBar = (props: StatusbarProps): any => {
    const {
        statusHeight,
        navBarHeight,
        isFixed,
        bgColor,
        title,
        display,
        fontSize,
        fontWeight,
        titleCenter,
        color,
        alignItems,
        button,
        hide,
        position
    } = props;
    const [pages, setPages] = useState<any[]>([]);
    const [showHome, setShowHome] = useState<boolean>(false);

    useEffect(()=>{
        let _pages = Taro.getCurrentPages();
        setPages(_pages);
    }, []);

    const mainStyle: any = {width: '100%', background: bgColor, color: color, position: position, top: 0, left: 0, right: 0, zIndex: 99999};
    if (isFixed) {
        mainStyle.position = 'fixed';
        mainStyle.top = 0;
        mainStyle.zIndex = 10;
    }

    const navigatorBarStyle: any = {
        height: navBarHeight + 'px',
        color: color,
        fontWeight: fontWeight,
        fontSize: fontSize,
        display: display,
        alignItems: alignItems,
        position: 'relative'
    };

    if (titleCenter) {
        navigatorBarStyle.justifyContent = 'center';
    }

    const imageStyle: any = {
        position: 'absolute',
        left: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        width: '50rpx',
        height: '50rpx',
        borderRadius: '100rpx',
        padding: '6rpx',
        background: 'rgba(255,255,255,0.6)',
        boxSizing: 'content-box'
    }

    const goBack = () => {
        Taro.navigateBack().then();
    }

    if(hide) {
        return <></>;
    }



    return (
        <View style={mainStyle}>
            <View style={{height: statusHeight + 'px'}}/>
            <View className={'padding-left-sm'} style={navigatorBarStyle}>
                {button !== null && button}
                {button === null && pages?.length > 1 && <Image className={'margin-left-sm'} style={imageStyle} src="../../assets/images/backPageImg.png" onClick={goBack} />}
                {showHome && <Text className="cuIcon-home" style={imageStyle} onClick={()=>Taro.switchTab({url: '/pages/index/index'})} />}
                <Text>{title}</Text>
            </View>
        </View>
    );
}


StatusBar.defaultProps = {
    isFixed: false,
    bgColor: 'white',
    color: '#333333',
    title: '',
    titleCenter: true,
    alignItems: 'center',
    display: 'flex',
    fontSize: '32rpx',
    fontWeight: 'bold',
    navBarHeight: 44,
    statusHeight: 22,
    button: null
}


export default StatusBar
