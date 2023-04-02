import {Card, Tabs, Tab} from "react-bootstrap";
import WxappUploadEntry from "~/pages/app/publish/WxappUploadEntry";
import {withPageLoading} from "~/utils/components";
import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated, sessionStorage} from "~/utils/auth.server";
import {API_APP_DETAIL, API_APP_PUBLISH_LATEST, API_APP_PUBLISH_NEW, API_APP_WXOPEN_AUTH_URL, requestWithToken} from "~/utils/request.server";
import {defaultRouteCatchBoundary, defaultRouteErrorBoundary} from "~/utils/utils";
import {useLoaderData} from "@remix-run/react";

export const ErrorBoundary = defaultRouteErrorBoundary;
export const CatchBoundary = defaultRouteCatchBoundary;

export const loader: LoaderFunction = async ({request}) => {
    await requireAuthenticated(request);
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    const response:any = {};
    const result = await requestWithToken(request)(API_APP_WXOPEN_AUTH_URL);
    const appResult = await requestWithToken(request)(API_APP_DETAIL+'?id='+session.get("APPID"));
    const appPublishResult = await requestWithToken(request)(API_APP_PUBLISH_LATEST);
    const newPublishResult = await requestWithToken(request)(API_APP_PUBLISH_NEW);
    response.authUrl = result.result;
    response.app = appResult.result;
    response.publish = appPublishResult.result;
    response.newPublish = newPublishResult.result;
    return json(response);
}

const AppPublisher = () => {
    const data = useLoaderData();

    return (
        <Card>
            <Card.Body>
                <div style={{width: 400, minHeight: 400, margin: '0 auto'}}>
                <Tabs as={'ul'} defaultActiveKey={'wxapp'} fill={false} justify={true}>
                    <Tab title={'微信小程序发布'} eventKey={'wxapp'} as={'li'}>
                        <WxappUploadEntry data={data} />
                    </Tab>
                </Tabs>
                </div>
            </Card.Body>
        </Card>
    );
}

export default withPageLoading(AppPublisher);