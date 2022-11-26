import {ActionFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_DEPARTMENT_ROLE_USERS_ADD, postFormInit, requestWithToken} from "~/utils/request.server";
import {formData2Json} from "~/utils/utils";

export const action: ActionFunction = async ({request}) => {
    await requireAuthenticated(request);
    const formData = await request.formData();
    return await requestWithToken(request)(API_DEPARTMENT_ROLE_USERS_ADD, postFormInit(formData2Json(formData)))
}