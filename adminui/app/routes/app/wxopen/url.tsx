import WxappSettingsEditor from "~/pages/app/settings/WxappSettingsEditor";
import {withPageLoading} from "~/utils/components";
import {ActionFunction, json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {
    API_APP_SETTING_LIST,
    API_APP_SETTINGS_UPDATE, API_APP_WXOPEN_AUTH_URL,
    API_APP_WXOPEN_SETTING_LIST,
    API_APP_WXOPEN_SETTINGS_UPDATE,
    postFormInit,
    requestWithToken
} from "~/utils/request.server";


export const loader: LoaderFunction = async ({request}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    let queryString = '?' + url.searchParams.toString();
    const result = await requestWithToken(request)(API_APP_WXOPEN_AUTH_URL);
    return json(result.result);
}