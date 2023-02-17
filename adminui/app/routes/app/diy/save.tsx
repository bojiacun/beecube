import {ActionFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_APP_DIY_PAGE_ADD, API_APP_DIY_PAGE_EDIT, postFormInit, requestWithToken} from "~/utils/request.server";

export const action: ActionFunction = async ({request}) => {
    await requireAuthenticated(request);
    const data = await request.json();
    data.modules = JSON.stringify(data.modules);
    data.styles = JSON.stringify(data.styles);
    data.controls = JSON.stringify(data.controls);
    console.log(data);
    if(data.id == '') {
        return await requestWithToken(request)(API_APP_DIY_PAGE_ADD, postFormInit(data));
    }
    else {
        return await requestWithToken(request)(API_APP_DIY_PAGE_EDIT, postFormInit(data));
    }
}