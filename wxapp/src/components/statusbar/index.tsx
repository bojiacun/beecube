import {Image, Text, View} from "@tarojs/components";
import Taro, {useDidShow} from '@tarojs/taro';
import React, {useState} from "react";
import styles from './index.module.scss';
import {useSelector} from "react-redux";
import classNames from "classnames";
import backImage from '../../assets/images/backPageImg.png';


export declare interface StatusbarProps {
    isFixed?: boolean;
    title?: string;
    titleCenter?: boolean;
    button?: React.ReactElement;
    hide?: boolean;
    style?: any;
    className?: string;
}

const StatusBar = (props: StatusbarProps): any => {
    const {
        title = '',
        titleCenter = true,
        button = null,
        hide = false,
        style = {fontSize: 18, fontWeight: 'bold'},
        className = 'bg-white',
    } = props;
    const [pages, setPages] = useState<any[]>(Taro.getCurrentPages());
    const systemInfo = useSelector(({context}) => context.systemInfo);

    useDidShow(() => {
        setPages(Taro.getCurrentPages());
    });


    const navigatorBarStyle: any = {
        paddingTop: Taro.pxTransform(systemInfo.safeArea.top),
    };

    if (titleCenter) {
        navigatorBarStyle.textAlign = 'center';
    }
    navigatorBarStyle.position = 'sticky';
    navigatorBarStyle.top = 0;
    navigatorBarStyle.width = '100%';
    navigatorBarStyle.zIndex = 9999;

    const goBack = () => {
        Taro.navigateBack().then();
    }

    if (hide) {
        return <></>;
    }

    return (
        <View className={classNames(styles.status_bar, className)} style={{...style, ...navigatorBarStyle}}>
            {button !== null && button}
            {button === null && pages?.length > 1 && <Image className={classNames('ml-1')} src={backImage} onClick={goBack}/>}
            {pages?.length == 1 && pages[0].route != 'pages/index/index'
                &&
                <View className={'absolute text-gray-400'} style={{left: 10}} onClick={() => Taro.reLaunch({url: '/pages/index/index'})}>
                    <Text className={'iconfont icon-shouye'} style={{fontSize: 24}}/>
                </View>}
            <Text>{title}</Text>
        </View>
    );
}


StatusBar.defaultProps = {
    isFixed: false,
    title: '',
    titleCenter: true,
    button: null
}


export default StatusBar
