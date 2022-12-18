import {DefaultListSearchParams, defaultRouteCatchBoundary, defaultRouteErrorBoundary} from "~/utils/utils";
import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import _ from "lodash";
import querystring from "querystring";
import {API_APP_LIST, API_APP_MODULE_LIST, requestWithToken} from "~/utils/request.server";
import {withPageLoading} from "~/utils/components";
import AppList from "~/pages/app/AppList";
import {useState} from "react";
import {Row, Col} from "react-bootstrap";
import AppUserList from "~/pages/app/AppUserList";

export const ErrorBoundary = defaultRouteErrorBoundary;
export const CatchBoundary = defaultRouteCatchBoundary;


export const loader: LoaderFunction = async ({request}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    let queryString = '';
    if (_.isEmpty(url.search)) {
        queryString = '?' + querystring.stringify(DefaultListSearchParams);
    }
    else {
        queryString = '?' + url.searchParams.toString();
    }
    const result = await requestWithToken(request)(API_APP_LIST + queryString);
    return json(result.result);
}

const AppListPage = (props:any) => {
    const [selectedApp, setSelectedApp] = useState<any>();
    return (
        <Row>
            <Col md={selectedApp ? 7 : 12}>
                <AppList {...props} setSelectedApp={setSelectedApp} />
            </Col>
            {selectedApp && <Col md={5}>
                <AppUserList {...props} selectedApp={selectedApp} setSelectedApp={setSelectedApp} />
            </Col>}
        </Row>
    );
}

export default withPageLoading(AppListPage);