import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import _ from "lodash";
import querystring from "querystring";
import {DefaultListSearchParams, defaultRouteCatchBoundary, defaultRouteErrorBoundary} from "~/utils/utils";
import {API_DEMO_TEST_JEECG_LIST, requestWithToken} from "~/utils/request.server";
import {useLoaderData} from "@remix-run/react";
import {Card} from "react-bootstrap";
import {withPageLoading} from "~/utils/components";


export const ErrorBoundary = defaultRouteErrorBoundary;
export const CatchBoundary = defaultRouteCatchBoundary;



export const loader: LoaderFunction = async ({request}) => {
    const url = new URL(request.url);
    let queryString = '';
    if (_.isEmpty(url.search)) {
        queryString = '?' + querystring.stringify(DefaultListSearchParams);
    } else {
        queryString = '?' + url.searchParams.toString();
    }
    const result = await requestWithToken(request)(API_DEMO_TEST_JEECG_LIST + queryString);
    console.log(result);
    return json(result.result);
}


const TestPage = () => {
    const data = useLoaderData();

    return (
        <Card>
            <Card.Body>
                {JSON.stringify(data)}
            </Card.Body>
        </Card>
    );
}

export default withPageLoading(TestPage);