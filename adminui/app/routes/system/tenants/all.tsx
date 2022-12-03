import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_TENANT_LIST_ALL, requestWithToken} from "~/utils/request.server";

export const loader: LoaderFunction = async ({request}) => {
    await requireAuthenticated(request);
    const result = await requestWithToken(request)(API_TENANT_LIST_ALL);
    return json(result.result);
}