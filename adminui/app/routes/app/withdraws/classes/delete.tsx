import {ActionFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_PAIMAI_ARTICLE_CLASS_DELETE, deleteFormInit, requestWithToken} from "~/utils/request.server";
import {formData2Json} from "~/utils/utils";

export const action: ActionFunction = async ({request, params}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    const formData = await request.formData();
    return await requestWithToken(request)(API_PAIMAI_ARTICLE_CLASS_DELETE+'?id='+url.searchParams.get('id'), deleteFormInit(formData2Json(formData)));
}