import React from "react";
import {Image, View} from "@tarojs/components";
// @ts-ignore
import styles from './index.module.scss';
import loadingGif from '../../assets/images/loading.gif';


const PageLoading: React.FC<any> = (props:any): any => {
    return <View className={styles.pageLoading} {...props}><Image src={loadingGif} style={{width: 32, height: 32}} /></View>
}



export default PageLoading
