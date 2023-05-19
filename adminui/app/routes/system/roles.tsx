import { Col, Row } from "react-bootstrap";
import vueSelectStyleUrl from '~/styles/vue-select.css';
import {json, LinksFunction, LoaderFunction} from "@remix-run/node";
import {API_ROLE_LIST, requestWithToken} from "~/utils/request.server";
import {withPageLoading} from "~/utils/components";
import {useEffect, useState} from "react";
import {
    DefaultListSearchParams, defaultRouteCatchBoundary, defaultRouteErrorBoundary,
} from "~/utils/utils";
import _ from 'lodash';
import querystring from 'querystring';
import {requireAuthenticated} from "~/utils/auth.server";
import RoleList from "~/pages/system/roles/RoleList";
import RoleUserList from "~/pages/system/roles/RoleUserList";


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
    const result = await requestWithToken(request)(API_ROLE_LIST + queryString);
    return json(result.result);
}





const MainSystemRolesPage = (props: any) => {
    const [selectedRole, setSelectedRole] = useState<any>();

    return (
        <Row>
            <Col>
                <RoleList {...props} setSelectedRole={setSelectedRole}/>
            </Col>
            {selectedRole && <Col>
                <RoleUserList {...props} setSelectedRole={setSelectedRole} selectedRole={selectedRole}/>
            </Col>}
        </Row>
    );
}

export default withPageLoading(MainSystemRolesPage);