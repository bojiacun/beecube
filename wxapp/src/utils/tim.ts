import TIMLiveShell from "im-live-sells";
import TIM from 'tim-wx-sdk';
import context from "./context";


export interface TimMessage {
    nick: string;
    avatar?: string;
    message: string;
    type?: string;
    userID?: string;
    animation?: any;
    time?:any;
}

export default class TencentIM {
    private static _instance:TIMLiveShell;

    //不用单例的原因是ON事件绑定会重复
    static newInstance(userId: string, userSig: string) : TIMLiveShell {
        this._instance = new TIMLiveShell({
            SDKAppID: parseInt(context.settings.tencentIMSdkAppId),
            userSig: userSig,
            userName: userId,
            TIM: TIM,
            groupCustomFieldFilter: [],
        });
        return this._instance;
    }
}
