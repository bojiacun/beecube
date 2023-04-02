import WxappSettingsEditor from "~/pages/app/settings/WxappSettingsEditor";
import {withPageLoading} from "~/utils/components";
import {ActionFunction, json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {
    API_APP_SETTING_LIST,
    API_APP_SETTINGS_UPDATE,
    API_APP_WXOPEN_SETTING_LIST,
    API_APP_WXOPEN_SETTINGS_UPDATE, API_APP_WXOPEN_UPLOAD_PREVIEW,
    postFormInit,
    requestWithToken
} from "~/utils/request.server";
import {useLoaderData} from "@remix-run/react";
import WxOpenSettingsEditor from "~/pages/app/settings/WxOpenSettingsEditor";
import {formData2Json} from "~/utils/utils";
export const action: ActionFunction = async ({request}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    const formData = await request.formData();
    const data = formData2Json(formData);
    return await requestWithToken(request)(API_APP_WXOPEN_UPLOAD_PREVIEW+'?'+url.searchParams.toString(), postFormInit(data));
}
