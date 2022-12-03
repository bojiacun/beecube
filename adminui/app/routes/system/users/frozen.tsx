import {ActionFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {
    API_USER_CHANGE_PASSWORD,
    API_USER_EDIT,
    API_USER_FROZEN,
    API_USER_UPDATE_PASSWORD,
    postFormInit,
    putFormInit,
    requestWithToken
} from "~/utils/request.server";
import {formData2Json} from "~/utils/utils";

export const action: ActionFunction = async ({request}) => {
    await requireAuthenticated(request);
    const formData = await request.formData();
    return await requestWithToken(request)(API_USER_FROZEN, putFormInit(formData2Json(formData)))
}