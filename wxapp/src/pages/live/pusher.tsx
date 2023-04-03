import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";

const  {ZegoClient}  = require("miniprogram-zego/jZego-wx");


export default class Index extends Component<any, any> {
    onLoad() {
        const zg = new ZegoClient();
        console.log(zg);
        zg.config({
            appid: 296889649,
            server: "wss://webliveroom296889649-api.imzego.com/ws",
            idName: '3636999',
            nickName: '薄先生',
            logLevel: 0,
            remoteLogLevel: 0,
            logUrl: 'https://weblogger296889649-api.imzego.com/httplog'
        });
    }


    render() {
        return (
            <PageLayout statusBarProps={{title: '直播推送'}}>

            </PageLayout>
        );
    }
}
