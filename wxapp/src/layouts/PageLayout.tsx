import {connect} from "react-redux";
import React, {useEffect} from "react";
import PropTypes from 'prop-types';
import PageLoading from "../components/pageloading";
import StatusBar from "../components/statusbar";
import TabBar from "../components/tabbar";
import {View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {setContext} from "../store/actions";


const PageLayout: React.FC<any> = connect((state: any) => ({
    tabs: state.tabs,
    pageLoading: state.pageLoading,
    systemInfo: state.context.systemInfo,
    settings: state.context.settings,
    navBarHeight: state.context.navBarHeight,
    context: state.context
}))((props: any) => {
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
        dispatch,
        context
    } = props;
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
    // if(_statusBarProps.theme === 'light') {
    //     Taro.setNavigationBarColor({frontColor: '#000000', backgroundColor: '#ffffff'}).then();
    // }
    // else if(_statusBarProps.theme === 'dark') {
    //     Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: '#000000'}).then();
    // }
    useEffect(()=>{
        context.headerHeight = _statusBarProps.statusHeight + _statusBarProps.navBarHeight;
        dispatch(setContext(context));
    }, []);
    return (
        <PageLoading loading={pageLoading||loading}>
            {showStatusBar && <StatusBar {..._statusBarProps} />}
            <View style={style} className={className}>
                {children}
                {showTabBar && <View style={{height: Taro.pxTransform(100)}}/>}
                {showTabBar && <TabBar tabs={tabs}/>}
            </View>
        </PageLoading>
    );
})

PageLayout.propTypes = {
    showStatusBar: PropTypes.bool.isRequired,
    showTabBar: PropTypes.bool.isRequired,
    statusBarProps: PropTypes.any,
    loading: PropTypes.bool,
}

PageLayout.defaultProps = {
    showStatusBar: true,
    showTabBar: false,
    loading: false,
    statusBarProps: {}
}

export default PageLayout
