import {ActionFunction, json} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_ROLE_EDIT, putFormInit} from "~/utils/request.server";


export const action: ActionFunction = async ({request}) => {
    await requireAuthenticated(request);
    const formData = await request.formData();
    const res = await fetch(API_ROLE_EDIT, putFormInit(formData))
    const result:any = res.json();
    console.log(result);
    return json(result.result);
}