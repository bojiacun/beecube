import {ActionFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_APP_SETTINGS_UPDATE, postFormInit, requestWithToken} from "~/utils/request.server";
import {formData2Json} from "~/utils/utils";

export const action: ActionFunction = async ({request}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    const groupKey = url.searchParams.get("group");
    if(groupKey == null) throw new Response("参数错误", {status: 500});
    const formData = await request.formData();
    const data = formData2Json(formData);
    let postData:any = {};
    postData[groupKey] = data;
    return await requestWithToken(request)(API_APP_SETTINGS_UPDATE, postFormInit(postData))
}