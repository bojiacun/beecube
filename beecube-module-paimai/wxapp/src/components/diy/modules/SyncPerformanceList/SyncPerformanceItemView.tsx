import {Navigator, Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import FallbackImage from "../../../FallbackImage";
import {FC} from "react";
import utils from "../../../../lib/utils";
import TimeCountDowner, {TimeCountDownerMode} from "../../../TimeCountDowner";


export interface PerformanceItemViewProps extends Partial<any> {
    radius?: number;
    item: any;
}

const SyncPerformanceItemView: FC<PerformanceItemViewProps> = (props) => {
    const {radius = 0, item} = props;
    const tags = item.tags?.split(',') || [];

    return (
        <View className={'bg-white relative overflow-hidden'} style={{borderRadius: Taro.pxTransform(radius)}}>
            <Navigator url={'/pages/performance/detail2?id=' + item.id}>
                <View className={'relative'} style={{width: '100%'}}>
                    <FallbackImage mode={'widthFix'} className={'block w-full'} src={utils.resolveUrl(item.preview)}/>
                    {item.state == 0 && item.startTime != null &&
                        <View
                            className={'flex items-center text-sm space-x-2 text-gray-200 absolute bottom-0 w-full bg-black bg-opacity-60 overflow-hidden'}>
                            <Text className={'bg-indigo-600 text-base py-1 px-2'}>预展中</Text>
                            <TimeCountDowner
                                mode={TimeCountDownerMode.Manual}
                                started={item.state == 1}
                                ended={item.state == 2}
                                className={'flex items-center'}
                                startTime={item.startTime}
                            />
                        </View>
                    }
                    {item.state == 1 &&
                        <View className={'flex items-center text-sm space-x-2 text-gray-200 absolute bottom-0 w-full bg-black bg-opacity-60 overflow-hidden'}>
                            <Text className={'bg-red-600 text-base py-1 px-2'}>进行中</Text>
                        </View>
                    }
                    {item.state == 2 &&
                        <View
                            className={'flex items-center text-sm space-x-2 text-gray-200 absolute bottom-0 w-full bg-black bg-opacity-60 overflow-hidden'}>
                            <Text className={'bg-gray-600 text-base py-1 px-2'}>已结束于</Text>
                            <View>{item.endTime}</View>
                        </View>
                    }
                </View>
                <View className={'py-3 px-4 space-y-1'}>
                    <View className={'space-x-2 flex text-sm'}>
                        {tags.map(t => {
                            return <View className={'border rounded px-1 border-red-500 border-solid text-red-500'}>{t}</View>;
                        })}
                    </View>
                    <View className={'text-xl font-medium'}>{item.title}</View>
                    <View className={'text-gray-400'}>拍卖时间：{item.startTime} 开始</View>
                </View>

            </Navigator>
        </View>
    );
}
export default SyncPerformanceItemView;
