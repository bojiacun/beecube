import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request from "../../lib/request";
import PageLoading from "../../components/pageloading";
import FallbackImage from "../../components/FallbackImage";
import utils from "../../lib/utils";
import {View} from "@tarojs/components";
import TimeCountDowner from "../../components/TimeCountDowner";

export default class Index extends Component<any, any> {
    state:any = {
        id: null,
        detail: null,
    }


    onLoad(options) {
        this.setState({id: options.id});
        request.get('/paimai/performances/detail', {params: {id: options.id}}).then(res=>{
            let detail = res.data.result;
            this.setState({detail: detail});
        })
    }


    componentWillUnmount() {

    }


    render() {
        const {detail} = this.state;

        if(!detail) return <PageLoading />

        return (
            <PageLayout statusBarProps={{title: '专场详情'}}>
                <FallbackImage src={utils.resolveUrl(detail.preview)} className={'block w-full'} />
                <View className={'p-4'}>
                    <TimeCountDowner endTime={new Date(detail.endTime)} startTime={new Date(detail.startTime)} />
                </View>
            </PageLayout>
        );
    }
}
