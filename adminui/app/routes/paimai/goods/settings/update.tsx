import {ActionFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_PAIMAI_SETTINGS_UPDATE, postFormInit, requestWithToken} from "~/utils/request.server";
import {formData2Json} from "~/utils/utils";

export const action: ActionFunction = async ({request}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    const formData = await request.formData();
    const data = formData2Json(formData);
    return await requestWithToken(request)(API_PAIMAI_SETTINGS_UPDATE+'?'+url.searchParams.toString(), postFormInit(data));
}