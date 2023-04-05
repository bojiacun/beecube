import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
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
    state:any = {
        isNative: false,
        roomId: null,
        roomName: null,
        liveAppID: null,
        wsServerURL: null,
        logServerURL: null,
    }

    constructor(props) {
        super(props);
        // this.startPushStream = this.startPushStream.bind(this);
        // this.onStreamUrlUpdate = this.onStreamUrlUpdate.bind(this);
    }



    onStreamUrlUpdate(streamId, url, type) {
        console.log(streamId, url, type);
        this.setState({pushUrl: url});
    }
    // async startPushStream() {
    //     zg.startPublishingStream(this.streamId);
    // }
    //
    async onLoad(options) {
        const {settings} = this.props;
        console.log(settings);
        this.setState({
            roomId: options.roomId,
            roomName: options.roomName,
            loginType: options.loginType,
            liveAppID: settings.zegoAppId,
            wsServerURL: settings.zegoServerAddress,
            logServerURL: settings.zegoLogUrl,
        })
    }
    //
    // componentWillUnmount() {
    //     zg.stopPublishingStream(this.streamId);
    //     zg.release();
    //     zg.logout();
    // }

    render() {
        return (
            <PageLayout statusBarProps={{title: '', style: {background: 'transparent', position: 'fixed'}}} style={{background: 'black'}}>
                <live-room {...this.state} />
            </PageLayout>
        );
    }
}
