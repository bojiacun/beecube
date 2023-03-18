import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import _ from "lodash";
import querystring from "querystring";
import {DefaultListSearchParams, defaultRouteCatchBoundary, defaultRouteErrorBoundary} from "~/utils/utils";
import {API_PAIMAI_GOODS_RUNNING_LIST, requestWithToken} from "~/utils/request.server";
import {withPageLoading} from "~/utils/components";
import RunningGoodsList from "~/pages/paimai/RunningGoodsList";
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
    const result = await requestWithToken(request)(API_PAIMAI_GOODS_RUNNING_LIST+ queryString);
    return json(result.result);
}

const RunningGoodsListPage = (props:any) => {
    return (
        <RunningGoodsList {...props} />
    );
}

export default withPageLoading(RunningGoodsListPage);