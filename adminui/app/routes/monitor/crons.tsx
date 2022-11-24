import {
    Col,
    FormGroup,
    Card,
    InputGroup,
    Form,
    FormControl,
    FormLabel,
    Button, Row, Dropdown,
} from "react-bootstrap";
import vueSelectStyleUrl from '~/styles/react/libs/vue-select.css';
import {json, LinksFunction, LoaderFunction} from "@remix-run/node";
import {API_CRONJOB_LIST, API_DATALOG_LIST, requestWithToken} from "~/utils/request.server";
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
import {Delete, Edit, MoreVertical} from "react-feather";

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
    }
    else {
        queryString = '?' + url.searchParams.toString();
    }
    const result = await requestWithToken(request)(API_CRONJOB_LIST + queryString);
    return json(result.result);
}



const CronsPages = () => {
    const [list, setList] = useState<any>(useLoaderData());
    const [searchState, setSearchState] = useState<any>(DefaultListSearchParams);
    const searchFetcher = useFetcher();

    useEffect(() => {
        if (searchFetcher.data) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);


    const handlePageChanged = (e:any) => {
        searchState.pageNo = e.selected + 1;
        setSearchState({...searchState});
        searchFetcher.submit(searchState, {method: 'get'});
    }
    const handlePageSizeChanged = (newValue:any) => {
        searchState.pageSize = parseInt(newValue.value);
        setSearchState({...searchState});
        searchFetcher.submit(searchState, {method: 'get'});
    }
    const handleOnAction = (row: any, e: any) => {
        switch (e) {
            case 'add-child':
                //编辑
                break;
            case 'edit':
                //编辑
                break;
            case 'data-rule':
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
            text: '任务类名',
            dataField: 'jobClassName',
            classes: 'text-cut',
            headerStyle: {width: 400}
        },
        {
            text: 'Cron表达式',
            dataField: 'cronExpression',
            classes: 'text-cut',
            headerStyle: {width: 200}
        },
        {
            text: '参数',
            dataField: 'parameter',
            classes: 'text-cut'
        },
        {
            text: '描述',
            dataField: 'description',
            classes: 'text-cut'
        },
        {
            text: '状态',
            dataField: 'status_dictText',
            headerStyle: {width: 100},
        },
        {
            text: '操作',
            dataField: 'operation',
            isDummyField: true,
            headerStyle: {width: 180},
            formatter: (cell: any, row: any) => {
                return (
                    <div className={'d-flex align-items-center'}>
                        <a href={'#'} onClick={() => handleOnAction(row, 'start')}>启动</a>
                        <span className={'divider'}/>
                        <a href={'#'} onClick={() => handleOnAction(row, 'edit')}>编辑</a>
                        <span className={'divider'}/>
                        <Dropdown as={'span'} onSelect={(e) => handleOnAction(row, e)}>
                            <Dropdown.Toggle as={'span'} className={'noafter'}>
                                <MoreVertical size={16} style={{marginTop: -2}}/>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey={'start-now'}>
                                    <div className={'d-flex align-items-center'}><Edit size={16} className={'mr-1'}/>立即执行</div>
                                </Dropdown.Item>
                                <Dropdown.Item eventKey={'delete'}>
                                    <div className={'d-flex align-items-center'}><Delete size={16} className={'mr-1'}/>删除</div>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                );
            }
        },
    ]

    const handleOnDataIdChanged = (e:any) => {
        setSearchState({...searchState, dataId: e.target.value});
    }
    const handleOnDataTableChanged = (e:any) => {
        setSearchState({...searchState, dataTable: e.target.value});
    }
    const handleOnSearchSubmit = () => {
        //设置分页为1
        setSearchState({...searchState, pageNo: 1});
    }

    return (
        <Card>
            <div className={'m-2'}>
               <Row>
                   <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                       <h4 className="mb-0">定时任务</h4>
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
                           <FormControl name={'column'} value={searchState.column} type={'hidden'}/>
                           <FormControl name={'order'} value={searchState.order} type={'hidden'}/>
                           <FormControl name={'pageSize'} value={searchState.pageSize} type={'hidden'}/>
                           <FormGroup as={Form.Row} className={'mb-0'}>
                               <FormLabel htmlFor={'jobClassName'}>任务类名</FormLabel>
                               <Col>
                                   <InputGroup>
                                       <FormControl name={'jobClassName'} onChange={handleOnDataIdChanged} placeholder={'请输入要搜索的内容'}/>
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

            <BootstrapTable classes={'table-layout-fixed position-relative b-table'} striped hover columns={columns} bootstrap4 data={list?.records}  keyField={'id'} />


            <div className={'mx-2 mb-2 mt-1'}>
                <Row>
                    <Col sm={6} className={'d-flex align-items-center justify-content-center justify-content-sm-start'}>
                        <span className="text-muted">共 {list?.total} 条记录 显示 {(list?.current - 1)*list.size + 1} 至 {list?.current*list.size > list.total ? list.total:list?.current*list.size} 条</span>
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

        </Card>
    );
}

export default withPageLoading(CronsPages);