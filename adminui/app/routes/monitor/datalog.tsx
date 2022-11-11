import {
    Col,
    FormGroup,
    Table,
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
import {DefaultListSearchParams} from "~/utils/utils";
//@ts-ignore
import _ from 'lodash';
import querystring from 'querystring';

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

const DataLogPages = () => {
    const loaderData = useLoaderData();
    const [records, setRecords] = useState(loaderData?.records || []);
    const searchFetcher = useFetcher();

    useEffect(() => {
        if (searchFetcher.data) {
            setRecords(searchFetcher.data.records);
        }
    }, [searchFetcher.state]);

    return (
        <Card>
            <div className={'m-2'}>
               <Row>
                   <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                       <h4 className="mb-0">数据日志</h4>
                       <FormControl as={'select'} size={'sm'} className={'v-select per-page-selector d-inline-block ml-50 mr-1'}>
                           <option>10</option>
                           <option>20</option>
                           <option>50</option>
                           <option>100</option>
                       </FormControl>
                       <Button>添加记录</Button>
                   </Col>
               </Row>
            </div>
            <Card.Header>
                <Card.Title>
                    数据日志
                </Card.Title>
            </Card.Header>
            <Card.Body className={'d-flex justify-content-between  flex-wrap'}>
                <Form inline>
                    <FormGroup as={Form.Row} className={'align-items-center mr-1 mb-md-0'}>
                        <FormLabel column={'sm'}>排序</FormLabel>
                        <InputGroup as={'span'} size={'sm'}>
                            <FormControl as={'select'} size={'sm'}>
                                <option>无</option>
                            </FormControl>
                        </InputGroup>
                        <InputGroup as={'span'} size={'sm'}>
                            <FormControl as={'select'} size={'sm'}>
                                <option>升序</option>
                                <option>降序</option>
                            </FormControl>
                        </InputGroup>
                    </FormGroup>
                </Form>
                <searchFetcher.Form className={'form-inline'}>
                    <FormControl name={'pageNo'} value={DefaultListSearchParams.pageNo} type={'hidden'}/>
                    <FormControl name={'column'} value={DefaultListSearchParams.column} type={'hidden'}/>
                    <FormControl name={'order'} value={DefaultListSearchParams.order} type={'hidden'}/>

                    <FormGroup as={Form.Row} className={'mb-0'}>
                        <FormLabel column={'sm'} sm={2} htmlFor={'roleName'}>筛选</FormLabel>
                        <Col sm={10}>
                            <InputGroup size={'sm'}>
                                <FormControl name={'roleName'} placeholder={'请输入要搜索的内容'}/>
                                <InputGroup.Append>
                                    <Button type={'submit'}>搜索</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Col>
                    </FormGroup>
                </searchFetcher.Form>
            </Card.Body>

            <Table striped hover responsive className={'position-relative table-layout-fixed'}>
                <thead>
                <tr>
                    <th style={{width: 170}}>表名</th>
                    <th style={{width: 350}}>数据ID</th>
                    <th style={{width: 100}}>版本号</th>
                    <th>数据内容</th>
                    <th style={{width: 150}}>创建人</th>
                </tr>
                </thead>
                <tbody>
                {records.map((item: any) => {
                    return (
                        <tr key={item.id}>
                            <td>{item.dataTable}</td>
                            <td>{item.dataId}</td>
                            <td>{item.dataVersion}</td>
                            <td className={'text-cut'}>
                                {item.dataContent}
                            </td>
                            <td>{item.createBy}</td>
                        </tr>
                    );
                })}
                </tbody>
            </Table>

            <Card.Body className={'d-flex justify-content-between flex-wrap pt-0 mt-1'}>
                <div className={'align-items-center mr-1 mb-md-0'}>
                    <Form inline>
                        <FormGroup as={Form.Row}>
                            <FormLabel column={'sm'}>共计{loaderData?.total}条数据,每页显示</FormLabel>
                            <InputGroup size={'sm'} as={'span'}>
                                <FormControl as={'select'} size={'sm'}>
                                    <option>20</option>
                                    <option>50</option>
                                    <option>100</option>
                                </FormControl>
                            </InputGroup>
                        </FormGroup>
                    </Form>
                </div>
                <SinglePagination className={'mb-0'} current={loaderData?.current} pages={loaderData?.pages}
                                  total={loaderData?.total} size={loaderData?.size}/>
            </Card.Body>
        </Card>
    );
}

export default withAutoLoading(DataLogPages);