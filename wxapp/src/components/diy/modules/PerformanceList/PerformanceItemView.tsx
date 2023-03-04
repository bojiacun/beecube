import {Navigator, Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import FallbackImage from "../../../FallbackImage";
import {FC, useEffect, useMemo, useState} from "react";
import moment from "moment";
import Clocker from "clocker-js/Clocker";

const numeral = require('numeral');

export interface GoodsItemViewProps extends Partial<any> {
    radius?: number;
    item: any;
}

const PerformanceItemView: FC<GoodsItemViewProps> = (props) => {
    const {radius = 0, item} = props;
    //@ts-ignore
    const [counting, setCounting] = useState<number>(0);
    const started = moment(item.startTime).isBefore(moment());
    const ended = moment(item.endTime).isBefore(moment());

    const startText = useMemo(()=>{
        if(ended) return '已结束';
        if(started) return '距结束：';
        if(!started) return '距开始：';
        return '';
    }, [started, ended]);

    const clocker = useMemo(()=>{
        let _clocker = new Clocker(started ? new Date(item.endTime): new Date(item.startTime));
        _clocker.countDown = true;
        return _clocker;
    }, [started]);

    useEffect(()=>{
        let _timer = setInterval(()=>{
            if(clocker.isCounting) {

            }
            setCounting(v=>v+1);
        }, 1000);
        return ()=>{
            clearInterval(_timer);
        }
    }, []);


    return (
        <View className={'bg-white overflow-hidden'} style={{borderRadius: Taro.pxTransform(radius)}}>
            <Navigator url={'/pages/performance/detail?id=' + item.id}>
                <View className={'relative'} style={{width: '100%'}}>
                    <FallbackImage mode={'widthFix'} style={{borderRadius: Taro.pxTransform(radius)}}
                                   className={'block w-full'} src={item.preview}/>
                </View>
                <View className={'pt-2 px-4 text-xl font-bold'}>{item.title}</View>
                <View className={'flex justify-between pt-2 pb-4 px-4'}>
                    <View className={'flex text-left'}>
                        {startText}
                        {clocker?.isCounting && <View>
                            <Text className={'text-red-600 font-medium'}>{numeral(clocker.date).format('00')}</Text>天<Text
                            className={'text-red-600 font-medium'}>{numeral(clocker.hours).format('00')}</Text>小时<Text
                            className={'text-red-600 font-medium'}>{numeral(clocker.minutes).format('00')}</Text>分<Text
                            className={'text-red-600 font-medium'}>{numeral(clocker.seconds).format('00')}</Text>秒
                        </View>}
                    </View>
                    <View className={'text-right'}>出价{item.offerCount}次</View>
                </View>
            </Navigator>
        </View>
    );
}
export default PerformanceItemView;
