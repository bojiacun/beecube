import WxappSettingsEditor from "~/pages/app/settings/WxappSettingsEditor";
import {withPageLoading} from "~/utils/components";
import {ActionFunction, json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {
    API_APP_SETTING_LIST,
    API_APP_SETTINGS_UPDATE, API_APP_TENCENT_SETTING_LIST, API_APP_TENCENT_SETTINGS_UPDATE,
    API_APP_WXOPEN_SETTING_LIST,
    API_APP_WXOPEN_SETTINGS_UPDATE,
    postFormInit,
    requestWithToken
} from "~/utils/request.server";
import {useLoaderData} from "@remix-run/react";
import WxOpenSettingsEditor from "~/pages/app/settings/WxOpenSettingsEditor";
import {formData2Json} from "~/utils/utils";
import TencentCloudSettingsEditor from "~/pages/app/settings/TencentCloudSettingsEditor";


export const loader: LoaderFunction = async ({request}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    let queryString = '?' + url.searchParams.toString();
    const result = await requestWithToken(request)(API_APP_TENCENT_SETTING_LIST+ queryString);
    return json(result.result);
}
export const action: ActionFunction = async ({request}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    const formData = await request.formData();
    const data = formData2Json(formData);
    return await requestWithToken(request)(API_APP_TENCENT_SETTINGS_UPDATE+'?'+url.searchParams.toString(), postFormInit(data));
}

const TencentCloudConfigPage = () => {
    const appSettings:any = useLoaderData();
    const settings:any = {};

    appSettings?.forEach((s:any) => {
        settings[s.settingKey] = s.settingValue;
    });

    return (
        <TencentCloudSettingsEditor settings={settings} />
    );
}

export default withPageLoading(TencentCloudConfigPage);