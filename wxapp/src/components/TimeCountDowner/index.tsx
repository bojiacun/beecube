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
    onStatusChanged?: (status: TimeCountDownerStatus) => {};
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
        notStartTip = '距开始:',
        endTip = '已结束',
        startedTip = '距结束:',
        mode = TimeCountDownerMode.TimeBase,
        started = false,
        ended = false,
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
            clocker.targetDate = endTime;
            onStatusChanged(TimeCountDownerStatus.STARTED);
            return startedTip;
        } else {
            clocker.targetDate = startTime;
            onStatusChanged(TimeCountDownerStatus.NOT_START);
            return notStartTip;
        }
    }, [started, ended]);
    useEffect(() => {
        let timer = setInterval(() => {
            setCounter(v => v + 1);
        }, 1000);
        return () => {
            clearInterval(timer);
        }
    }, []);

    if(ended) {
        return (
            <View {...rest}>{tip}</View>
        );
    }
    else if(started) {
        if(endTime != null) {
            return (
                <View {...rest}>
                    {tip}
                    {clocker.isCounting &&
                        <View>
                            <Text className={'text-red-600 font-medium'}>{numeral(clocker.date).format('00')}</Text>天<Text
                            className={'text-red-600 font-medium'}>{numeral(clocker.hours).format('00')}</Text>小时<Text
                            className={'text-red-600 font-medium'}>{numeral(clocker.minutes).format('00')}</Text>分<Text
                            className={'text-red-600 font-medium'}>{numeral(clocker.seconds).format('00')}</Text>秒
                        </View>
                    }
                </View>
            );
        }
        else {
            return (
                <View {...rest}>{tip}</View>
            );
        }
    }
    else {
        if(startTime != null) {
            return (
                <View {...rest}>
                    {tip}
                    {clocker.isCounting &&
                        <View>
                            <Text className={'text-red-600 font-medium'}>{numeral(clocker.date).format('00')}</Text>天<Text
                            className={'text-red-600 font-medium'}>{numeral(clocker.hours).format('00')}</Text>小时<Text
                            className={'text-red-600 font-medium'}>{numeral(clocker.minutes).format('00')}</Text>分<Text
                            className={'text-red-600 font-medium'}>{numeral(clocker.seconds).format('00')}</Text>秒
                        </View>
                    }
                </View>
            );
        }
        else {
            return (
                <View {...rest}>{tip}</View>
            );
        }
    }

}

export default TimeCountDowner
