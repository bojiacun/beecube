import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import PageLoading from "../../components/pageloading";
import request from "../../lib/request";
import {Button, Text, Video, View} from "@tarojs/components";
import utils from "../../lib/utils";
import {connect} from "react-redux";

// @ts-ignore
@connect((state: any) => (
    {
        systemInfo: state.context.systemInfo,
        settings: state.context.settings,
        context: state.context,
        message: state.message
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
            path: '/articles/pages/detail2?id=' + this.state.id +'&mid='+mid
        }
    }


    componentDidMount() {
    }


    render() {
        const {detail} = this.state;
        const {systemInfo} = this.props;
        if(detail == null) return <PageLoading />;

        let contentHeight = '100vh';
        let safeBottom = utils.calcSafeBottom(systemInfo);

        return (
            <PageLayout showTabBar={false} statusBarProps={{title: '', style: {background: 'transparent'}, isFixed:true}} style={{backgroundColor: 'black', paddingBottom: 0}}>
                <Video src={utils.resolveUrl(detail.video)} className={'w-screen'} controls={true}  style={{height:contentHeight}} objectFit={'contain'} />
                <View className={'absolute bottom-0 w-full p-4 space-y-4'} style={{marginBottom: safeBottom}}>
                    <View className={'text-white text-2xl font-bold'}>{detail.title}</View>
                    <View className={'text-gray-400'}>{detail.author}</View>
                    <View className={'text-gray-400'}>{utils.delHtml(detail.description)}</View>
                    <View className={'flex items-center justify-end text-white'}>
                        <View><Text className={'fa fa-heart-o mr-2'} />{detail.views}</View>
                        <View className={'ml-4 flex items-center'}>
                            <Button plain={true} openType={'share'} className={'btn btn-white text-lg block flex-none'}><Text className={'fa fa-share-square-o mr-2'} />分享</Button>
                        </View>
                    </View>
                </View>
            </PageLayout>
        );
    }
}
