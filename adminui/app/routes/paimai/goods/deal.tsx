import {ActionFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_PAIMAI_GOODSOFFER_DEAL, putFormInit, requestWithToken} from "~/utils/request.server";
import {DefaultListSearchParams, formData2Json} from "~/utils/utils";
import _ from "lodash";
import querystring from "querystring";

export const action: ActionFunction = async ({request, params}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    let queryString = '';
    if (_.isEmpty(url.search)) {
        queryString = '?' + querystring.stringify(DefaultListSearchParams);
    }
    else {
        queryString = '?' + url.searchParams.toString();
    }
    const formData = await request.formData();
    return await requestWithToken(request)(API_PAIMAI_GOODSOFFER_DEAL+queryString, putFormInit(formData2Json(formData)));
}