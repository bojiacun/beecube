import {ActionFunction} from "@remix-run/node";
import {API_APP_CHECK_SMS, API_APP_SEND_SMS, postFormInit, putFormInit, requestWithoutToken} from "~/utils/request.server";
import {formData2Json} from "~/utils/utils";

export const action: ActionFunction = async ({request}) => {
    const formData = await request.formData();
    return await requestWithoutToken(request)(API_APP_CHECK_SMS, putFormInit(formData2Json(formData)))
}