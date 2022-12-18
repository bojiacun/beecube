import {ActionFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_APP_USER_BIND, API_USER_ADDSYSUSERROLE, postFormInit, requestWithToken} from "~/utils/request.server";
import {formData2Json} from "~/utils/utils";

export const action: ActionFunction = async ({request, params}) => {
    await requireAuthenticated(request);
    const formData = await request.formData();
    let jsonData = formData2Json(formData, false);
    jsonData.userIdList = jsonData.userIdList.split(',');
    return await requestWithToken(request)(API_APP_USER_BIND, postFormInit(JSON.stringify(jsonData)))
}