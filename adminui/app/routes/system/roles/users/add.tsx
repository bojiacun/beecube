import {ActionFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_USER_ADDSYSUSERROLE, API_USER_ROLE_DELETE, postFormInit, requestWithToken} from "~/utils/request.server";

export const action: ActionFunction = async ({request, params}) => {
    await requireAuthenticated(request);
    const formData = await request.formData();
    let jsonData:any = {};
    formData.forEach((value, key)=>jsonData[key] = value);
    jsonData.userIdList = jsonData.userIdList.split(',');
    return await requestWithToken(request)(API_USER_ADDSYSUSERROLE, postFormInit(JSON.stringify(jsonData)))
}