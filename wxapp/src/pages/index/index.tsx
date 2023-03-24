import {Component} from 'react'
import './index.scss'
import DiyPage from "../../components/diy";
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

    onShareTimeline() {
        let mid = this.props.context?.userInfo?.id || '';
        return {
            title: this.state.goods?.title,
            query: {mid: mid},
        }
    }

    onShareAppMessage() {
        let mid = this.props.context?.userInfo?.id || '';
        let settings = this.props.settings;
        console.log('mid is',mid);
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
