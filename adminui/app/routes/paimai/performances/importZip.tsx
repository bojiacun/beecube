import {ActionFunction, json} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_OSS_FILE_UPLOAD, API_PAIMAI_PERFORMANCE_IMPORTZIP, requestWithToken} from "~/utils/request.server";

export const action: ActionFunction = async ({request}) => {
    await requireAuthenticated(request);
    const formData = await request.formData();
    const data = new FormData();
    //@ts-ignore
    data.append("type", formData.get("type"));
    //@ts-ignore
    data.append("performanceId", formData.get("performanceId"));
    //@ts-ignore
    data.append('file', formData.get('file'));
    return await requestWithToken(request)(
        API_PAIMAI_PERFORMANCE_IMPORTZIP, {method: 'post', body: data}
    );
}
