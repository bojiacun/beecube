import {LoaderFunction} from "@remix-run/node";
import {requireAuthenticatedLoader} from "~/utils/auth.server";
import {withAutoLoading} from "~/utils/components";


export const loader: LoaderFunction = requireAuthenticatedLoader;

export const DashboardPage = () => {
    return (<>默认仪表盘页面</>);
}

export default withAutoLoading(DashboardPage);