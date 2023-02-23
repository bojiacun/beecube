import {Component} from "react";
import PageLoading from "../components/pageloading";
import StatusBar, {StatusbarProps} from "../components/statusbar";
import TabBar from "../components/tabbar";
import {View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {connect} from "react-redux";
import styles from './index.module.scss';
import classNames from "classnames";

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
  state = {
    pageStyle: {}
  }

  componentDidMount() {
    const {systemInfo, showTabBar = false} = this.props;
    this.setState({pageStyle: {paddingBottom: Taro.pxTransform((systemInfo.safeArea.bottom - systemInfo.safeArea.height) + (showTabBar ? 80 : 0))}});
  }

  render() {
    const {
      pageLoading,
      children,
      showStatusBar = true,
      showTabBar = false,
      style = {},
      className,
      loading,
      statusBarProps = {}
    } = this.props;

    if (pageLoading || loading) return <PageLoading/>;

    return (
      <View className={classNames(styles.page)} style={{...style, ...this.state.pageStyle}}>
        {showStatusBar && <StatusBar {...statusBarProps} />}
        <View className={className}>
          {children}
          {showTabBar && <TabBar />}
        </View>
      </View>
    );
  }

}


export interface PayLayoutProps extends Partial<any> {
  statusBarProps?: StatusbarProps;
  showStatusBar?: boolean;
  showTabBar?: boolean;
}


export default PageLayout
