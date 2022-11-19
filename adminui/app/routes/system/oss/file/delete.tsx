import {ActionFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_OSS_FILE_DELETE, deleteFormInit, requestWithToken} from "~/utils/request.server";

export const action: ActionFunction = async ({request, params}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    const formData = await request.formData();
    let jsonData:any = {};
    formData.forEach((value, key)=>jsonData[key] = value);
    return await requestWithToken(request)(API_OSS_FILE_DELETE +'?id='+url.searchParams.get('id'), deleteFormInit(JSON.stringify(jsonData)));
}