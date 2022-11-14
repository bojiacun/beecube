import {
    Col,
    FormGroup,
    Card,
    InputGroup,
    Form,
    FormControl,
    FormLabel,
    Button, Row, Dropdown, Modal, Badge,
} from "react-bootstrap";
import vueSelectStyleUrl from '~/styles/react/libs/vue-select.css';
import {json, LinksFunction, LoaderFunction} from "@remix-run/node";
import {API_ROLE_LIST, requestWithToken} from "~/utils/request.server";
import {Link, useCatch, useFetcher, useLoaderData} from "@remix-run/react";
import {withPageLoading} from "~/utils/components";
import SinglePagination from "~/components/pagination/SinglePagination";
import {useEffect, useState} from "react";
import {
    DefaultListSearchParams, defaultSelectRowConfig,
    emptySortFunc,
    headerSortingClasses,
    PageSizeOptions,
    showDeleteAlert,
    showToastError,
    showToastSuccess
} from "~/utils/utils";
import BootstrapTable from 'react-bootstrap-table-next';
import * as Yup from 'yup';
import _ from 'lodash';
import querystring from 'querystring';
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import {Delete, Edit, MoreVertical, Plus, Shield, XCircle} from "react-feather";
import {AwesomeButton} from "react-awesome-button";
import {Formik, Form as FormikForm, Field} from "formik";
import classNames from "classnames";
import {requireAuthenticated} from "~/utils/auth.server";
import Error500Page from "~/components/error-page/500";
import Error401Page from "~/components/error-page/401";
import Error404Page from "~/components/error-page/404";
import UserListSelector from "~/pages/system/roles/RoleUserList";


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

const EditRoleSchema = Yup.object().shape({
    roleCode: Yup.string().required(),
    roleName: Yup.string().required()
});

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
                <SystemRolesPage {...props} setSelectedRole={setSelectedRole}/>
            </Col>
            {selectedRole && <Col>
                <NestedUsersPage {...props} setSelectedRole={setSelectedRole} selectedRole={selectedRole}/>
            </Col>}
        </Row>
    );
}

export default withPageLoading(MainSystemRolesPage);