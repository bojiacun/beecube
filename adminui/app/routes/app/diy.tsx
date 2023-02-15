import {defaultRouteCatchBoundary, defaultRouteErrorBoundary} from "~/utils/utils";
import {withPageLoading} from "~/utils/components";
import diyPageStyleUrl from 'app/styles/diy.css';
import {LinksFunction} from "@remix-run/node";
import PageDesigner from "~/components/page-designer";
import { useState } from "react";

export const ErrorBoundary = defaultRouteErrorBoundary;
export const CatchBoundary = defaultRouteCatchBoundary;

export const links: LinksFunction = () => {
    return [
        {rel: 'stylesheet', href: diyPageStyleUrl},
    ];
}


const DiyPage = (props:any) => {
    const [pages, setPages] = useState<any>([]);

    return (
        <PageDesigner pages={pages} lockPage={true} />
    );
}

export default withPageLoading(DiyPage);