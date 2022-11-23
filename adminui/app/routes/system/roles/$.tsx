import {ActionFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_ROLE_EDIT, putFormInit, requestWithToken} from "~/utils/request.server";
import {formData2Json} from "~/utils/utils";

export const action: ActionFunction = async ({request}) => {
    await requireAuthenticated(request);
    const formData = await request.formData();
    let jsonData:any = formData2Json(formData);
    delete jsonData.updateTime;
    delete jsonData.updateBy;
    return await requestWithToken(request)(API_ROLE_EDIT, putFormInit(JSON.stringify(jsonData)))
}