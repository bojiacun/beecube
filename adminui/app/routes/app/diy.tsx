import {DefaultListSearchParams, defaultRouteCatchBoundary, defaultRouteErrorBoundary, formData2Json} from "~/utils/utils";
import {withPageLoading} from "~/utils/components";
import diyPageStyleUrl from 'app/styles/diy.css';
import {json, LinksFunction, LoaderFunction} from "@remix-run/node";
import PageDesigner from "~/components/page-designer";
import {useEffect, useState} from "react";
import {DEFAULT_PAGE_DATA} from "~/components/page-designer/page";
import {defaultAppHeaderData, MINI_APP_HEADER} from "~/components/page-designer/controls/MiniAppHeader";
import registers from '~/components/page-designer/registers';
import {requireAuthenticated} from "~/utils/auth.server";
import _ from "lodash";
import querystring from "querystring";
import {
    API_APP_DIY_PAGE_LIST,
    requestWithToken
} from "~/utils/request.server";
import {useFetcher, useFetchers, useLoaderData} from "@remix-run/react";
import axios from "~/utils/request.client";
import {sessionStorage} from '~/utils/auth.server';

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
    pages.forEach((p:any)=>{
        p.controls = JSON.parse(p.controls);
        p.modules = JSON.parse(p.modules);
        p.style = JSON.parse(p.styles);
    })
    return json({module: session.get("MODULE"), pages});
}


const DiyPage = (props:any) => {
    const appData = useLoaderData();
    const [loading, setLoading] = useState(true);
    const [pages, setPages] = useState<any>([]);
    const [links, setLinks] = useState<any[]>([]);
    const searchFetcher = useFetcher();


    useEffect(()=>{
        searchFetcher.load("/app/links");
    }, []);

    useEffect(() => {
        if (searchFetcher.type === 'done' && searchFetcher.data) {
            setLinks(searchFetcher.data);
        }
    }, [searchFetcher.state]);

    useEffect(()=>{
        registers(appData.module);
        let _pages = (appData.pages && appData.pages.length > 0) ? appData.pages : [
            {
                id: '',
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

    const handleDataSave = (page:any) => {
        let data = {...page};
        return axios.post('/app/diy/save', data);
    }

    if(loading) return <></>;

    return (
        <PageDesigner pages={pages} lockPage={true} links={links} onDataSaved={handleDataSave} />
    );
}

export default withPageLoading(DiyPage);