import {
    Col,
    FormGroup,
    Card,
    InputGroup,
    Form,
    FormControl,
    FormLabel,
    Button, Row, Tabs, Tab,
} from "react-bootstrap";
import vueSelectStyleUrl from '~/styles/react/libs/vue-select.css';
import {json, LinksFunction, LoaderFunction} from "@remix-run/node";
import {API_DATALOG_LIST, API_LOG_LIST, requestWithToken} from "~/utils/request.server";
import {useFetcher, useLoaderData} from "@remix-run/react";
import {withAutoLoading} from "~/utils/components";
import SinglePagination from "~/components/pagination/SinglePagination";
import {useEffect, useState} from "react";
import {DefaultListSearchParams, defaultTableExpandRow, emptySortFunc, headerSortingClasses, PageSizeOptions} from "~/utils/utils";
import BootstrapTable from 'react-bootstrap-table-next';
//@ts-ignore
import _ from 'lodash';
import querystring from 'querystring';
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import {MinusSquare, PlusSquare} from "react-feather";
import DateTimeRangePicker from "~/components/date-time-range-picker/DateTimeRangePicker";
import {requireAuthenticated} from "~/utils/auth.server";

export const links: LinksFunction = () => {
    return [{rel: 'stylesheet', href: vueSelectStyleUrl}];
}

DefaultListSearchParams.logType = 1;

