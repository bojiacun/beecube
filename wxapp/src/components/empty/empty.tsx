import React from "react";
import {Image, View} from "@tarojs/components";


export declare interface EmptyProps {
    title?: string|React.ReactNode,
    height?: string
}

const Empty: React.FC<EmptyProps> = (props) => {
    const {title, height} = props;

    return (
        <View className="flex flex-direction align-center justify-center text-gray" style={{height: height}}>
            <Image src='../../assets/images/empty.png' mode='widthFix' className="margin-bottom-sm" style={{width: '300rpx'}} />
            <View>{title}</View>
        </View>
    );
}

Empty.defaultProps = {
    title: '暂无内容',
    height: 'calc(100vh - 260rpx)',
}




export default Empty
