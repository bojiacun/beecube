import {Component} from 'react'
import DiyPage from "../../components/diy";
import {connect} from "react-redux";
import PageLoading from "../../components/pageloading";
// @ts-ignore
@connect((state: any) => (
    {
        systemInfo: state.context.systemInfo,
        settings: state.context.settings,
        context: state.context,
        message: state.message
    }
))
export default class Index extends Component<any,any> {
    state:any = {
        options: null
    }

    onLoad(options) {
        this.setState({options});
    }

    onShareTimeline() {
        let mid = this.props.context?.userInfo?.id || '';
        return {
            title: this.state.goods?.title,
            query: {mid: mid, id: this.state.options.id},
        }
    }

    onShareAppMessage() {
        let mid = this.props.context?.userInfo?.id || '';
        let settings = this.props.settings;
        return {
            title: settings.shareTitle || '超值拍品正在拍卖中，快来围观！',
            path: '/pages/index/diy?mid=' + mid+'&id='+this.state.options.id,
        }
    }

    render() {
        if(!this.state.options) return <PageLoading />;
        return (
            <DiyPage pageIdentifier={this.state.options.id} />
        )
    }
}
