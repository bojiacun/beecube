import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {RichText} from "@tarojs/components";
import utils from "../../lib/utils";
import {connect} from "react-redux";

// @ts-ignore
@connect((state: any) => (
    {
        systemInfo: state.context.systemInfo,
        settings: state.context.settings,
        context: state.context
    }
))
export default class Index extends Component<any, any> {
    render() {
        const {settings} = this.props;
        return (
            <PageLayout statusBarProps={{title: '积分规则'}}>
                <RichText className={'w-full'} nodes={utils.resolveHtmlImageWidth(settings.integralRule)} />
            </PageLayout>
        );
    }
}
