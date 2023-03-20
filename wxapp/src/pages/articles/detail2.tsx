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


    componentDidMount() {
    }


    render() {
        const {detail} = this.state;
        const {systemInfo} = this.props;
        if(detail == null) return <PageLoading />;

        return (
            <PageLayout showTabBar={false} statusBarProps={{title: detail.title, style: {height: '80rpx'}}} style={{backgroundColor: 'white', paddingBottom: 0}}>
                <Video src={utils.resolveUrl(detail.video)} className={'w-screen'} style={{height: 'calc(100vh - 80rpx - '+systemInfo.safeArea.top+'px)'}} objectFit={'contain'} />
            </PageLayout>
        );
    }
}
