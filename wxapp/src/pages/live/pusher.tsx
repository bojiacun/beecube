import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {connect} from "react-redux";
import zg from '../../lib/zego';
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
export default class Index extends Component<any, any> {
    roomId: any;

    async componentDidUpdate(prevProps: Readonly<any>) {
        const {userInfo} = this.props.context;
        if(!prevProps.userInfo && userInfo && this.roomId) {
            const result = await request.put('/paimai/api/live/login', userInfo);
            const token = result.data.result;
            //登录直播间
            zg.login(this.roomId, 1, token, (params) => {
                console.log("登录房间成功", this.roomId, params);
            },(e) => {
                console.log("登录房间失败", this.roomId, e);
            });
        }
    }

    async onLoad(options) {
        this.roomId = options.roomId;
    }


    render() {
        return (
            <PageLayout statusBarProps={{title: '直播推送'}}>

            </PageLayout>
        );
    }
}
