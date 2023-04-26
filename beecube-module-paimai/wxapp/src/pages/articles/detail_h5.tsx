import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {WebView} from "@tarojs/components";
import utils from "../../lib/utils";
import PageLoading from "../../components/pageloading";
import {connect} from "react-redux";

// @ts-ignore
@connect((state: any) => (
    {
        systemInfo: state.context.systemInfo,
    }
))
export default class Index extends Component<any, any> {
    state:any = {
        url: null,
    }

    onLoad(options){
        this.setState({url: options.url});
    }

    render() {
        const {systemInfo} = this.props;
        const contentHeight = `calc(100vh - ${utils.calcPageHeaderHeight(systemInfo)}px)`;
        if(!this.state.url) return <PageLoading />;

        return (
            <PageLayout statusBarProps={{title:'文章详情'}}>
                <WebView src={this.state.url}  className={'w-full'} style={{height:contentHeight}} />
            </PageLayout>
        );
    }
}
