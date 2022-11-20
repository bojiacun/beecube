import {json, LoaderFunction} from "@remix-run/node";
import {LoginedUser, requireAuthenticated} from "~/utils/auth.server";
import _ from "lodash";
import querystring from "querystring";
import {DefaultListSearchParams} from "~/utils/utils";
import {API_USER_ROLE_LIST_ALL, requestWithToken} from "~/utils/request.server";

export const loader: LoaderFunction = async ({request,params}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    //@ts-ignore
    url.searchParams.append("userid", params.id);
    let queryString = '';
    if (_.isEmpty(url.search)) {
        queryString = '?' + querystring.stringify(DefaultListSearchParams);
    }
    else {
        queryString = '?' + url.searchParams.toString();
    }
    console.log(queryString);
    const result = await requestWithToken(request)(API_USER_ROLE_LIST_ALL+ queryString);
    return json(result.result);
}