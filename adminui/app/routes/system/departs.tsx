import {Col, Row} from "react-bootstrap";
import vueSelectStyleUrl from '~/styles/react/libs/vue-select.css';
import {json, LinksFunction, LoaderFunction} from "@remix-run/node";
import {API_SYSDEPART_QUERYTREELIST, requestWithToken} from "~/utils/request.server";
import {useFetcher, useLoaderData} from "@remix-run/react";
import {withPageLoading} from "~/utils/components";
import {useEffect, useState} from "react";
import {DefaultListSearchParams, defaultRouteCatchBoundary, defaultRouteErrorBoundary, FetcherState, getFetcherState,} from "~/utils/utils";
import _ from 'lodash';
import querystring from 'querystring';
import {requireAuthenticated} from "~/utils/auth.server";
import DepartTreeList from "~/pages/system/departs/DepartTreeList";
import DepartDetail from "~/pages/system/departs/DepartDetail";


export const links: LinksFunction = () => {
    return [{rel: 'stylesheet', href: vueSelectStyleUrl}];
}

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
    const result = await requestWithToken(request)(API_SYSDEPART_QUERYTREELIST + queryString);
    return json(result.result);
}





const DepartsPage = (props: any) => {
    const [selectedDepart, setSelectedDepart] = useState<any>();
    const [departments, setDepartments] = useState<any[]>(useLoaderData());
    const reloadFetcher = useFetcher();

    const reloadDepartments = () => {
        reloadFetcher.submit({}, {method: 'get'});
    }

    useEffect(()=>{
        if (getFetcherState(reloadFetcher) === FetcherState.DONE) {
            setDepartments(reloadFetcher.data);
        }
    }, [reloadFetcher.state]);

    return (
        <Row>
            <Col sm={12} md={6}>
                <DepartTreeList departments={departments} {...props} setSelectedDepart={setSelectedDepart} reloadDepartments={reloadDepartments} />
            </Col>
            {selectedDepart && <Col sm={12} md={6}>
                <DepartDetail selectedDepart={selectedDepart} departments={departments} reloadDepartments={reloadDepartments} />
            </Col>}
        </Row>
    );
}

export default withPageLoading(DepartsPage);