import {
    Col,
    FormGroup,
    Card,
    InputGroup,
    Form,
    FormControl,
    FormLabel,
    Button, Row, Dropdown, Badge,
} from "react-bootstrap";
import vueSelectStyleUrl from '~/styles/react/libs/vue-select.css';
import {json, LinksFunction, LoaderFunction} from "@remix-run/node";
import {API_CRONJOB_LIST, API_DATALOG_LIST, API_GATEWAY_LIST, requestWithToken} from "~/utils/request.server";
import {useCatch, useFetcher, useLoaderData} from "@remix-run/react";
import {withPageLoading} from "~/utils/components";
import SinglePagination from "~/components/pagination/SinglePagination";
import {useContext, useEffect, useRef, useState} from "react";
import {DefaultListSearchParams, defaultRouteCatchBoundary, defaultRouteErrorBoundary, PageSizeOptions, showDeleteAlert} from "~/utils/utils";
import BootstrapTable from 'react-bootstrap-table-next';
import _ from 'lodash';
import querystring from 'querystring';
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import {requireAuthenticated} from "~/utils/auth.server";
import Error500Page from "~/components/error-page/500";
import Error401Page from "~/components/error-page/401";
import Error404Page from "~/components/error-page/404";
import {Delete, Edit, MoreVertical, Plus} from "react-feather";
import CronEdit from "~/pages/monitor/crons/CronEdit";
import GatewayEdit from "~/pages/system/gateway/GatewayEdit";

export const links: LinksFunction = () => {
    return [{rel: 'stylesheet', href: vueSelectStyleUrl}];
}

export const ErrorBoundary = defaultRouteErrorBoundary;

export const CatchBoundary = defaultRouteCatchBoundary;


export const loader: LoaderFunction = async ({request}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    let queryString = '';
    if (_.isEmpty(url.search)) {
        queryString = '?' + querystring.stringify(DefaultListSearchParams);
    } else {
        queryString = '?' + url.searchParams.toString();
    }
    const result = await requestWithToken(request)(API_GATEWAY_LIST + queryString);
    return json(result.result);
}


const GatewayPages = () => {
    const [list, setList] = useState<any>(useLoaderData());
    const [editModel, setEditModel] = useState<any>();
    const [searchState, setSearchState] = useState<any>(DefaultListSearchParams);
    const searchFetcher = useFetcher();

    useEffect(() => {
        if (searchFetcher.data) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);


    const loadData = () => {
        searchFetcher.submit(searchState);
    }

    const handlePageChanged = (e: any) => {
        searchState.pageNo = e.selected + 1;
        setSearchState({...searchState});
        searchFetcher.submit(searchState, {method: 'get'});
    }
    const handlePageSizeChanged = (newValue: any) => {
        searchState.pageSize = parseInt(newValue.value);
        setSearchState({...searchState});
        searchFetcher.submit(searchState, {method: 'get'});
    }
    const handleOnAction = (row: any, e: any) => {
        switch (e) {
            case 'edit':
                //编辑
                setEditModel(row);
                break;
            case 'delete':
                //删除按钮
                showDeleteAlert(function () {
                });
                break;
        }
    }
    const columns: any[] = [
        {
            text: '路由ID',
            dataField: 'routerId',
            classes: 'text-cut',
            headerStyle: {width: 400}
        },
        {
            text: '路由名称',
            dataField: 'name',
            classes: 'text-cut',
            headerStyle: {width: 200}
        },
        {
            text: '路由URI',
            dataField: 'uri',
            classes: 'text-cut'
        },
        {
            text: '状态',
            dataField: 'status_dictText',
            headerStyle: {width: 100},
            formatter: (cell: number, row: any) => {
                return row.status === 1 ? <Badge variant={'success'}>正常</Badge> :
                    <Badge variant={'danger'}>异常</Badge>;
            }
        },
        {
            text: '操作',
            dataField: 'operation',
            isDummyField: true,
            headerStyle: {width: 180},
            formatter: (cell: any, row: any) => {
                return (
                    <div className={'d-flex align-items-center'}>
                        <a href={'#'} onClick={() => handleOnAction(row, 'edit')}>编辑</a>
                        <span className={'divider'}/>
                        <a href={'#'} onClick={() => handleOnAction(row, 'delete')}>删除</a>
                    </div>
                );
            }
        },
    ]

    const handleOnAdd = () => {
        setEditModel({status: 0});
    }

    return (
        <>
            <Card>
                <div className={'m-2'}>
                    <Row>
                        <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                            <h4 className="mb-0">网关路由</h4>
                            <ReactSelectThemed
                                placeholder={'分页大小'}
                                isSearchable={false}
                                defaultValue={PageSizeOptions[0]}
                                options={PageSizeOptions}
                                className={'per-page-selector d-inline-block ml-50 mr-1'}
                                onChange={handlePageSizeChanged}
                            />
                            <Button className={'mr-1'} onClick={handleOnAdd}><Plus size={14} /> 新建</Button>
                        </Col>
                        <Col md={6} className={'d-flex align-items-center justify-content-end'}>
                        </Col>
                    </Row>
                </div>
                <BootstrapTable classes={'table-layout-fixed position-relative b-table'} striped hover columns={columns} bootstrap4
                                data={list||[]} keyField={'id'}/>
            </Card>
            {editModel && <GatewayEdit model={editModel} onHide={()=>{
                setEditModel(null);
                loadData();
            }} />}
        </>
    );
}

export default withPageLoading(GatewayPages);