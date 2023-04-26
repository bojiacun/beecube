import {DefaultListSearchParams, defaultRouteCatchBoundary, defaultRouteErrorBoundary} from "~/utils/utils";
import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import _ from "lodash";
import querystring from "querystring";
import {API_APP_MEMBER_LIST, requestWithToken} from "~/utils/request.server";
import {withPageLoading} from "~/utils/components";
import AppMemberList from "~/pages/app/AppMemberList";

export const ErrorBoundary = defaultRouteErrorBoundary;
export const CatchBoundary = defaultRouteCatchBoundary;


export const loader: LoaderFunction = async ({request}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    if(url.searchParams.get('authStatus') == 'on') {
        url.searchParams.set('authStatus', '1');
    }
    else {
        url.searchParams.delete('authStatus');
    }
    if(url.searchParams.get('isAgent') == 'on') {
        url.searchParams.set('isAgent', '1');
    }
    else {
        url.searchParams.delete('isAgent');
    }

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
        <AppMemberList {...props} />
    );
}

export default withPageLoading(AppMemberListPage);