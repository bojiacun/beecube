import {View} from "@tarojs/components";
import {FC} from "react";
import Taro from "@tarojs/taro";


export interface CopyrightProps extends Partial<any> {
    height?: number;
}

const Copyright: FC<CopyrightProps> = (props) => {
    const {height = 30, text = '蜜蜂魔方提供技术支持', ...rest} = props;

    return (
        <View className={'flex items-center text-sm mx-4 box-border mt-4'} style={{height: Taro.pxTransform(height)}} {...rest}>
            <View className={'bg-gray-200 flex-1'} style={{height: 1}}></View>
            <View className={'px-4 text-gray-300'}>{text}</View>
            <View className={'bg-gray-200 flex-1'} style={{height: 1}}></View>
        </View>
    );
}

export default Copyright;
