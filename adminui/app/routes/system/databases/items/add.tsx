import {ActionFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_DATABASE_DICT_ITEM_ADD, postFormInit, requestWithToken} from "~/utils/request.server";

export const action: ActionFunction = async ({request}) => {
    await requireAuthenticated(request);
    const formData = await request.formData();
    let jsonData:any = {};
    formData.forEach((value, key)=>jsonData[key] = value);
    return await requestWithToken(request)(API_DATABASE_DICT_ITEM_ADD, postFormInit(JSON.stringify(jsonData)))
}