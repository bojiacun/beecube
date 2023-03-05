import {LinkItem} from "~/components/form/BootstrapLinkSelector";
import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated, sessionStorage} from "~/utils/auth.server";
import {API_APP_LINKS, requestWithToken} from "~/utils/request.server";


export const loader: LoaderFunction = async ({request}) => {
    await requireAuthenticated(request);
    const session = await sessionStorage.getSession(request.headers.get('Cookie'));
    const appId = session.get("APPID");
    const url = new URL(request.url);
    url.searchParams.set("id", appId);
    let queryString = '?' + url.searchParams.toString();
    const result = await requestWithToken(request)(API_APP_LINKS + queryString);
    return json(result.result);
}