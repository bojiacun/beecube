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
import {API_DATALOG_LIST, API_GATEWAY_LIST, API_ROLE_LIST, requestWithToken} from "~/utils/request.server";
import {useFetcher, useLoaderData} from "@remix-run/react";
import {withAutoLoading} from "~/utils/components";
import SinglePagination from "~/components/pagination/SinglePagination";
import {useEffect, useState} from "react";
import {DefaultListSearchParams, PageSizeOptions} from "~/utils/utils";
import BootstrapTable, {ColumnDescription} from 'react-bootstrap-table-next';
//@ts-ignore
import _ from 'lodash';
import querystring from 'querystring';
import Select from "react-select";

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
const columns: ColumnDescription[] = [
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
    },
]

const DataLogPages = () => {
    const [list, setList] = useState<any>(useLoaderData());
    const searchFetcher = useFetcher();

    useEffect(() => {
        if (searchFetcher.data) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);


    const handlePageChanged = (e:any) => {
        console.log(e);
    }

    return (
        <Card>
            <div className={'m-2'}>
               <Row>
                   <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                       <h4 className="mb-0">数据日志</h4>
                       <Select placeholder={'分页大小'} isSearchable={false} defaultValue={PageSizeOptions[0]}  options={PageSizeOptions} className={'per-page-selector d-inline-block ml-50 mr-1'} />
                   </Col>
                   <Col md={6} className={'d-flex align-items-center justify-content-end'}>
                       <searchFetcher.Form className={'form-inline'}>
                           <FormControl name={'pageNo'} value={DefaultListSearchParams.pageNo} type={'hidden'}/>
                           <FormControl name={'column'} value={DefaultListSearchParams.column} type={'hidden'}/>
                           <FormControl name={'order'} value={DefaultListSearchParams.order} type={'hidden'}/>

                           <FormGroup as={Form.Row} className={'mb-0'}>
                               <FormLabel column={true} sm={2} htmlFor={'roleName'}>筛选</FormLabel>
                               <Col sm={10}>
                                   <InputGroup>
                                       <FormControl name={'roleName'} placeholder={'请输入要搜索的内容'}/>
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
                        <span className="text-muted">共 {list?.total} 条记录 显示 {(list?.current - 1)*list.size + 1} 至 {(list?.current - 1)*list.size + list.size} 条</span>
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