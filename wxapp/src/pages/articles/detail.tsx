import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import PageLoading from "../../components/pageloading";
import request from "../../lib/request";
import {RichText, View} from "@tarojs/components";
import utils from "../../lib/utils";


export default class Index extends Component<any, any> {
    state: any = {
        id: null,
        detail: null,
    }

    onLoad(options) {
        request.get('/paimai/api/articles/queryById', {params: {id: options.id}}).then(res=>{
            this.setState({id: options.id, detail: res.data.result});
        });
    }


    componentDidMount() {
    }


    render() {
        const {detail} = this.state;
        if(detail == null) return <PageLoading />;

        return (
            <PageLayout containerClassName={'p-4'} statusBarProps={{title: detail.title}} style={{backgroundColor: 'white'}}>
                <View className={'text-xl font-bold'}>
                    {detail.title}
                </View>
                <View className={'text-gray-400 mt-2'}>{detail.createTime}</View>
                <View className={'mt-4'}>
                    <RichText nodes={utils.resolveHtmlImageWidth(detail.content)} space={'nbsp'}/>
                </View>
            </PageLayout>
        );
    }
}
