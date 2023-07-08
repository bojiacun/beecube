import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import _ from "lodash";
import querystring from "querystring";
import {DefaultListSearchParams, defaultRouteCatchBoundary, defaultRouteErrorBoundary} from "~/utils/utils";
import {API_PAIMAI_GOODS_LIST, requestWithToken} from "~/utils/request.server";
import {withPageLoading} from "~/utils/components";
import BuyoutList from "~/pages/paimai/BuyoutList";



export const ErrorBoundary = defaultRouteErrorBoundary;

export const CatchBoundary = defaultRouteCatchBoundary;

export const loader: LoaderFunction = async ({request}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    url.searchParams.set('type', '2');
    if(!url.searchParams.has('column')) {
        url.searchParams.set('column', 'createTime');
    }
    if(!url.searchParams.has('order')) {
        url.searchParams.set('order', 'desc');
    }
    if(url.searchParams.get('recommend') == 'on') {
        url.searchParams.set('recommend', '1');
    }
    else {
        url.searchParams.delete('recommend');
    }
    let queryString = '';
    if (_.isEmpty(url.search)) {
        queryString = '?' + querystring.stringify(DefaultListSearchParams);
    }
    else {
        queryString = '?' + url.searchParams.toString();
    }
    const result = await requestWithToken(request)(API_PAIMAI_GOODS_LIST+ queryString);
    return json(result.result);
}

const BuyoutListPage = (props:any) => {
    return (
        <BuyoutList {...props} />
    );
}

export default withPageLoading(BuyoutListPage);