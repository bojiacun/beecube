import {Component} from 'react'
import './index.scss'
import DiyPage from "../../components/diy";
import {connect} from "react-redux";
import request from "../../lib/request";
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

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    componentDidShow() {
    }

    componentDidHide() {
    }

    postIntegral() {
        request.post('/app/api/members/scores/share').then(()=>{});
    }

    onShareTimeline() {
        let settings = this.props.settings;
        let mid = this.props.context?.userInfo?.id || '';
        this.postIntegral();
        return {
            title: settings.shareTitle || '超值拍品正在拍卖中，快来围观！',
            query: {mid: mid},
        }
    }

    onShareAppMessage() {
        let mid = this.props.context?.userInfo?.id || '';
        let settings = this.props.settings;
        this.postIntegral();
        return {
            title: settings.shareTitle || '超值拍品正在拍卖中，快来围观！',
            path: '/pages/index/index?mid=' + mid
        }
    }

    render() {
        return (
            <DiyPage pageIdentifier={'HOME'} />
        )
    }
}
