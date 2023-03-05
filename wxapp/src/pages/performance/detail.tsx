import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request from "../../lib/request";
import PageLoading from "../../components/pageloading";
import FallbackImage from "../../components/FallbackImage";
import utils from "../../lib/utils";
import {Text, View} from "@tarojs/components";
import moment from "moment";
import Clocker from "clocker-js/Clocker";
const numeral = require('numeral');

export default class Index extends Component<any, any> {
    state:any = {
        id: null,
        detail: null,
        status: 'notstart',
    }
    clocker: any;
    timer: any;

    onLoad(options) {
        this.setState({id: options.id});
        request.get('/paimai/performances/detail', {params: {id: options.id}}).then(res=>{
            let detail = res.data.result;
            const started = moment(detail.startTime).isBefore(moment());
            const ended = moment(detail.endTime).isBefore(moment());
            let status = 'notstart';
            if(ended) {
                status = 'ended';
            }
            else if(started) {
                status = 'started';
            }
            if(status == 'notstart') {
                this.clocker = new Clocker(new Date(detail.startTime));
            }
            else if(status == 'started'){
                this.clocker = new Clocker(new Date(detail.endTime));
            }
            this.clocker.countDown = true;
            this.setState({status: status, detail: detail});
            this.timer = setInterval(()=>{

            }, 1000);
        })
    }


    componentWillUnmount() {
        this.clocker?.close();
        clearInterval(this.timer);
    }


    render() {
        const {detail} = this.state;

        if(!detail) return <PageLoading />

        return (
            <PageLayout statusBarProps={{title: '专场详情'}}>
                <FallbackImage src={utils.resolveUrl(detail.preview)} className={'block w-full'} />
                <View className={'p-4 flex items-center'}>
                    {this.clocker?.isCounting && <View>
                        <Text className={'text-red-600 font-medium'}>{numeral(this.clocker.date).format('00')}</Text>天<Text
                        className={'text-red-600 font-medium'}>{numeral(this.clocker.hours).format('00')}</Text>小时<Text
                        className={'text-red-600 font-medium'}>{numeral(this.clocker.minutes).format('00')}</Text>分<Text
                        className={'text-red-600 font-medium'}>{numeral(this.clocker.seconds).format('00')}</Text>秒
                    </View>}
                </View>
            </PageLayout>
        );
    }
}
