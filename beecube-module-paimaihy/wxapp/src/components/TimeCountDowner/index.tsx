import {Text, View} from "@tarojs/components";

const numeral = require('numeral');
import Clocker from "clocker-js/Clocker";
import {FC, ReactElement, useEffect, useMemo, useState} from "react";
import moment from "moment";


export enum TimeCountDownerMode {
    Manual,
    TimeBase
}

export enum TimeCountDownerStatus {
    NOT_START,
    STARTED,
    ENDED
}

export interface TimeCountDownerProps extends Partial<any> {
    startTime?: Date;
    endTime?: Date;
    notStartTip?: ReactElement;
    startedTip?: ReactElement;
    endTip?: ReactElement;
    onStatusChanged?: (status: TimeCountDownerStatus) => void;
    mode?: TimeCountDownerMode;
    started?: boolean;
    ended?: boolean;
}

const TimeCountDowner: FC<TimeCountDownerProps> = (props) => {
    let {
        onStatusChanged = () => {
        },
        startTime = null,
        endTime = null,
        notStartTip = '距开始：',
        endTip = '已结束',
        startedTip = '距结束：',
        mode = TimeCountDownerMode.TimeBase,
        started = undefined,
        ended = undefined,
        ...rest
    } = props;
    //@ts-ignore
    const [counter, setCounter] = useState<number>(0);
    const nowDate = moment();
    const clocker = useMemo(() => new Clocker(), []);
    clocker.countDown = true;

    if (mode == TimeCountDownerMode.TimeBase) {
        if (startTime == null) {
            started = false;
        } else {
            started = moment(startTime).isBefore(nowDate);
        }
        if (endTime == null) {
            ended = false;
        } else {
            ended = moment(endTime).isBefore(nowDate);
        }
    }
    const tip = useMemo(() => {
        if (ended) {
            clocker.targetDate = nowDate;
            onStatusChanged(TimeCountDownerStatus.ENDED);
            return endTip;
        } else if (started) {
            clocker.targetDate = moment(endTime).toDate();
            onStatusChanged(TimeCountDownerStatus.STARTED);
            return startedTip;
        } else {
            clocker.targetDate = moment(startTime).toDate();
            onStatusChanged(TimeCountDownerStatus.NOT_START);
            return notStartTip;
        }
    }, [started, ended, startTime, endTime]);


    useEffect(() => {
        let timer = setInterval(() => {
            setCounter(v => v + 1);
        }, 1000);
        return () => {
            clearInterval(timer);
        }
    }, []);


    if (ended) {
        return (
            <View {...rest}>{tip}</View>
        );
    } else if (started) {
        if (endTime != null && clocker.isCounting) {
            return (
                <View {...rest}>
                    {tip}
                    <View className={'flex items-center'}>
                        <Text className={'text-red-600 font-medium'}>{numeral(clocker.date).format('00')}</Text>
                        <Text>天</Text>
                        <Text className={'text-red-600 font-medium'}>{numeral(clocker.hours).format('00')}</Text>
                        <Text>小时</Text>
                        <Text className={'text-red-600 font-medium'}>{numeral(clocker.minutes).format('00')}</Text>
                        <Text>分</Text>
                        <Text className={'text-red-600 font-medium'}>{numeral(clocker.seconds).format('00')}</Text>
                        <Text>秒</Text>
                    </View>
                </View>
            );
        } else {
            return (
                <View {...rest}>进行中</View>
            );
        }
    } else {
        if (startTime != null && clocker.isCounting) {
            return (
                <View {...rest}>
                    {tip}
                    <View className={'flex items-center'}>
                        <Text className={'text-red-600 font-medium'}>{numeral(clocker.date).format('00')}</Text>
                        <Text>天</Text>
                        <Text className={'text-red-600 font-medium'}>{numeral(clocker.hours).format('00')}</Text>
                        <Text>小时</Text>
                        <Text className={'text-red-600 font-medium'}>{numeral(clocker.minutes).format('00')}</Text>
                        <Text>分</Text>
                        <Text className={'text-red-600 font-medium'}>{numeral(clocker.seconds).format('00')}</Text>
                        <Text>秒</Text>
                    </View>
                </View>
            );
        } else {
            return (
                <View {...rest}>进行中</View>
            );
        }
    }

}

export default TimeCountDowner
