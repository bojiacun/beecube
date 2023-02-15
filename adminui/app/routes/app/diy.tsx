import {defaultRouteCatchBoundary, defaultRouteErrorBoundary} from "~/utils/utils";
import {withPageLoading} from "~/utils/components";
import diyPageStyleUrl from 'app/styles/diy.css';
import diyModulePageStyleUrl from 'app/styles/diy.module.css';
import {LinksFunction} from "@remix-run/node";
import PageDesigner from "~/components/page-designer";

export const ErrorBoundary = defaultRouteErrorBoundary;
export const CatchBoundary = defaultRouteCatchBoundary;

export const links: LinksFunction = () => {
    return [
        {rel: 'stylesheet', href: diyPageStyleUrl},
        {rel: 'stylesheet', href: diyModulePageStyleUrl},
    ];
}


const DiyPage = (props:any) => {
    return (
        <PageDesigner />
    );
}

export default withPageLoading(DiyPage);