import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import _ from "lodash";
import querystring from "querystring";
import {DefaultListSearchParams, defaultRouteCatchBoundary, defaultRouteErrorBoundary} from "~/utils/utils";
import {API_PERMISSION_LIST, requestWithToken} from "~/utils/request.server";
import PermissionList from "~/pages/system/PermissionList";
import {withPageLoading} from "~/utils/components";
export const ErrorBoundary = defaultRouteErrorBoundary;

export const CatchBoundary = defaultRouteCatchBoundary;
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
    const result = await requestWithToken(request)(API_PERMISSION_LIST + queryString);
    return json(result.result);
}


const PermissionListPage = () => {
    return (
        <PermissionList />
    );
}

export default withPageLoading(PermissionListPage);