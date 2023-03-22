import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import _ from "lodash";
import querystring from "querystring";
import {DefaultListSearchParams, defaultRouteCatchBoundary, defaultRouteErrorBoundary} from "~/utils/utils";
import {API_APP_WITHDRAW_LIST, requestWithToken} from "~/utils/request.server";
import {withPageLoading} from "~/utils/components";
import WithdrawList from "~/pages/app/WithdrawList";
export const ErrorBoundary = defaultRouteErrorBoundary;

export const CatchBoundary = defaultRouteCatchBoundary;

export const loader: LoaderFunction = async ({request}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    if(!url.searchParams.has('column')) {
        url.searchParams.set('column', 'createTime');
    }
    if(!url.searchParams.has('order')) {
        url.searchParams.set('order', 'desc');
    }
    let queryString = '';
    if (_.isEmpty(url.search)) {
        queryString = '?' + querystring.stringify(DefaultListSearchParams);
    }
    else {
        queryString = '?' + url.searchParams.toString();
    }
    const result = await requestWithToken(request)(API_APP_WITHDRAW_LIST+ queryString);
    return json(result.result);
}

const WithdrawListPage = (props:any) => {
    return (
        <WithdrawList {...props} />
    );
}

export default withPageLoading(WithdrawListPage);