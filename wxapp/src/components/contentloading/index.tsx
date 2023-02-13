import React from "react";
import {Image, View} from "@tarojs/components";


export declare interface ContentLoadingProps {
    height?: string
}

const ContentLoading: React.FC<ContentLoadingProps> = (props) => {
    const {height} = props;

    return <View style={{height}} className="flex align-center justify-center"><Image src="../../assets/images/loading.gif" style={{width: 32, height: 32}} /></View>
}

ContentLoading.defaultProps = {
    height: 'calc(100vh - 128rpx)'
}

export default ContentLoading;
