import {ActionFunction, json} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_ROLE_EDIT, putFormInit, requestWithToken} from "~/utils/request.server";


export const action: ActionFunction = async ({request}) => {
    await requireAuthenticated(request);
    const formData = await request.formData();
    let jsonData:any = {};
    formData.forEach((value, key)=>jsonData[key] = value);
    throw new Response('测试错误哦', {status: 500});
    return await requestWithToken(request)(API_ROLE_EDIT, putFormInit(JSON.stringify(jsonData)))
}

export function ErrorBoundary() {
    return <></>
}