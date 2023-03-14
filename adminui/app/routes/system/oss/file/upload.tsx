import {ActionFunction, json} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_OSS_FILE_UPLOAD, requestWithToken} from "~/utils/request.server";

export const action: ActionFunction = async ({request}) => {
    await requireAuthenticated(request);
    const formData = await request.formData();
    const data = new FormData();
    //@ts-ignore
    data.append("type", formData.get("type"));
    //@ts-ignore
    data.append('file', formData.get('file'));
    let result = await requestWithToken(request)(
        API_OSS_FILE_UPLOAD, {method: 'post', body: data}
    );
    console.log(result);
    return json({
        code: result.code,
        message: result.message,
        success: result.success,
        data: result.result?.url
    });
}