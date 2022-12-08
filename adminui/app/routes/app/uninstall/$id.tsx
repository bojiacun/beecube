import {ActionFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_APP_MODULE_INSTALL, API_APP_MODULE_UNINSTALL, putFormInit, requestWithToken} from "~/utils/request.server";
import {formData2Json} from "~/utils/utils";

export const action: ActionFunction = async ({request,params}) => {
    await requireAuthenticated(request);
    const formData = await request.formData();
    return await requestWithToken(request)(API_APP_MODULE_UNINSTALL+'/'+params.id, putFormInit(formData2Json(formData)))
}