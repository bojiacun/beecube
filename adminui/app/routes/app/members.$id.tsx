import {DefaultListSearchParams, defaultRouteCatchBoundary, defaultRouteErrorBoundary} from "~/utils/utils";
import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import _ from "lodash";
import querystring from "querystring";
import {API_APP_MEMBER_LIST, requestWithToken} from "~/utils/request.server";
import {withPageLoading} from "~/utils/components";
import AppMemberList from "~/pages/app/AppMemberList";
import {useLocation} from "react-router";

export const ErrorBoundary = defaultRouteErrorBoundary;
export const CatchBoundary = defaultRouteCatchBoundary;


export const loader: LoaderFunction = async ({request,params}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    url.searchParams.set('shareId', params?.id||'');
    let queryString = '';
    if (_.isEmpty(url.search)) {
        queryString = '?' + querystring.stringify(DefaultListSearchParams);
    }
    else {
        queryString = '?' + url.searchParams.toString();
    }
    const result = await requestWithToken(request)(API_APP_MEMBER_LIST+ queryString);
    return json(result.result);
}

const AppMemberListPage = (props:any) => {
    return (
        <AppMemberList {...props} isChildren={true} />
    );
}

export default withPageLoading(AppMemberListPage);