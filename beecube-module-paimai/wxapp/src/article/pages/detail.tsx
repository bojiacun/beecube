import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import PageLoading from "../../components/pageloading";
import request from "../../lib/request";
import {RichText, View} from "@tarojs/components";
import utils from "../../lib/utils";
import {connect} from "react-redux";


const TITLES = {
    '1': '大家之谈',
    '2': '公开课',
    '3': '服务指南',
    '4': '帮助中心',
}

// @ts-ignore
@connect((state: any) => (
    {
        systemInfo: state.context.systemInfo,
        settings: state.context.settings,
        context: state.context
    }
))
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

    onShareTimeline() {
        let mid = this.props.context?.userInfo?.id || '';
        return {
            title: this.state.detail?.title,
            query: {mid: mid},
        }
    }

    onShareAppMessage() {
        let mid = this.props.context?.userInfo?.id || '';
        return {
            title: this.state.detail?.title,
            path: '/article/pages/detail?id=' + this.state.id +'&mid='+mid
        }
    }


    componentDidMount() {
    }


    render() {
        const {detail} = this.state;
        if(detail == null) return <PageLoading />;

        return (
            <PageLayout containerClassName={'p-4'} statusBarProps={{title: detail.type <= 2 ? detail.title: TITLES[detail.type]}} style={{backgroundColor: 'white'}}>
                <View className={'text-xl font-bold'}>
                    {detail.title}
                </View>
                {/*{detail.type != 3 &&*/}
                {/*    <View className={'text-gray-400 mt-2 flex justify-between'}>*/}
                {/*        <View>{detail.createTime}</View>*/}
                {/*        <View><Text className={'fa fa-eye mr-1'} />{detail.views}</View>*/}
                {/*    </View>*/}
                {/*}*/}
                <View className={'mt-2 relative w-full'}>
                    <RichText className={'w-full'} nodes={utils.resolveHtmlImageWidth(detail.content)} space={'nbsp'} />
                </View>
            </PageLayout>
        );
    }
}
