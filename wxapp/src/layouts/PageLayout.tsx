import {Component} from "react";
import PageLoading from "../components/pageloading";
import StatusBar from "../components/statusbar";
import TabBar from "../components/tabbar";
import {View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {connect} from "react-redux";

// @ts-ignore
@connect((state:any)=>(
  {
    tabs: state.tabs,
    pageLoading: state.pageLoading,
    systemInfo: state.context.systemInfo,
    settings: state.context.settings,
    navBarHeight: state.context.navBarHeight,
    context: state.context
  }
))

class PageLayout extends Component<any, any> {

    render() {
      const {
        pageLoading,
        tabs,
        children,
        showStatusBar,
        showTabBar,
        statusBarProps,
        style = {},
        className,
        loading,
      } = this.props;

      let menuButtonRect = Taro.getMenuButtonBoundingClientRect();
      let _statusBarProps = {
        title: '',
        titleCenter: true,
        statusHeight: menuButtonRect.top,
        navBarHeight: menuButtonRect.height,
        bgColor: '#ffffff',
        color: '#000000',
        hide: false,
        position: 'sticky',
        theme: 'light'
      };
      _statusBarProps = Object.assign({}, _statusBarProps, statusBarProps);

      if (!showStatusBar || statusBarProps.hide) {
        //顶部导航栏显示则增加页面内容PaddingTop
        // style.paddingTop = _statusBarProps.statusHeight + _statusBarProps.navBarHeight;
      }
      style.position = 'relative';

      if(pageLoading || loading) return <PageLoading />;
      return (
        <>
          {showStatusBar && <StatusBar {..._statusBarProps} />}
          <View style={style} className={className}>
            {children}
            {showTabBar && <View style={{height: Taro.pxTransform(100)}}/>}
            {showTabBar && <TabBar tabs={tabs}/>}
          </View>
        </>
      );
    }

}



export default PageLayout
