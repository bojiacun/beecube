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


    onLoad() {
    }


    render() {
        return (
            <PageLayout statusBarProps={{title: '直播推送'}}>

            </PageLayout>
        );
    }
}
