import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import _ from "lodash";
import querystring from "querystring";
import {DefaultListSearchParams, defaultRouteCatchBoundary, defaultRouteErrorBoundary} from "~/utils/utils";
import {API_PAIMAI_COUPON_LIST, API_PAIMAI_COUPON_TICKET_LIST, requestWithToken} from "~/utils/request.server";
import {withPageLoading} from "~/utils/components";
import CouponList from "~/pages/paimai/CouponList";
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
    const result = await requestWithToken(request)(API_PAIMAI_COUPON_TICKET_LIST + queryString);
    return json(result.result);
}