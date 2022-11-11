import {
    Col,
    FormGroup,
    Card,
    InputGroup,
    Form,
    FormControl,
    FormLabel,
    Button, Row,
} from "react-bootstrap";
import vueSelectStyleUrl from '~/styles/react/libs/vue-select.css';
import {json, LinksFunction, LoaderFunction} from "@remix-run/node";
import {API_DATALOG_LIST, requestWithToken} from "~/utils/request.server";
import {useFetcher, useLoaderData} from "@remix-run/react";
import {withAutoLoading} from "~/utils/components";
import SinglePagination from "~/components/pagination/SinglePagination";
import {useContext, useEffect, useRef, useState} from "react";
import {DefaultListSearchParams, PageSizeOptions} from "~/utils/utils";
import BootstrapTable from 'react-bootstrap-table-next';
//@ts-ignore
import _ from 'lodash';
import querystring from 'querystring';
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";

export const links: LinksFunction = () => {
    return [{rel: 'stylesheet', href: vueSelectStyleUrl}];
}


export const loader: LoaderFunction = async ({request}) => {
    const url = new URL(request.url);
    if (_.isEmpty(url.search)) {
        url.search = '?' + querystring.stringify(DefaultListSearchParams);
    }
    const result = await requestWithToken(request)(API_DATALOG_LIST + url.search);
    return json(result.result);
}
const headerSortingClasses = (column:any, sortOrder:any) => (
    sortOrder === 'asc' ? 'sorting-asc' : 'sorting-desc'
);


const DataLogPages = () => {
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
    const handleSort = (field:any, order:any):void => {
        searchState.column = field;
        searchState.order = order;
        setSearchState({...searchState});
        searchFetcher.submit(searchState, {method: 'get'});
    }
    const columns: any[] = [
        {
            text: '表名',
            dataField: 'dataTable',
            headerStyle: {width: 170}
        },
        {
            text: '数据ID',
            dataField: 'dataId',
            headerStyle: {width: 350}
        },
        {
            text: '版本号',
            dataField: 'dataVersion',
            headerStyle: {width: 100}
        },
        {
            text: '数据内容',
            dataField: 'dataContent',
            classes: 'text-cut'
        },
        {
            text: '创建人',
            dataField: 'createBy',
            headerStyle: {width: 130},
            sort: true,
            headerSortingClasses,
            onSort: handleSort
        },
    ]


    return (
        <Card>
            <div className={'m-2'}>
               <Row>
                   <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                       <h4 className="mb-0">数据日志</h4>
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
                       <searchFetcher.Form className={'form-inline justify-content-end'}>
                           <FormControl name={'pageNo'} value={1} type={'hidden'}/>
                           <FormControl name={'column'} value={searchState.column} type={'hidden'}/>
                           <FormControl name={'order'} value={searchState.order} type={'hidden'}/>
                           <FormControl name={'pageSize'} value={searchState.pageSize} type={'hidden'}/>

                           <FormGroup as={Form.Row} className={'mb-0 mr-2'}>
                               <FormLabel htmlFor={'dataTable'}>表名</FormLabel>
                               <Col>
                                   <FormControl name={'dataTable'} placeholder={'请输入要搜索的内容'}/>
                               </Col>
                           </FormGroup>
                           <FormGroup as={Form.Row} className={'mb-0'}>
                               <FormLabel htmlFor={'dataId'}>数据ID</FormLabel>
                               <Col>
                                   <InputGroup>
                                       <FormControl name={'dataId'} placeholder={'请输入要搜索的内容'}/>
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

export default withAutoLoading(DataLogPages);