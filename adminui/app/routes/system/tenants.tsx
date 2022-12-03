import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {API_TENANT_LIST, requestWithToken} from "~/utils/request.server";
import {defaultRouteCatchBoundary, defaultRouteErrorBoundary} from "~/utils/utils";
import TenantList from "~/pages/system/TenantList";

export const ErrorBoundary = defaultRouteErrorBoundary;
export const CatchBoundary = defaultRouteCatchBoundary;



export const loader: LoaderFunction = async ({request}) => {
    await requireAuthenticated(request);
    const result = await requestWithToken(request)(API_TENANT_LIST);
    return json(result.result);
}


const TenantsPage = (props:any) => {
    return <TenantList {...props} />;
}

export default TenantsPage;