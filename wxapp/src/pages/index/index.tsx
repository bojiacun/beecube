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
        return {
            title: this.state.goods?.title,
            path: '/pages/index/index?mid=' + mid
        }
    }

    render() {
        return (
            <DiyPage pageIdentifier={'HOME'}/>
        )
    }
}
