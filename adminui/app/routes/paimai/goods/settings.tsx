import WechatSettingsEditor from "~/pages/app/settings/WechatSettingsEditor";
import {withPageLoading} from "~/utils/components";
import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_APP_SETTING_LIST, API_PAIMAI_SETTING_LIST, requestWithToken} from "~/utils/request.server";
import {useLoaderData} from "@remix-run/react";


export const loader: LoaderFunction = async ({request}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    let queryString = '?' + url.searchParams.toString();
    const result = await requestWithToken(request)(API_PAIMAI_SETTING_LIST + queryString);
    return json(result.result);
}


const GoodsSettings = () => {
    const paimaiSettings :any = useLoaderData();
    const settings:any = {};

    paimaiSettings?.forEach((s:any) => {
        settings[s.descKey] = s.descValue;
    });

    return (
        <WechatSettingsEditor settings={settings} />
    );
}

export default withPageLoading(GoodsSettings);