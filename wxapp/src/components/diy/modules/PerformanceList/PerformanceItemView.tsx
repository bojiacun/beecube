import {Navigator, Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import FallbackImage from "../../../FallbackImage";
import {FC, useEffect, useState} from "react";
import moment from "moment";
import Clocker from "clocker-js/Clocker";

const numeral = require('numeral');

export interface GoodsItemViewProps extends Partial<any> {
    radius?: number;
    item: any;
}

const PerformanceItemView: FC<GoodsItemViewProps> = (props) => {
    const {radius = 0, item} = props;
    const [clocker, setClocker] = useState<any>();
    const [startText, setStartText] = useState<string>('');
    const started = moment(item.startTime).isBefore(moment());
    useEffect(() => {
        let _clocker;
        if (!started) {
            _clocker = new Clocker(new Date(item.startTime));
            _clocker.countDown = true;
            setClocker(_clocker);
            if (_clocker.isCounting) {
                setStartText('距开始：');
            } else {
                setStartText('距结束：');
            }
        } else {
            _clocker = new Clocker(new Date(item.endTime));
            _clocker.countDown = true;
            setClocker(_clocker);
            if (_clocker.isCounting) {
                setStartText('距结束：');
            } else {
                setStartText('已结束');
            }
        }
    }, []);


    return (
        <View className={'bg-white overflow-hidden'} style={{borderRadius: Taro.pxTransform(radius)}}>
            <Navigator url={'/pages/performances/detail?id=' + item.id}>
                <View className={'relative'} style={{width: '100%'}}>
                    <FallbackImage mode={'widthFix'} style={{borderRadius: Taro.pxTransform(radius)}}
                                   className={'block w-full'} src={item.preview}/>
                </View>
                <View className={'pt-2 px-4 text-xl font-bold'}>{item.title}</View>
                <View className={'flex justify-between pt-2 pb-4 px-4'}>
                    <View className={'text-left'}>
                        {startText}
                        {clocker?.isCounting && <View>
                            <Text className={'text-red-600'}>{numeral(clocker.date).format('00')}</Text>天<Text
                            className={'text-red-600'}>{numeral(clocker.hours).format('00')}</Text>小时<Text
                            className={'text-red-600'}>{numeral(clocker.minutes).format('00')}</Text>分<Text
                            className={'text-red-600'}>{numeral(clocker.seconds).format('00')}</Text>秒
                        </View>}
                    </View>
                    <View className={'text-right'}>出价{item.offerCount}次</View>
                </View>
            </Navigator>
        </View>
    );
}
export default PerformanceItemView;
