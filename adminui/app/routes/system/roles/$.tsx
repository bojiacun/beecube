import {ActionFunction, json} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_ROLE_EDIT, putFormInit, requestWithToken} from "~/utils/request.server";


export const action: ActionFunction = async ({request}) => {
    await requireAuthenticated(request);
    const formData = await request.formData();
    let jsonData:any = {};
    formData.forEach((value, key)=>jsonData[key] = value);
    const res = await requestWithToken(request)(API_ROLE_EDIT, putFormInit(jsonData))
    const result:any = await res.json();
    console.log(result);
    return json(result.result);
}