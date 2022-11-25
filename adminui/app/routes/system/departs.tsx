import { Col, Row } from "react-bootstrap";
import vueSelectStyleUrl from '~/styles/react/libs/vue-select.css';
import {json, LinksFunction, LoaderFunction} from "@remix-run/node";
import {API_ROLE_LIST, API_SYSDEPART_QUERYTREELIST, API_USER_DEPARTMENT_LIST_ALL, requestWithToken} from "~/utils/request.server";
import {useCatch, useFetcher, useLoaderData} from "@remix-run/react";
import {withPageLoading} from "~/utils/components";
import {useEffect, useState} from "react";
import {
    DefaultListSearchParams, defaultRouteCatchBoundary, defaultRouteErrorBoundary, handleSaveResult,
} from "~/utils/utils";
import * as Yup from 'yup';
import _ from 'lodash';
import querystring from 'querystring';
import {requireAuthenticated} from "~/utils/auth.server";
import Error500Page from "~/components/error-page/500";
import Error401Page from "~/components/error-page/401";
import Error404Page from "~/components/error-page/404";
import RoleList from "~/pages/system/roles/RoleList";
import RoleUserList from "~/pages/system/roles/RoleUserList";
import {useOutletContext} from "react-router";
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
        if (reloadFetcher.type === 'done' && reloadFetcher.data) {
            setDepartments(reloadFetcher.data);
        }
    }, [reloadFetcher.state]);

    return (
        <Row>
            <Col>
                <DepartTreeList departments={departments} {...props} setSelectedDepart={setSelectedDepart} reloadDepartments={reloadDepartments} />
            </Col>
            {selectedDepart && <Col>
                <DepartDetail selectedDepart={selectedDepart} departments={departments} />
            </Col>}
        </Row>
    );
}

export default withPageLoading(DepartsPage);