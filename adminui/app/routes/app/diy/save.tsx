import {ActionFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_APP_DIY_PAGE_ADD, API_APP_DIY_PAGE_EDIT, postFormInit, putFormInit, requestWithToken} from "~/utils/request.server";

export const action: ActionFunction = async ({request}) => {
    await requireAuthenticated(request);
    const data = await request.json();
    data.modules = JSON.stringify(data.modules);
    data.styles = JSON.stringify(data.style);
    data.controls = JSON.stringify(data.controls);
    delete data.canDelete;
    delete data.style;
    if(!data.id) {
        return await requestWithToken(request)(API_APP_DIY_PAGE_ADD, postFormInit(JSON.stringify(data)));
    }
    else {
        return await requestWithToken(request)(API_APP_DIY_PAGE_EDIT, postFormInit(JSON.stringify(data)));
    }
}