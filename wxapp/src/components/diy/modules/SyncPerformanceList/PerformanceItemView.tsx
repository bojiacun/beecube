import {Navigator, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import FallbackImage from "../../../FallbackImage";
import {FC} from "react";
import utils from "../../../../lib/utils";
import TimeCountDowner from "../../../TimeCountDowner";


export interface PerformanceItemViewProps extends Partial<any> {
    radius?: number;
    item: any;
}

const PerformanceItemView: FC<PerformanceItemViewProps> = (props) => {
    const {radius = 0, item} = props;

    return (
        <View className={'bg-white overflow-hidden'} style={{borderRadius: Taro.pxTransform(radius)}}>
            <Navigator url={'/pages/performance/detail?id=' + item.id}>
                <View className={'relative'} style={{width: '100%'}}>
                    <FallbackImage mode={'widthFix'} style={{borderRadius: Taro.pxTransform(radius)}}
                                   className={'block w-full'} src={utils.resolveUrl(item.preview)}/>
                </View>
                <View className={'pt-2 px-4 text-xl font-bold'}>{item.title}</View>
                <View className={'flex justify-between pt-2 pb-4 px-4'}>
                    <TimeCountDowner className={'flex text-left'} endTime={new Date(item.endTime)} startTime={new Date(item.startTime)} />
                    <View className={'text-right'}>出价{item.offerCount}次</View>
                </View>
            </Navigator>
        </View>
    );
}
export default PerformanceItemView;
