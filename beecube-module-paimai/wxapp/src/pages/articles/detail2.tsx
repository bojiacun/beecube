import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import PageLoading from "../../components/pageloading";
import request from "../../lib/request";
import {Video} from "@tarojs/components";
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
            path: '/pages/articles/detail2?id=' + this.state.id +'&mid='+mid
        }
    }


    componentDidMount() {
    }


    render() {
        const {detail} = this.state;
        const {systemInfo} = this.props;
        if(detail == null) return <PageLoading />;

        let contentHeight = 'calc(100vh - ' + utils.calcPageHeaderHeight(systemInfo)+'px)';

        return (
            <PageLayout showTabBar={false} statusBarProps={{title: detail.title}} style={{backgroundColor: 'black', paddingBottom: 0}}>
                <Video src={utils.resolveUrl(detail.video)} className={'w-screen'}  style={{height:contentHeight}} objectFit={'contain'} />
            </PageLayout>
        );
    }
}
