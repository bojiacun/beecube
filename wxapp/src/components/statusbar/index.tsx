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
}

const StatusBar = (props: StatusbarProps): any => {
  const {
    isFixed = false,
    title = '',
    titleCenter = true,
    button = null,
    hide = false,
  } = props;
  const [pages, setPages] = useState<any[]>(Taro.getCurrentPages());
  const systemInfo = useSelector(({context}) => context.systemInfo);
  const mainStyle: any = {width: '100%', zIndex: 99999};

  useDidShow(()=>{
      setPages(Taro.getCurrentPages());
  });

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

  const goBack = () => {
    Taro.navigateBack().then();
  }

  if (hide) {
    return <></>;
  }


  return (
    <View className={classNames(styles.status_bar, 'bg-white')} style={navigatorBarStyle}>
      {button !== null && button}
      {button === null && pages?.length > 1 &&
        <Image className={classNames('ml-1')} src={backImage} onClick={goBack}/>}
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
