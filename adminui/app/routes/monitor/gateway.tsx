import {
    Col,
    FormGroup,
    Table,
    Card,
    InputGroup,
    Form,
    FormControl,
    FormLabel,
    Button,
} from "react-bootstrap";
import vueSelectStyleUrl from '~/styles/react/libs/vue-select.css';
import {json, LinksFunction, LoaderFunction} from "@remix-run/node";
import {API_GATEWAY_LIST, API_ROLE_LIST, requestWithToken} from "~/utils/request.server";
import {useCatch, useFetcher, useLoaderData} from "@remix-run/react";
import {withPageLoading} from "~/utils/components";
import {useEffect, useState} from "react";
import {DefaultListSearchParams, defaultRouteCatchBoundary, defaultRouteErrorBoundary} from "~/utils/utils";
import _ from 'lodash';
import querystring from 'querystring';
import Error500Page from "~/components/error-page/500";
import Error401Page from "~/components/error-page/401";
import Error404Page from "~/components/error-page/404";

export const links: LinksFunction = () => {
    return [{rel: 'stylesheet', href: vueSelectStyleUrl}];
}
export const ErrorBoundary = defaultRouteErrorBoundary;

export const CatchBoundary = defaultRouteCatchBoundary;

export const loader: LoaderFunction = async ({request}) => {
    const url = new URL(request.url);
    if(_.isEmpty(url.search)) {
        url.search = '?'+querystring.stringify(DefaultListSearchParams);
    }
    const result = await requestWithToken(request)(API_GATEWAY_LIST+url.search);
    return json(result.result);
}

const GatewayPages = () => {
    const loaderData = useLoaderData();
    const [records, setRecords] = useState(loaderData?.records || []);
    const searchFetcher = useFetcher();

    useEffect(()=>{
        if(searchFetcher.data) {
            setRecords(searchFetcher.data.records);
        }
    }, [searchFetcher.state]);

    return (
        <>
            <Card>
                <Card.Header>
                    <Card.Title>
                        网关路由
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
                        <FormControl name={'pageNo'} value={DefaultListSearchParams.pageNo} type={'hidden'} />
                        <FormControl name={'column'} value={DefaultListSearchParams.column} type={'hidden'} />
                        <FormControl name={'order'} value={DefaultListSearchParams.order} type={'hidden'} />

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

                <Table striped hover responsive className={'position-relative'}>
                    <thead>
                    <tr>
                        <th>角色名称</th>
                        <th>角色编码</th>
                        <th>创建时间</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    {records.map((item: any) => {
                        return (
                            <tr key={item.id}>
                                <td>{item.roleName}</td>
                                <td>{item.roleCode}</td>
                                <td>{item.createTime}</td>
                                <td></td>
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
                </Card.Body>
            </Card>
        </>
    );
}

export default withPageLoading(GatewayPages);