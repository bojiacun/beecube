import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_SYS_DICTS, requestWithToken} from "~/utils/request.server";

export const loader: LoaderFunction = async ({request}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    const result = await requestWithToken(request)(API_SYS_DICTS + '/' + url.searchParams.get("dictCode"));
    return json(result.result);
}