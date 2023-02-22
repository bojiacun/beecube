import React from "react";
import {Image, View} from "@tarojs/components";
// @ts-ignore
import styles from './index.module.scss';


const PageLoading: React.FC = (): any => {
    return <View className={styles.pageLoading}><Image src="../../assets/images/loading.gif" style={{width: 32, height: 32}} /></View>
}



export default PageLoading
