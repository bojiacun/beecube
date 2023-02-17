import {DefaultListSearchParams, defaultRouteCatchBoundary, defaultRouteErrorBoundary} from "~/utils/utils";
import {withPageLoading} from "~/utils/components";
import diyPageStyleUrl from 'app/styles/diy.css';
import {json, LinksFunction, LoaderFunction} from "@remix-run/node";
import PageDesigner from "~/components/page-designer";
import {useEffect, useState} from "react";
import {DEFAULT_PAGE_DATA} from "~/components/page-designer/page";
import {defaultAppHeaderData, MINI_APP_HEADER} from "~/components/page-designer/controls/MiniAppHeader";
import {AppLinks} from './links';
import registers from '~/components/page-designer/registers';
import {requireAuthenticated} from "~/utils/auth.server";
import _ from "lodash";
import querystring from "querystring";
import {API_APP_DIY_PAGE_LIST, API_APP_MEMBER_LIST, requestWithToken} from "~/utils/request.server";
import {useFetcher, useLoaderData} from "@remix-run/react";

export const ErrorBoundary = defaultRouteErrorBoundary;
export const CatchBoundary = defaultRouteCatchBoundary;

export const links: LinksFunction = () => {
    return [
        {rel: 'stylesheet', href: diyPageStyleUrl},
    ];
}
export const loader: LoaderFunction = async ({request}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    if(session.has("APPID")) {
        url.searchParams.set('appId', session.get("APPID"));
    }
    let queryString = '';
    if (_.isEmpty(url.search)) {
        queryString = '?' + querystring.stringify(DefaultListSearchParams);
    }
    else {
        queryString = '?' + url.searchParams.toString();
    }
    const result = await requestWithToken(request)(API_APP_DIY_PAGE_LIST + queryString);
    const pages = result.result;
    return json({module: session.get("MODULE"), pages});
}


const DiyPage = (props:any) => {
    const appData = useLoaderData();
    const [loading, setLoading] = useState(true);
    const [pages, setPages] = useState<any>([]);
    const postFetcher = useFetcher();

    useEffect(()=>{
        registers(null);
        let _pages = appData.pages ?? [
            {
                id: 0,
                controls: [{key: MINI_APP_HEADER, data: defaultAppHeaderData}],
                modules: [],
                title: '首页',
                identifier: 'HOME',
                canDelete: false,
                style: DEFAULT_PAGE_DATA
            }
        ];
        setPages(_pages);
    }, []);

    useEffect(()=>{
        if(pages.length > 0) {
            setLoading(false);
        }
    }, [pages]);

    const handleDataSave = (pages:any) => {
        return Promise.all(pages.map((p:any)=>{
            if(p.id == 0) {
                return postFetcher
            }
        }));
    }

    if(loading) return <></>;

    return (
        <PageDesigner pages={pages} lockPage={true} links={AppLinks} onDataSaved={handleDataSave} />
    );
}

export default withPageLoading(DiyPage);