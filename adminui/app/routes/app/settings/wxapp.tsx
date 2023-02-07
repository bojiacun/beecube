import WxappSettingsEditor from "~/pages/app/settings/WxappSettingsEditor";
import {withPageLoading} from "~/utils/components";
import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_APP_SETTING_LIST, requestWithToken} from "~/utils/request.server";
import {useLoaderData} from "@remix-run/react";


export const loader: LoaderFunction = async ({request}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    let queryString = '?' + url.searchParams.toString();
    const result = await requestWithToken(request)(API_APP_SETTING_LIST+ queryString);
    return json(result.result);
}

const AppSettingsWxapp= () => {
    const appSettings:any = useLoaderData();
    const settings:any = {};

    appSettings.filter((s:any) => s.groupKey === 'wxapp').forEach((s:any) => {
        settings[s.settingKey] = s.settingValue;
    });

    return (
        <WxappSettingsEditor settings={settings} />
    );
}

export default withPageLoading(AppSettingsWxapp);