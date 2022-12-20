import {withPageLoading} from "~/utils/components";
import {Col, Nav, Row, Tab} from "react-bootstrap";
import UserProfileEditor from "~/pages/account/UserProfileEditor";
import ModifyPassword from "~/pages/account/ModifyPassword";
import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated, sessionStorage} from "~/utils/auth.server";
import _ from "lodash";
import querystring from "querystring";
import {DefaultListSearchParams, defaultRouteCatchBoundary, defaultRouteErrorBoundary} from "~/utils/utils";
import {API_APP_DETAIL, API_APP_SETTING_LIST, API_USER_INFO, requestWithToken} from "~/utils/request.server";

export const ErrorBoundary = defaultRouteErrorBoundary;
export const CatchBoundary = defaultRouteCatchBoundary;


export const loader: LoaderFunction = async ({request}) => {
    await requireAuthenticated(request);
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    const url = new URL(request.url);
    let queryString = '';
    if (_.isEmpty(url.search)) {
        queryString = '?' + querystring.stringify(DefaultListSearchParams);
    } else {
        queryString = '?' + url.searchParams.toString();
    }
    queryString+='&appid='+session.get("APPID");
    const settingsResult = await requestWithToken(request)(API_APP_SETTING_LIST+ queryString);
    const appDetailResult = await requestWithToken(request)(API_APP_DETAIL+queryString);
    return json({settings: settingsResult.result, app: appDetailResult.result});
}

const AppSettings = () => {
    return (
        <Tab.Container id={'account-settings-container'} defaultActiveKey={'user-profile'}>
            <Row>
                <Col sm={3}>
                    <Nav variant={'pills'} className={'flex-column'}>
                        <Nav.Item>
                            <Nav.Link eventKey={'user-profile'}>用户资料</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey={'user-password'}>修改密码</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col sm={9} className={'mt-1 mt-md-0'}>
                    <Tab.Content>
                        <Tab.Pane eventKey={'user-profile'}>
                            <UserProfileEditor />
                        </Tab.Pane>
                        <Tab.Pane eventKey={'user-password'}>
                            <ModifyPassword />
                        </Tab.Pane>
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    );
}

export default withPageLoading(AppSettings);