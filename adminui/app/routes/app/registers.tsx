import {DefaultListSearchParams, defaultRouteCatchBoundary, defaultRouteErrorBoundary} from "~/utils/utils";
import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
// @ts-ignore
import _ from "lodash";
import querystring from "querystring";
import {API_APP_REGISTER_LIST, requestWithToken} from "~/utils/request.server";
import {withPageLoading} from "~/utils/components";
import AppRegisterList from "~/pages/app/AppRegisterList";

export const ErrorBoundary = defaultRouteErrorBoundary;
export const CatchBoundary = defaultRouteCatchBoundary;


export const loader: LoaderFunction = async ({request}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    let queryString = '';
    if (_.isEmpty(url.search)) {
        queryString = '?' + querystring.stringify(DefaultListSearchParams);
    } else {
        queryString = '?' + url.searchParams.toString();
    }
    const result = await requestWithToken(request)(API_APP_REGISTER_LIST + queryString);
    return json(result.result);
}

const AppRegisterListPage = (props: any) => {
    return (
        <AppRegisterList {...props}  />
    );
}

export default withPageLoading(AppRegisterListPage);