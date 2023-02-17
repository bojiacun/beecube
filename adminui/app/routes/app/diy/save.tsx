import {ActionFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_APP_DIY_PAGE_ADD, API_APP_DIY_PAGE_EDIT, postFormInit, requestWithToken} from "~/utils/request.server";

export const action: ActionFunction = async ({request}) => {
    await requireAuthenticated(request);
    const data = await request.json();
    if(data.id == 0) {
        return await requestWithToken(request)(API_APP_DIY_PAGE_ADD, postFormInit(data));
    }
    else {
        return await requestWithToken(request)(API_APP_DIY_PAGE_EDIT, postFormInit(data));
    }
}