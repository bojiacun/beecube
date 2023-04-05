import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {connect} from "react-redux";
import request from "../../lib/request";
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
export default class Index extends Component<any, any> {
    state:any = {
        isNative: true,
        roomID: null,
        roomName: null,
        liveAppID: null,
        wsServerURL: null,
        logServerURL: null,
        loginType: 0
    }

    options: any;

    constructor(props) {
        super(props);
        // this.startPushStream = this.startPushStream.bind(this);
        // this.onStreamUrlUpdate = this.onStreamUrlUpdate.bind(this);
    }

    async componentDidUpdate(prevProps: Readonly<any>) {
        const {userInfo} = this.props.context;
        const {settings} = this.props;
        const options = this.options;
        if(!prevProps.userInfo && userInfo && !this.state.token) {
            const result = await request.put('/paimai/api/live/login', userInfo);
            const token = result.data.result;
            this.setState({
                roomID: options.roomId,
                roomName: options.roomName,
                loginType: options.loginType,
                liveAppID: settings.zegoAppId,
                wsServerURL: settings.zegoServerAddress,
                logServerURL: settings.zegoLogUrl,
                token: token,
            });
        }
    }



    onStreamUrlUpdate(streamId, url, type) {
        console.log(streamId, url, type);
        this.setState({pushUrl: url});
    }
    // async startPushStream() {
    //     zg.startPublishingStream(this.streamId);
    // }
    //
    onLoad(options) {
        this.options = options;
    }
    //
    // componentWillUnmount() {
    //     zg.stopPublishingStream(this.streamId);
    //     zg.release();
    //     zg.logout();
    // }

    render() {
        if(!this.state.token) return <PageLoading />;

        return (
            <PageLayout statusBarProps={{title: '', style: {background: 'transparent', position: 'fixed'}}} style={{background: 'black'}}>
                <live id={'live-room'} logServerURL='dddd' />
            </PageLayout>
        );
    }
}
