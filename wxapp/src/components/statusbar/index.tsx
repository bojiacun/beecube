import {Image, Text, View} from "@tarojs/components";
import Taro, {useDidShow} from '@tarojs/taro';
import React, {useState} from "react";
import styles from './index.module.scss';
import {useSelector} from "react-redux";
import classNames from "classnames";
import backImage from '../../assets/images/backPageImg.png';
import utils from "../../lib/utils";


export declare interface StatusbarProps {
    isFixed?: boolean;
    title?: string;
    titleCenter?: boolean;
    button?: React.ReactElement;
    hide?: boolean;
    style?: any;
    className?: string;
    logo?: string;
}

const StatusBar = (props: StatusbarProps): any => {
    const {
        title = '',
        titleCenter = true,
        button = null,
        hide = false,
        style = {fontSize: 18, fontWeight: 'bold'},
        className = 'bg-white',
        logo = undefined,
    } = props;
    const [pages, setPages] = useState<any[]>(Taro.getCurrentPages());
    const systemInfo = useSelector(({context}) => context.systemInfo);

    useDidShow(() => {
        setPages(Taro.getCurrentPages());
    });


    // 获取距上
    const barTop = systemInfo.statusBarHeight;
    const menuButtonInfo = Taro.getMenuButtonBoundingClientRect();
    // 获取导航栏高度
    const barHeight = menuButtonInfo.height + (menuButtonInfo.top - barTop) * 2

    const navigatorBarStyle: any = {};

    if (titleCenter) {
        navigatorBarStyle.textAlign = 'center';
    }
    navigatorBarStyle.position = 'sticky';
    navigatorBarStyle.top = 0;
    navigatorBarStyle.width = '100%';
    navigatorBarStyle.zIndex = 9999;
    navigatorBarStyle.height = barHeight + barTop;

    const goBack = () => {
        Taro.navigateBack().then();
    }

    if (hide) {
        return <></>;
    }

    return (
        <View className={classNames(styles.status_bar, className)} style={{...style, ...navigatorBarStyle}}>
            {barTop > 0 && <View style={{height: barTop, width: '100%'}}></View>}
            <View className={'flex items-center justify-center'} style={{height: barHeight}}>
                {button !== null && button}
                {button === null && pages?.length > 1 && <Image className={classNames('ml-1', styles.backbtn)} src={backImage} onClick={goBack}/>}
                {pages?.length == 1 && pages[0].route != 'pages/index/index'
                    &&
                    <View className={'absolute text-gray-400'} style={{left: 10}} onClick={() => Taro.reLaunch({url: '/pages/index/index'})}>
                        <Text className={'iconfont icon-shouye'} style={{fontSize: 24}}/>
                    </View>}
                {!logo && <Text>{title}</Text>}
                {logo && <Image src={utils.resolveUrl(logo)} style={{height: '90%'}} mode={'heightFix'} className={'inline-block box-border'}/>}
            </View>
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
