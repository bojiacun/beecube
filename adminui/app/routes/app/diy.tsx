import {defaultRouteCatchBoundary, defaultRouteErrorBoundary} from "~/utils/utils";
import {withPageLoading} from "~/utils/components";
import diyPageStyleUrl from 'app/styles/diy.css';
import {LinksFunction} from "@remix-run/node";
import PageDesigner from "~/components/page-designer";
import { useState } from "react";
import {DEFAULT_PAGE_DATA} from "~/components/page-designer/page";
import {MINI_APP_HEADER} from "~/components/page-designer/controls/MiniAppHeader";
import { getControl } from "~/components/page-designer/component";

export const ErrorBoundary = defaultRouteErrorBoundary;
export const CatchBoundary = defaultRouteCatchBoundary;

export const links: LinksFunction = () => {
    return [
        {rel: 'stylesheet', href: diyPageStyleUrl},
    ];
}


const DiyPage = (props:any) => {
    const appHeaderControl = {...getControl(MINI_APP_HEADER)};
    const [pages, setPages] = useState<any>([
        {
            controls: [appHeaderControl],
            modules: [],
            title: '首页',
            canDelete: false,
            style: DEFAULT_PAGE_DATA
        }
    ]);

    return (
        <PageDesigner pages={pages} lockPage={true} />
    );
}

export default withPageLoading(DiyPage);