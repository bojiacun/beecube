import {Component} from "react";
import PageLayout from "../layouts/PageLayout";
import {connect} from "react-redux";
import {RichText, View} from "@tarojs/components";
import utils from "../lib/utils";
import PageLoading from "../components/pageloading";

//@ts-ignore
@connect((state: any) => (
    {
        systemInfo: state.context.systemInfo,
        settings: state.context.settings,
        context: state.context
    }
))
export default class Index extends Component<any, any> {
    state:any = {
        options: null,
    }
    onLoad(options) {
        this.setState({options});
    }

    render() {
        const {settings} = this.props;

        if(!this.state.options) return <PageLoading />;

        return (
            <PageLayout statusBarProps={{title: this.state.options.title}} style={{backgroundColor: 'white'}}>
                <View className={'p-4'}>
                    <RichText nodes={utils.resolveHtmlImageWidth(settings[this.state.options.key])} />
                </View>
            </PageLayout>
        );
    }
}
