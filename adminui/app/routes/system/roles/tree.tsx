import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_ROLE_QUERYTREELIST, requestWithToken} from "~/utils/request.server";

export const loader: LoaderFunction = async ({request}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    let queryString = '?' + url.searchParams.toString();
    const result = await requestWithToken(request)(API_ROLE_QUERYTREELIST + queryString);
    return json(result.result);
}