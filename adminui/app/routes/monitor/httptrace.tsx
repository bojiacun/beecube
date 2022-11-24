import {
    Col,
    FormGroup,
    Card,
    InputGroup,
    Form,
    FormControl,
    FormLabel,
    Button, Row, Badge,
} from "react-bootstrap";
import vueSelectStyleUrl from '~/styles/react/libs/vue-select.css';
import {json, LinksFunction, LoaderFunction} from "@remix-run/node";
import {API_HTTPTRACE_LIST, requestWithToken} from "~/utils/request.server";
import {useCatch, useFetcher, useLoaderData} from "@remix-run/react";
import {withPageLoading} from "~/utils/components";
import SinglePagination from "~/components/pagination/SinglePagination";
import {useContext, useEffect, useRef, useState} from "react";
import {DefaultListSearchParams, defaultRouteCatchBoundary, defaultRouteErrorBoundary, PageSizeOptions} from "~/utils/utils";
import BootstrapTable from 'react-bootstrap-table-next';
import _ from 'lodash';
import querystring from 'querystring';
//@ts-ignore
import sha256 from 'crypto-js/sha256';
import {requireAuthenticated} from "~/utils/auth.server";
import moment from "moment";
import {RefreshCw} from "react-feather";

export const links: LinksFunction = () => {
    return [{rel: 'stylesheet', href: vueSelectStyleUrl}];
}

export const ErrorBoundary = defaultRouteErrorBoundary;

export const CatchBoundary = defaultRouteCatchBoundary;



const RequestMethodTags = {
    GET: <Badge variant={'success'}>GET</Badge>,
    POST: <Badge variant={'primary'}>POST</Badge>,
    PUT: <Badge variant={'warning'}>PUT</Badge>,
    DELETE: <Badge variant={'danger'}>DELETE</Badge>,
};


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
    const result = await requestWithToken(request)(API_HTTPTRACE_LIST+ queryString);
    result.traces.forEach((item:any, index:number)=>{
        item.id = sha256(item.request.uri + index).toString();
    });
    return json(result.traces);
}


const HttpTracePage = () => {
    const result = useLoaderData();
    const [list, setList] = useState<any>({
        pageNo: 1,
        total: 100,
        current: 1,
        pages: 100/10,
        size: 10,
        records: result
    });
    const [searchState, setSearchState] = useState<any>(DefaultListSearchParams);
    const searchFetcher = useFetcher();

    useEffect(() => {
        if (searchFetcher.data) {
            setList({...list, records: searchFetcher.data});
        }
    }, [searchFetcher.state]);

    const refresh = () => {
        searchFetcher.submit(searchState);
    }


    const columns: any[] = [
        {
            text: '请求时间',
            dataField: 'timestamp',
            headerStyle: {width: 200},
            formatter: (cell:any, row:any)=>{
                return moment(row.timestamp).format('YYYY-MM-DD HH:mm');
            }
        },
        {
            text: '请求方法',
            dataField: 'request',
            headerStyle: {width: 120},
            formatter: (cell:any, row:any)=>{
                //@ts-ignore
                return RequestMethodTags[row.request.method];
            }
        },
        {
            text: '请求URL',
            dataField: 'request',
            classes: 'text-cut',
            formatter: (cell:any, row:any)=>{
                return row.request.uri;
            }
        },
        {
            text: '响应状态',
            dataField: 'response',
            headerStyle: {width: 120},
            formatter: (cell:any, row:any)=>{
                return row.response.status === 200 ? <Badge variant={'success'}>200</Badge> : <Badge variant={'danger'}>{row.response.status}</Badge>
            }
        },
        {
            text: '请求耗时',
            dataField: 'timeTaken',
            headerStyle: {width: 130},
            formatter: (cell:any, row:any)=>{
                return row.timeTaken > 1000 ? <Badge variant={'danger'}>{row.timeTaken}ms</Badge> : <Badge variant={'success'}>{row.timeTaken}ms</Badge>
            }
        },
    ]

    return (
        <Card>
            <div className={'m-2'}>
               <Row>
                   <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                       <h4 className="mb-0">请求追踪</h4>
                   </Col>
                   <Col md={6} className={'d-flex justify-content-end'}>
                       <Button onClick={refresh}><RefreshCw size={14} style={{marginRight: 5}} />刷新</Button>
                   </Col>
               </Row>
            </div>
            <BootstrapTable classes={'table-layout-fixed position-relative b-table'} striped hover columns={columns} bootstrap4 data={list?.records} keyField={'id'} />
        </Card>
    );
}

export default withPageLoading(HttpTracePage);