import {Navigator, View, Text} from "@tarojs/components";
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
        <View className={'bg-white relative overflow-hidden'} style={{borderRadius: Taro.pxTransform(radius)}}>
            <Navigator url={'/pages/performance/detail?id=' + item.id}>
                <View className={'relative'} style={{width: '100%'}}>
                    <FallbackImage mode={'widthFix'} className={'block w-full'} src={utils.resolveUrl(item.preview)}/>
                    <View className={'flex justify-between items-center py-1 text-sm text-gray-200 absolute bottom-0 w-full bg-black bg-opacity-60 overflow-hidden'}>
                        <TimeCountDowner
                            notStartTip={<View className={'space-x-1'}><Text className={'bg-indigo-600 text-base p-2'}>预展中</Text><Text>距开始：</Text></View>}
                            startedTip={<View className={'space-x-1'}><Text className={'bg-red-600 text-base p-2'}>进行中</Text><Text>距结束：</Text></View>}
                            endTip={<View className={'space-x-1'}><Text className={'bg-gray-600 text-base p-2'}>已结束</Text></View>}
                            className={'flex items-center'} endTime={new Date(item.endTime)} startTime={new Date(item.startTime)}
                        />
                    </View>
                </View>
                <View className={'py-3 px-4 space-y-1'}>
                    <View className={'space-x-2 flex text-sm'}>
                        <View className={'border rounded px-1 border-red-500 border-solid text-red-500'}>公益拍</View>
                        <View className={'border rounded px-1 border-red-500 border-solid text-red-500'}>保证金1:5</View>
                    </View>
                    <View className={'text-xl font-medium'}>{item.title}</View>
                    <View className={'text-gray-400'}>拍卖时间：{item.startTime} 开始</View>
                </View>

            </Navigator>
        </View>
    );
}
export default PerformanceItemView;
