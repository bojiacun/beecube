import { FC, useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import PageLayout from "../../layouts/PageLayout";
import modules from "../../modules";
import request from "../../lib/request";


export interface DiyPageProps extends Partial<any> {
  pageIdentifier: string;
}


const DiyPage: FC<DiyPageProps> = (props) => {
    const { pageIdentifier } = props;
    const [loading, setLoading] = useState<boolean>(true);
    const [statusBarProps, setStatusBarProps] = useState<any>({});
    const [page, setPage] = useState<any>();

    useEffect(() => {
        request.get('/app/api/pages/' + pageIdentifier).then(res => {
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
            statusBarProps.fontSize = Taro.pxTransform(statusBarDiyData.basic.fontSize);
            if (statusBarDiyData.style.background != '#ffffff') {
                Taro.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: statusBarDiyData.style.background }).then();
            }
            page.style.paddingLeft = Taro.pxTransform(page.style.paddingLeft);
            page.style.paddingTop = Taro.pxTransform(page.style.paddingTop);
            page.style.paddingRight = Taro.pxTransform(page.style.paddingRight);
            page.style.paddingBottom = Taro.pxTransform(page.style.paddingBottom);
            setPage(page);
            setStatusBarProps(statusBarProps);
            setLoading(false);
        });
    }, []);

    return (
        <PageLayout style={page?.style} showTabBar={true} showStatusBar={true} statusBarProps={statusBarProps} pageLoading={loading}>
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


export default DiyPage;
