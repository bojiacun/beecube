import {LoaderFunction} from "@remix-run/node";
import {requireAuthenticatedLoader} from "~/utils/auth.server";
import {withPageLoading} from "~/utils/components";


export const loader: LoaderFunction = requireAuthenticatedLoader;

export const DashboardPage = () => {
    return (
        <>
        </>
    );
}

export default withPageLoading(DashboardPage);