export const loader: LoaderFunction = async ({request}) => {
    await requireAuthenticated(request);
    const url = new URL(request.url);
    let queryString = '';
    if (_.isEmpty(url.search)) {
        queryString = '?' + querystring.stringify(DefaultListSearchParams);
    }
    else {
        //转化时间段搜索
        const dates = url.searchParams.get('dates');
        if(dates) {
            url.searchParams.set('createTime_begin', _.replace(dates.split('-')[0],/\//g,'-'));
            url.searchParams.set('createTime_end', _.replace(dates.split('-')[1], /\//g,'-'));
            url.searchParams.delete('dates');
        }
        queryString = '?' + url.searchParams.toString();
    }


    const result = await requestWithToken(request)(API_LOG_LIST + queryString);
    return json(result.result);
}


const OperationLogPage = () => {
    const [list, setList] = useState<any>();
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams, logType: 2});
    const searchFetcher = useFetcher();

    useEffect(() => {
        if (searchFetcher.data) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);

    useEffect(() => {
        searchFetcher.submit(searchState, {method: 'get'});
    }, []);


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
    const handleSort = (field: any, order: any): void => {
        searchState.column = field;
        searchState.order = order;
        setSearchState({...searchState});
        searchFetcher.submit(searchState, {method: 'get'});
    }
    const columns: any[] = [
        {
            text: '日志内容',
            dataField: 'logContent',
        },
        {
            text: '操作人ID',
            dataField: 'userid',
            headerStyle: {width: 150}
        },
        {
            text: '操作人',
            dataField: 'username',
            headerStyle: {width: 150}
        },
        {
            text: 'IP',
            dataField: 'ip',
            headerStyle: {width: 170}
        },
        {
            text: '耗时',
            dataField: 'costTime',
            headerStyle: {width: 170}
        },
        {
            text: '创建时间',
            dataField: 'createTime',
            headerStyle: {width: 200},
            sort: true,
            headerSortingClasses,
            sortFunc: emptySortFunc,
            onSort: handleSort
        },
        {
            text: '操作类型',
            dataField: 'operateType_dictText',
            headerStyle: {width: 170}
        },
    ]
    const expandRow = {
        ...defaultTableExpandRow,
        renderer: (row:any) => {
            return (
                <>
                <div>请求方法：{row.method}</div>
                <div>请求参数：{row.requestParam}</div>
                </>
            );
        },
    }

    const handleKeywordChanged = (e:any) => {
        setSearchState({...searchState, keyWord: e.target.value});
    }
    const handleOnDateChanged = (date:any) => {
        setSearchState({...searchState, dates: date});
    }
    const handleOnSearchSubmit = () => {
        //设置分页为1
        setSearchState({...searchState, pageNo: 1});
    }

    if(!list) return <></>;

    return (
        <>
            <div className={'m-2'}>
                <Row>
                    <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                        <h4 className="mb-0">操作日志</h4>
                        <ReactSelectThemed
                            placeholder={'分页大小'}
                            isSearchable={false}
                            defaultValue={PageSizeOptions[0]}
                            options={PageSizeOptions}
                            className={'per-page-selector d-inline-block ml-50 mr-1'}
                            onChange={handlePageSizeChanged}
                        />
                    </Col>
                    <Col md={6} className={'d-flex align-items-center justify-content-end'}>
                        <searchFetcher.Form className={'form-inline justify-content-end'} onSubmit={handleOnSearchSubmit}>
                            <FormControl name={'pageNo'} value={1} type={'hidden'}/>
                            <FormControl name={'logType'} value={searchState.logType} type={'hidden'}/>
                            <FormControl name={'column'} value={searchState.column} type={'hidden'}/>
                            <FormControl name={'order'} value={searchState.order} type={'hidden'}/>
                            <FormControl name={'pageSize'} value={searchState.pageSize} type={'hidden'}/>

                            <FormGroup as={Form.Row} className={'mb-0 mr-2'}>
                                <FormLabel htmlFor={'dataTable'}>时间段搜索</FormLabel>
                                <Col>
                                    <DateTimeRangePicker inputName={'dates'} onChange={handleOnDateChanged} />
                                </Col>
                            </FormGroup>

                            <FormGroup as={Form.Row} className={'mb-0'}>
                                <FormLabel htmlFor={'keyWord'}>搜索日志</FormLabel>
                                <Col>
                                    <InputGroup>
                                        <FormControl onChange={handleKeywordChanged} name={'keyWord'} placeholder={'请输入要搜索的内容'}/>
                                        <InputGroup.Append>
                                            <Button type={'submit'}>搜索</Button>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </Col>
                            </FormGroup>
                        </searchFetcher.Form>
                    </Col>
                </Row>
            </div>

            {list?.records && <BootstrapTable
                classes={'table-layout-fixed position-relative b-table'}
                striped hover columns={columns} bootstrap4
                expandRow={expandRow}
                data={list?.records} keyField={'id'}
            />}


            <div className={'mx-2 mb-2 mt-1'}>
                <Row>
                    <Col sm={6} className={'d-flex align-items-center justify-content-center justify-content-sm-start'}>
                        <span
                            className="text-muted">共 {list?.total} 条记录 显示 {(list?.current - 1) * list?.size + 1} 至 {list?.current * list?.size > list?.total ? list?.total : list?.current * list?.size} 条</span>
                    </Col>
                    <Col sm={6} className={'d-flex align-items-center justify-content-center justify-content-sm-end'}>
                        <SinglePagination
                            forcePage={searchState.pageNo - 1}
                            className={'mb-0'}
                            pageCount={list?.pages}
                            onPageChange={handlePageChanged}
                        />
                    </Col>
                </Row>
            </div>

        </>
    );
}

const LoginLogPage = () => {
    const [list, setList] = useState<any>(useLoaderData());
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams, logType: 1});
    const searchFetcher = useFetcher();

    useEffect(() => {
        if (searchFetcher.data) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);


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
    const handleSort = (field: any, order: any): void => {
        searchState.column = field;
        searchState.order = order;
        setSearchState({...searchState});
        searchFetcher.submit(searchState, {method: 'get'});
    }
    const columns: any[] = [
        {
            text: '日志内容',
            dataField: 'logContent',
        },
        {
            text: '操作人ID',
            dataField: 'userid',
            headerStyle: {width: 150}
        },
        {
            text: '操作人',
            dataField: 'username',
            headerStyle: {width: 150}
        },
        {
            text: 'IP',
            dataField: 'ip',
            headerStyle: {width: 170}
        },
        {
            text: '耗时',
            dataField: 'costTime',
            headerStyle: {width: 170}
        },
        {
            text: '创建时间',
            dataField: 'createTime',
            headerStyle: {width: 200},
            sort: true,
            headerSortingClasses,
            sortFunc: emptySortFunc,
            onSort: handleSort
        },
    ]

    const expandRow = {
        ...defaultTableExpandRow,
        renderer: (row:any) => {
            return (
                <div></div>
            );
        },
    }
    const handleKeywordChanged = (e:any) => {
        setSearchState({...searchState, keyWord: e.target.value});
    }
    const handleOnSearchSubmit = () => {
        //设置分页为1
        setSearchState({...searchState, pageNo: 1});
    }
    return (
        <>
            <div className={'m-2'}>
                <Row>
                    <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                        <h4 className="mb-0">登录日志</h4>
                        <ReactSelectThemed
                            placeholder={'分页大小'}
                            isSearchable={false}
                            defaultValue={PageSizeOptions[0]}
                            options={PageSizeOptions}
                            className={'per-page-selector d-inline-block ml-50 mr-1'}
                            onChange={handlePageSizeChanged}
                        />
                    </Col>
                    <Col md={6} className={'d-flex align-items-center justify-content-end'}>
                        <searchFetcher.Form className={'form-inline justify-content-end'} onSubmit={handleOnSearchSubmit}>
                            <FormControl name={'pageNo'} value={1} type={'hidden'}/>
                            <FormControl name={'logType'} value={searchState.logType} type={'hidden'}/>
                            <FormControl name={'column'} value={searchState.column} type={'hidden'}/>
                            <FormControl name={'order'} value={searchState.order} type={'hidden'}/>
                            <FormControl name={'pageSize'} value={searchState.pageSize} type={'hidden'}/>

                            <FormGroup as={Form.Row} className={'mb-0'}>
                                <FormLabel htmlFor={'keyWord'}>搜索</FormLabel>
                                <Col>
                                    <InputGroup>
                                        <FormControl name={'keyWord'} onChange={handleKeywordChanged} placeholder={'请输入要搜索的内容'}/>
                                        <InputGroup.Append>
                                            <Button type={'submit'}>搜索</Button>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </Col>
                            </FormGroup>
                        </searchFetcher.Form>
                    </Col>
                </Row>
            </div>

            <BootstrapTable
                classes={'table-layout-fixed position-relative b-table'}
                striped hover columns={columns} bootstrap4 data={list?.records}
                expandRow={expandRow}
                keyField={'id'}
            />


            <div className={'mx-2 mb-2 mt-1'}>
                <Row>
                    <Col sm={6} className={'d-flex align-items-center justify-content-center justify-content-sm-start'}>
                        <span
                            className="text-muted">共 {list?.total} 条记录 显示 {(list?.current - 1) * list.size + 1} 至 {list?.current * list.size > list.total ? list.total : list?.current * list.size} 条</span>
                    </Col>
                    <Col sm={6} className={'d-flex align-items-center justify-content-center justify-content-sm-end'}>
                        <SinglePagination
                            forcePage={searchState.pageNo - 1}
                            className={'mb-0'}
                            pageCount={list?.pages}
                            onPageChange={handlePageChanged}
                        />
                    </Col>
                </Row>
            </div>

        </>
    );
}

const LogPages = () => {
    return (
        <Card>
            <Card.Body>
                <Tabs as={'ul'} defaultActiveKey={'login-log'}>
                    <Tab title={'登录日志'} as={'li'} eventKey={'login-log'}>
                        <LoginLogPage/>
                    </Tab>
                    <Tab title={'操作日志'} as={'li'} eventKey={'operation-log'}>
                        <OperationLogPage/>
                    </Tab>
                </Tabs>
            </Card.Body>
        </Card>
    );
}

export default withAutoLoading(LogPages);