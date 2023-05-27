import {View, Text} from "@tarojs/components";
import Taro from "@tarojs/taro";
import FallbackImage from "../../../FallbackImage";
import {FC} from "react";
import utils from "../../../../lib/utils";
import TimeCountDowner from "../../../TimeCountDowner";
import moment from "moment";


export interface LiveRoomItemViewProps extends Partial<any> {
    radius?: number;
    item: any;
}

const LiveRoomItemView: FC<LiveRoomItemViewProps> = (props) => {
    const {radius = 0, item} = props;
    const tags = item.tags?.split(',') || [];

    const openLiveRoom = (liveRoom:any) => {
        let nowTime = moment(new Date());
        let startTime = moment(liveRoom.startTime);
        let endTime = moment(liveRoom.endTime);
        if(startTime.isAfter(nowTime)) {
            //直播尚未开始
            return utils.showError('直播尚未开始');
        }
        else if(startTime.isBefore(nowTime) && endTime.isAfter(nowTime)) {
            //直播进行中
            Taro.navigateTo({url: '/live/pages/room?roomId=' + liveRoom.id}).then();
        }
        else if(endTime.isBefore(nowTime)) {
            //直播回放
            Taro.navigateTo({url: `/live/pages/history?id=${liveRoom.id}`}).then();
        }
    }

    return (
        <View className={'bg-white relative overflow-hidden'} style={{borderRadius: Taro.pxTransform(radius)}}>
            <View onClick={()=>openLiveRoom(item)}>
                <View className={'relative'} style={{width: '100%'}}>
                    <FallbackImage mode={'widthFix'} className={'block w-full'} src={utils.resolveUrl(item.preview)}/>
                    <View className={'flex justify-between items-center py-1 text-sm text-gray-200 absolute bottom-0 w-full bg-black bg-opacity-60 overflow-hidden'}>
                        <TimeCountDowner
                            notStartTip={<View className={'space-x-1'}><Text className={'bg-indigo-600 text-base p-2'}>预展中</Text><Text>距开始：</Text></View>}
                            startedTip={<View className={'space-x-1'}><Text className={'bg-red-600 text-base p-2'}>进行中</Text><Text>距结束：</Text></View>}
                            endTip={<View className={'space-x-1'}><Text className={'bg-gray-600 text-base p-2'}>已结束</Text></View>}
                            className={'flex items-center'} endTime={item.endTime} startTime={item.startTime}
                        />
                    </View>
                </View>
                <View className={'py-3 px-4 space-y-1'}>
                    <View className={'space-x-2 flex text-sm'}>
                        {tags.map(t => {
                            return <View className={'border rounded px-1 border-red-500 border-solid text-red-500'}>{t}</View>;
                        })}
                    </View>
                    <View className={'text-xl font-medium'}>{item.title}</View>
                    <View className={'text-gray-400'}>直播时间：{item.startTime} 开始</View>
                </View>

            </View>
        </View>
    );
}
export default LiveRoomItemView;
