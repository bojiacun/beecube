import {json, LoaderFunction} from "@remix-run/node";
import SyntaxHighlighter from 'react-syntax-highlighter';
import _ from "lodash";
import querystring from "querystring";
import {DefaultListSearchParams, defaultRouteCatchBoundary, defaultRouteErrorBoundary} from "~/utils/utils";
import {useLoaderData} from "@remix-run/react";
import {Card} from "react-bootstrap";
import {withPageLoading} from "~/utils/components";
import {requireAuthenticated} from "~/utils/auth.server";


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
    // const result = await requestWithToken(request)(API_PERMISSION_CURRENT_USER);
    const result = await requireAuthenticated(request);
    return json(result);
}


const TestPage = () => {
    const data = useLoaderData();

    return (
        <Card>
            <Card.Body>
                <SyntaxHighlighter language={'json'} customStyle={{height: 500}}>
                    {JSON.stringify(data, null ,4)}
                </SyntaxHighlighter>
            </Card.Body>
        </Card>
    );
}

export default withPageLoading(TestPage);