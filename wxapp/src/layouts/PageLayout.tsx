import {Component} from "react";
import PageLoading from "../components/pageloading";
import StatusBar, {StatusbarProps} from "../components/statusbar";
import TabBar from "../components/tabbar";
import {View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {connect} from "react-redux";
import styles from './index.module.scss';
import classNames from "classnames";
import Copyright from "../components/copyright";

// @ts-ignore
@connect((state: any) => (
    {
        pageLoading: state.pageLoading,
        systemInfo: state.context.systemInfo,
        settings: state.context.settings,
        context: state.context
    }
))
class PageLayout extends Component<PayLayoutProps, any> {
    state: any = {
        pageStyle: {}
    }

    componentDidMount() {
        const {systemInfo, showTabBar = false, enableReachBottom = false} = this.props;
        let initPageStyle: any = {
            paddingBottom: Taro.pxTransform((systemInfo.safeArea.bottom - systemInfo.safeArea.height) + (showTabBar ? 80 : 0)),
        };

        if (enableReachBottom) {
            //如果启用下拉刷新，则需要禁用外层滚动，改用page滚动
            initPageStyle.height = 'auto';
            initPageStyle.overflowY = 'visible';
        }
        this.setState({pageStyle: initPageStyle});
    }

    render() {
        const {
            pageLoading,
            children,
            showStatusBar = true,
            showTabBar = false,
            style = {},
            className,
            containerClassName = '',
            loading,
            statusBarProps = {},
            enableReachBottom = false,
            copyright = true,
        } = this.props;

        if (pageLoading || loading) return <PageLoading/>;
        if (enableReachBottom) {
            return (
                <>
                    {showStatusBar && <StatusBar {...statusBarProps} />}
                    {children}
                    {copyright && <Copyright />}
                    {showTabBar && <TabBar/>}
                </>
            );
        }

        return (
            <View className={classNames(styles.page, className)} style={{...style, ...this.state.pageStyle}}>
                {showStatusBar && <StatusBar {...statusBarProps} />}
                <View className={containerClassName}>
                    {children}
                    {copyright && <Copyright />}
                    {showTabBar && <TabBar/>}
                </View>
            </View>
        );
    }

}


export interface PayLayoutProps extends Partial<any> {
    statusBarProps?: StatusbarProps;
    showStatusBar?: boolean;
    showTabBar?: boolean;
    enableReachBottom?: boolean;
}


export default PageLayout
