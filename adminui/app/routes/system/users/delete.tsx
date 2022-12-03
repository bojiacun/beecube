import {ActionFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_ROLE_DELETE, API_USER_DELETE, deleteFormInit, requestWithToken} from "~/utils/request.server";

export const action: ActionFunction = async ({request, params}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    return await requestWithToken(request)(API_USER_DELETE +'?id='+url.searchParams.get('id'), {method: 'delete'})
}