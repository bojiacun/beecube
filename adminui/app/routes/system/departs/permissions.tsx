import {ActionFunction, json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {
    API_DEPARTMENT_PERMISSIONS,
    API_DEPARTMENT_PERMISSIONS_SAVE,
    postFormInit,
    requestWithToken
} from "~/utils/request.server";
import {formData2Json} from "~/utils/utils";

export const loader: LoaderFunction = async ({request}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    let queryString = '?' + url.searchParams.toString();
    const result = await requestWithToken(request)(API_DEPARTMENT_PERMISSIONS + queryString);
    return json(result.result);
}

export const action: ActionFunction = async ({request}) => {
    await requireAuthenticated(request);
    const formData = await request.formData();
    return await requestWithToken(request)(API_DEPARTMENT_PERMISSIONS_SAVE, postFormInit(formData2Json(formData)))
}