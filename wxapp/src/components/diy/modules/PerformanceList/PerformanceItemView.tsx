import {Navigator, Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import FallbackImage from "../../../FallbackImage";
import {FC, useState} from "react";
const numeral = require('numeral');

export interface GoodsItemViewProps extends Partial<any> {
    radius?: number;
    item: any;
}

const PerformanceItemView:FC<GoodsItemViewProps> = (props) => {
    const {radius = 0, item} = props;
    const [clocker, setClocker] = useState<any>();



    return (
        <View className={'bg-white overflow-hidden'} style={{borderRadius: Taro.pxTransform(radius)}}>
            <Navigator url={'/pages/performances/detail?id='+item.id}>
                <View className={'relative'} style={{width: '100%', paddingTop: '100%'}}>
                    <FallbackImage mode={'aspectFill'} style={{borderRadius: Taro.pxTransform(radius)}} className={'absolute z-0 inset-0 block w-full h-full'} src={item.preview}/>
                </View>
                <View className={'px-2 mt-2 text-lg font-bold'}>{item.title}</View>
                <View className={'px-2 mb-2 text-sm'}>
                    <View>距结束: <Text className={'text-red-600'}>{numeral(clocker.date).format('00')}</Text>天<Text
                        className={'text-red-600'}>{numeral(clocker.hours).format('00')}</Text>小时<Text
                        className={'text-red-600'}>{numeral(clocker.minutes).format('00')}</Text>分<Text
                        className={'text-red-600'}>{numeral(clocker.seconds).format('00')}</Text>秒</View>
                    <View>出价{item.offerCount}次</View>
                </View>
            </Navigator>
        </View>
    );
}
export default PerformanceItemView;
