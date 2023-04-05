import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {connect} from "react-redux";
import zg from '../../lib/zego';
import request from "../../lib/request";
import {LivePusher} from "@tarojs/components";


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
    state:any = {
        pushUrl: null
    }

    roomId: any;
    streamId: any;

    constructor(props) {
        super(props);
        this.startPushStream = this.startPushStream.bind(this);
        this.onStreamUrlUpdate = this.onStreamUrlUpdate.bind(this);
    }


    async componentDidUpdate(prevProps: Readonly<any>) {
        const {userInfo} = this.props.context;
        if(!prevProps.userInfo && userInfo && this.roomId && this.streamId && !this.state.pushUrl) {
            const result = await request.put('/paimai/api/live/login', userInfo);
            const token = result.data.result;
            //登录直播间
            zg.login(this.roomId, 1, token, (params) => {
                console.log("登录房间成功", this.roomId, params);
                // zg.onStreamUrlUpdate = this.onStreamUrlUpdate;
                //开始推流
                this.startPushStream();
            },(e) => {
                console.log("登录房间失败", this.roomId, e);
            });
        }
    }

    onStreamUrlUpdate(streamId, url, type) {
        console.log(streamId, url, type);
        this.setState({pushUrl: url});
    }
    async startPushStream() {
        zg.startPublishingStream(this.streamId);
    }

    async onLoad(options) {
        this.roomId = options.roomId;
        this.streamId = options.streamId;
        zg.onStreamUrlUpdate = this.onStreamUrlUpdate;
    }

    componentWillUnmount() {
        zg.stopPublishingStream(this.streamId);
        zg.release();
        zg.logout();
    }

    render() {
        return (
            <PageLayout statusBarProps={{title: '', style: {background: 'transparent', position: 'fixed'}}} style={{background: 'black'}}>
                <live-room />
            </PageLayout>
        );
    }
}
