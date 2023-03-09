import {ActionFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_PAIMAI_PERFORMANCE_DELETE, API_PAIMAI_PERFORMANCE_GOODS_END, deleteFormInit, putFormInit, requestWithToken} from "~/utils/request.server";
import {formData2Json} from "~/utils/utils";

export const action: ActionFunction = async ({request, params}) => {
    await requireAuthenticated(request);
    const formData = await request.formData();
    return await requestWithToken(request)(API_PAIMAI_PERFORMANCE_GOODS_END, putFormInit(formData2Json(formData)));
}