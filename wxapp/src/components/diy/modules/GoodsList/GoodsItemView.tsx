import {Navigator, Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import FallbackImage from "../../../FallbackImage";
import {FC} from "react";
const numeral = require('numeral');

export interface GoodsItemViewProps extends Partial<any> {
    radius?: number;
    item: any;
}

const GoodsItemView:FC<GoodsItemViewProps> = (props) => {
    const {radius = 0, item} = props;
    return (
        <View className={'bg-white overflow-hidden'} style={{borderRadius: Taro.pxTransform(radius)}}>
            <Navigator url={'/pages/goods/detail?id='+item.id}>
                <View className={'relative'} style={{width: '100%', paddingTop: '100%'}}>
                    <FallbackImage mode={'aspectFill'} style={{borderRadius: Taro.pxTransform(radius)}} className={'absolute z-0 inset-0 block w-full h-full'} src={item.images.split(',')[0]}/>
                </View>
                <View className={'px-2 mt-2'}>{item.title}</View>
                <View className={'px-2 mb-2 text-sm'}>
                    起拍价 <Text className={'text-red-500'}>RMB</Text> <Text className={'text-red-500 text-lg'}>{numeral(item.startPrice).format('0,0.00')}</Text>
                </View>
            </Navigator>
        </View>
    );
}
export default GoodsItemView;
