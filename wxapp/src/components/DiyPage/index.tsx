import { FC, useEffect, useState } from "react";
import util from "../../utils/we7/util";
import request, { API_DIY_PAGE, SERVICE_WINKT_SYSTEM_HEADER } from "../../utils/request";
import withLogin from "../login/login";
import Taro from "@tarojs/taro";
import PageLayout from "../../layouts/PageLayout";
import modules from "../../modules";




const DiyPage: FC<any> = (props) => {
    const { pageIdentifier } = props;
    const [loading, setLoading] = useState<boolean>(true);
    const [statusBarProps, setStatusBarProps] = useState<any>({});
    const [page, setPage] = useState<any>();

    useEffect(() => {
        request.get(API_DIY_PAGE + '/' + pageIdentifier, SERVICE_WINKT_SYSTEM_HEADER).then(res => {
            let page = res.data.data;
            page.modules = JSON.parse(page.modules);
            page.controls = JSON.parse(page.controls);
            page.style = JSON.parse(page.style);
            //设置状态栏
            let statusBarDiyData = page.controls[0].data;
            statusBarProps.hide = statusBarDiyData.basic.hide;
            statusBarProps.title = statusBarDiyData.basic.text;
            statusBarProps.bgColor = statusBarDiyData.style.background;
            statusBarProps.color = statusBarDiyData.basic.color;
            statusBarProps.fontSize = util.px2rpx(statusBarDiyData.basic.fontSize);
            if (statusBarDiyData.style.background != '#ffffff') {
                Taro.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: statusBarDiyData.style.background }).then();
            }
            page.style.paddingLeft = util.px2rpx(page.style.paddingLeft);
            page.style.paddingTop = util.px2rpx(page.style.paddingTop);
            page.style.paddingRight = util.px2rpx(page.style.paddingRight);
            page.style.paddingBottom = util.px2rpx(page.style.paddingBottom);
            console.log('computed statusbar props is', statusBarProps);
            console.log('page diy data is', page);
            setPage(page);
            setStatusBarProps(statusBarProps);
            setLoading(false);
        });
    }, []);

    return (
        <PageLayout style={page?.style} showTabBar={true} showStatusBar={true} statusBarProps={statusBarProps} pageLoading={loading}>
            {page?.controls.filter(o=>o.key==='USER_HEADER').map((m: any) => {
                const Module = modules[m.key];
                if (Module) {
                    return <Module {...m.data} />;
                }
                return <></>;
            })}
            {page?.modules.map((m: any) => {
                const Module = modules[m.key];
                if (Module) {
                    return <Module {...m.data} />;
                }
                return <></>;
            })}
            {page?.controls.filter(o=>o.key==='POP_ADVERTISE').map((m: any) => {
                const Module = modules[m.key];
                if (Module) {
                    return <Module {...m.data} />;
                }
                return <></>;
            })}
        </PageLayout>
    );
}


export default withLogin(DiyPage);
