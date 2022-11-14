import {ActionFunction, json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_ROLE_PERMISSIONS, API_ROLE_PERMISSIONS_SAVE, postFormInit, requestWithToken} from "~/utils/request.server";


export const loader: LoaderFunction = async ({request}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    let queryString = '?' + url.searchParams.toString();
    const result = await requestWithToken(request)(API_ROLE_PERMISSIONS + queryString);
    return json(result.result);
}

export const action: ActionFunction = async ({request}) => {
    await requireAuthenticated(request);
    const formData = await request.formData();
    let jsonData:any = {};
    formData.forEach((value, key)=>jsonData[key] = value);
    return await requestWithToken(request)(API_ROLE_PERMISSIONS_SAVE, postFormInit(JSON.stringify(jsonData)))
}