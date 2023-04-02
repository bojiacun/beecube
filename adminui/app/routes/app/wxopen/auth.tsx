import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import _ from "lodash";
import querystring from "querystring";
import {DefaultListSearchParams} from "~/utils/utils";
import {API_APP_WXOPEN_AUTH_CALLBACK, requestWithToken} from "~/utils/request.server";
import {withPageLoading} from "~/utils/components";
import {Link, useLoaderData} from "@remix-run/react";
import {Card} from "react-bootstrap";

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
    const result = await requestWithToken(request)(API_APP_WXOPEN_AUTH_CALLBACK+ queryString);
    return json(result.result);
}


const WxOpenAuthCallbackPage = (props:any) => {
    const data = useLoaderData();
    return (
        <Card>
            <Card.Body>
                {data &&
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: 400, height: 400}}>
                        <Link to={'/app/publish'} style={{color: '#3366CC'}}>恭喜您授权成功，点击链接继续发布应用</Link>
                    </div>
                }
                {!data &&
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: 400, height: 400}}>
                        <Link to={'/app/publish'} style={{color: 'red'}}>恭喜您授权成功，点击链接继续发布应用</Link>
                    </div>
                }
            </Card.Body>
        </Card>
    );
}

export default withPageLoading(WxOpenAuthCallbackPage);