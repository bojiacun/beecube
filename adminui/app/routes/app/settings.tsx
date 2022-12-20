import {withPageLoading} from "~/utils/components";
import {Col, Nav, Row, Tab} from "react-bootstrap";
import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated, sessionStorage} from "~/utils/auth.server";
import _ from "lodash";
import querystring from "querystring";
import {DefaultListSearchParams, defaultRouteCatchBoundary, defaultRouteErrorBoundary} from "~/utils/utils";
import {API_APP_DETAIL, API_APP_MODULE_DETAIL, API_APP_SETTING_LIST, API_USER_INFO, requestWithToken} from "~/utils/request.server";
import {useLoaderData} from "@remix-run/react";
import WechatSettingsEditor from "~/pages/app/settings/WechatSettingsEditor";
import WxappSettingsEditor from "~/pages/app/settings/WxappSettingsEditor";

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
    const settingsResult = await requestWithToken(request)(API_APP_SETTING_LIST+ queryString);
    const appDetailResult = await requestWithToken(request)(API_APP_DETAIL+'?id='+session.get("APPID"));
    const appModuleResult = await requestWithToken(request)(API_APP_MODULE_DETAIL + '?id='+appDetailResult.result.moduleId);
    return json({settings: settingsResult.result||[], app: appDetailResult.result, module: appModuleResult.result});
}

const AppSettings = () => {
    const {module} = useLoaderData() || {};

    if(!module) return <></>

    return (
        <Tab.Container id={'account-settings-container'} defaultActiveKey={'wechat'}>
            <Row>
                <Col sm={2}>
                    <Nav variant={'pills'} className={'flex-column'}>
                        {module?.supportH5 &&
                            <Nav.Item>
                                <Nav.Link eventKey={'wechat'}>公众号</Nav.Link>
                            </Nav.Item>
                        }
                        {module?.supportWechat &&
                            <Nav.Item>
                                <Nav.Link eventKey={'wxapp'}>微信小程序</Nav.Link>
                            </Nav.Item>
                        }
                    </Nav>
                </Col>
                <Col sm={10} className={'mt-1 mt-md-0'}>
                    <Tab.Content>
                        <Tab.Pane eventKey={'wechat'}>
                            <WechatSettingsEditor />
                        </Tab.Pane>
                        <Tab.Pane eventKey={'wxapp'}>
                            <WxappSettingsEditor />
                        </Tab.Pane>
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    );
}

export default withPageLoading(AppSettings);