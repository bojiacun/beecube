import {View} from "@tarojs/components";
import {FC} from "react";
import Taro from "@tarojs/taro";


export interface LineTitleProps extends Partial<any> {
    height?: number;
    text?: string;
}

const LineTitle : FC<LineTitleProps> = (props) => {
    const {height = 30, text = '', ...rest} = props;

    return (
        <View className={'flex items-center w-full'} style={{height: Taro.pxTransform(height)}} {...rest}>
            <View className={'bg-gray-200 flex-1'} style={{height: 1}}></View>
            <View className={'px-4 text-gray-400'}>{text}</View>
            <View className={'bg-gray-200 flex-1'} style={{height: 1}}></View>
        </View>
    );
}

export default LineTitle;
