import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import _ from "lodash";
import querystring from "querystring";
import {DefaultListSearchParams} from "~/utils/utils";
import {API_APP_WXOPEN_AUTH_CALLBACK, requestWithToken} from "~/utils/request.server";
import AppNavList from "~/pages/app/AppNavList";
import {withPageLoading} from "~/utils/components";
import {useLoaderData} from "@remix-run/react";

export const loader: LoaderFunction = async ({request}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    let queryString = '';
    if (_.isEmpty(url.search)) {
        queryString = '?' + querystring.stringify(DefaultListSearchParams);
    }
    else {
        queryString = '?' + url.searchParams.toString();
    }
    const result = await requestWithToken(request)(API_APP_WXOPEN_AUTH_CALLBACK+ queryString);
    return json(result.result);
}


const WxOpenAuthCallbackPage = (props:any) => {
    const data = useLoaderData();
    return (
        <div>{JSON.stringify(data)}</div>
    );
}

export default withPageLoading(WxOpenAuthCallbackPage);