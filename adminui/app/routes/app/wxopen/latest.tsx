import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {
    API_APP_PUBLISH_LATEST,
    API_APP_WXOPEN_AUTH_URL,
    requestWithToken
} from "~/utils/request.server";


export const loader: LoaderFunction = async ({request}) => {
    await requireAuthenticated(request);
    const result = await requestWithToken(request)(API_APP_PUBLISH_LATEST);
    return json(result.result);
}