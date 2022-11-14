import { Col, Row } from "react-bootstrap";
import vueSelectStyleUrl from '~/styles/react/libs/vue-select.css';
import {json, LinksFunction, LoaderFunction} from "@remix-run/node";
import {API_ROLE_LIST, requestWithToken} from "~/utils/request.server";
import {useCatch} from "@remix-run/react";
import {withPageLoading} from "~/utils/components";
import {useState} from "react";
import {
    DefaultListSearchParams,
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


export const links: LinksFunction = () => {
    return [{rel: 'stylesheet', href: vueSelectStyleUrl}];
}

export function ErrorBoundary() {
    return <Error500Page/>
}

export function CatchBoundary() {
    const caught = useCatch();
    if (caught.status === 401) {
        return <Error401Page/>
    } else if (caught.status === 404) {
        return <Error404Page/>
    }
    return <Error500Page/>
}



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