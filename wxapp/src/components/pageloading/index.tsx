import React from "react";
import {Image, View} from "@tarojs/components";
import PropTypes from 'prop-types';
// @ts-ignore
import styles from './index.module.scss';

export declare interface PageLoadingProps {
    loading: boolean
}

const PageLoading: React.FC<PageLoadingProps> = (props): any => {
    const {loading, children} = props;

    if (loading) {
        return <View className={styles.pageLoading}><Image src="../../assets/images/loading.gif" style={{width: 32, height: 32}} /></View>
    }
    return children;
}

PageLoading.propTypes = {
    loading: PropTypes.bool.isRequired
}



export default PageLoading
