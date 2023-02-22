import {Image, Text, View} from "@tarojs/components";
import Taro from '@tarojs/taro';
import React from "react";
import styles from './index.module.scss';
import {useSelector} from "react-redux";


export declare interface StatusbarProps {
  isFixed?: boolean;
  title?: string;
  titleCenter?: boolean;
  button?: React.ReactElement;
  hide?: boolean;
}

const StatusBar = (props: StatusbarProps): any => {
  const {
    isFixed = false,
    title = '',
    titleCenter = true,
    button = null,
    hide = false,
  } = props;
  const pages = Taro.getCurrentPages();
  const showHome = pages.length > 1;
  const systemInfo = useSelector(({context}) => context.systemInfo);

  const mainStyle: any = {width: '100%', zIndex: 99999};
  if (isFixed) {
    mainStyle.position = 'fixed';
    mainStyle.top = 0;
  }

  const navigatorBarStyle: any = {
    paddingTop: Taro.pxTransform(systemInfo.safeArea.top),
  };

  if (titleCenter) {
    navigatorBarStyle.textAlign = 'center';
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

  if (hide) {
    return <></>;
  }


  return (
    <View className={styles.status_bar} style={navigatorBarStyle}>
      {button !== null && button}
      {button === null && pages?.length > 1 &&
        <Image className={'margin-left-sm'} style={imageStyle} src="../../assets/images/backPageImg.png" onClick={goBack}/>}
      {showHome && <Text className="cuIcon-home" style={imageStyle} onClick={() => Taro.redirectTo({url: '/pages/index/index'})}/>}
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
