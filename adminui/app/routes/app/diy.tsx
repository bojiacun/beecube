import {defaultRouteCatchBoundary, defaultRouteErrorBoundary} from "~/utils/utils";
import {withPageLoading} from "~/utils/components";
import diyPageStyleUrl from 'app/styles/diy.css';
import {LinksFunction} from "@remix-run/node";
import PageDesigner from "~/components/page-designer";
import {useEffect, useMemo, useState} from "react";
import {DEFAULT_PAGE_DATA} from "~/components/page-designer/page";
import {MINI_APP_HEADER} from "~/components/page-designer/controls/MiniAppHeader";
import { getControl } from "~/components/page-designer/component";
import {AppLinks} from './links';
import registers from '~/components/page-designer/registers';

export const ErrorBoundary = defaultRouteErrorBoundary;
export const CatchBoundary = defaultRouteCatchBoundary;

export const links: LinksFunction = () => {
    return [
        {rel: 'stylesheet', href: diyPageStyleUrl},
    ];
}


const DiyPage = (props:any) => {
    const [loading, setLoading] = useState(true);
    const [pages, setPages] = useState<any>([]);
    useEffect(()=>{
        registers(null);
        const appHeaderControl = {...getControl(MINI_APP_HEADER)};
        setPages([
            {
                controls: [appHeaderControl],
                modules: [],
                title: '首页',
                identifier: 'HOME',
                canDelete: false,
                style: DEFAULT_PAGE_DATA
            }
        ]);
    }, []);

    useEffect(()=>{
        if(pages.length > 0) {
            setLoading(false);
        }
    }, [pages]);

    if(loading) return <></>;

    return (
        <PageDesigner pages={pages} lockPage={true} links={AppLinks} />
    );
}

export default withPageLoading(DiyPage);