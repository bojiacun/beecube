import {ActionFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_APP_DIY_PAGE_DELETE, deleteFormInit, requestWithToken} from "~/utils/request.server";
import {formData2Json} from "~/utils/utils";

export const action: ActionFunction = async ({request, params}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    return await requestWithToken(request)(API_APP_DIY_PAGE_DELETE+'?id='+url.searchParams.get('id'), deleteFormInit(null));
}