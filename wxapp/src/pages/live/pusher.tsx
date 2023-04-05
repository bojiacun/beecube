import {Component} from "react";
import {getCurrentInstance} from "@tarojs/taro";
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
        loginType: "1",
        token: null,
        userID: null,
        userName: null,
        userInfo: null
    }

    options: any;
    liveRoom: any;

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
                userID: userInfo.id,
                userName: userInfo.nickname,
                userInfo: userInfo
            });
        }
        if(this.state.token) {
            setTimeout(()=>{
                const {page} = getCurrentInstance();
                // @ts-ignore
                this.liveRoom = page?.selectComponent('#live-room');
                console.log('live room is',this.liveRoom);
                this.liveRoom.init();
            }, 1000);
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
        const {
            roomID,
            roomName,
            liveAppID,
            wsServerURL,
            logServerURL,
            loginType,
            token,
            userID,
            userName,
            userInfo
        } = this.state;
        if(!token) return <PageLoading />;

        // @ts-ignore
        return (
            <PageLayout statusBarProps={{title: '', style: {background: 'transparent', position: 'fixed'}}} style={{background: 'black'}}>
                <live
                    id={'live-room'}
                    liveAppID={liveAppID}
                    roomName={roomName}
                    roomID={roomID}
                    wsServerURL={wsServerURL}
                    logServerURL={logServerURL}
                    loginType={loginType}
                    token={token}
                    userID={userID}
                    userName={userName}
                    userInfo={userInfo}
                />
            </PageLayout>
        );
    }
}
