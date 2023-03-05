import {Text, View} from "@tarojs/components";
const numeral = require('numeral');
import Clocker from "clocker-js/Clocker";
import {FC, ReactElement, useEffect, useMemo, useState} from "react";
import moment from "moment";

export interface TimeCountDownerProps extends Partial<any> {
    startTime?: Date;
    endTime: Date;
    notStartTip?: ReactElement;
    startedTip?: ReactElement;
    endTip?: ReactElement;
}

const TimeCountDowner : FC<TimeCountDownerProps> = (props) => {
    const {startTime = null, endTime, notStartTip = '距开始', endTip='已结束', startedTip = '距结束', ...rest} = props;
    //@ts-ignore
    const [counter, setCounter] = useState<number>(0);
    const nowDate = moment();
    let started = false;
    let ended = false;
    if(startTime == null) {
        started = true;
    }
    else {
        started = moment(startTime).isAfter(nowDate);
    }
    ended = moment(endTime).isBefore(nowDate);
    const tip = useMemo(()=>{
        if(ended) {
            return endTip;
        }
        else if(started) {
            return startedTip;
        }
        else {
            return notStartTip;
        }
    }, [started, ended]);

    const clocker = useMemo(()=>{
        let _clocker;
        if(!started && startTime != null) {
            _clocker = new Clocker(startTime);
        }
        else {
            _clocker = new Clocker(endTime);
        }
        _clocker.countDown = true;
        return _clocker;
    }, [started, ended]);

    useEffect(()=>{
        let timer = setInterval(()=>{
            setCounter(v=>v+1);
        }, 1000);
        return () => {
            clocker?.close();
            clearInterval(timer);
        }
    }, [])

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

export default TimeCountDowner
