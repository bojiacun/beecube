import {
    Col,
    FormGroup,
    Card,
    InputGroup,
    Form,
    FormControl,
    FormLabel,
    Button, Row, Dropdown, Modal,
} from "react-bootstrap";
import vueSelectStyleUrl from '~/styles/react/libs/vue-select.css';
import {json, LinksFunction, LoaderFunction} from "@remix-run/node";
import {API_ROLE_LIST, requestWithToken} from "~/utils/request.server";
import {Link, Outlet, useFetcher, useLoaderData} from "@remix-run/react";
import {withAutoLoading} from "~/utils/components";
import SinglePagination from "~/components/pagination/SinglePagination";
import {useEffect, useState} from "react";
import {DefaultListSearchParams, emptySortFunc, headerSortingClasses, PageSizeOptions} from "~/utils/utils";
import BootstrapTable from 'react-bootstrap-table-next';
import * as Yup from 'yup';
//@ts-ignore
import _ from 'lodash';
import querystring from 'querystring';
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import {Delete, Edit, MoreVertical, Shield} from "react-feather";
import {AwesomeButton} from "react-awesome-button";
import {Formik, Form as FormikForm, Field} from "formik";
import classNames from "classnames";
import {requireAuthenticated} from "~/utils/auth.server";
import {toast} from "react-toastify";
import {stopPageLoading} from "~/layouts/utils";


export const links: LinksFunction = () => {
    return [{rel: 'stylesheet', href: vueSelectStyleUrl}];
}
export function ErrorBoundary() {
    stopPageLoading();
    return <>roles errors</>;
}

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
    console.log(url.search, queryString);


    const result = await requestWithToken(request)(API_ROLE_LIST + queryString);
    return json(result.result);
}

const EditRoleSchema = Yup.object().shape({
    roleCode: Yup.string().required(),
    roleName: Yup.string().required()
});

const SystemRolesPage = () => {
    const [list, setList] = useState<any>(useLoaderData());
    const [searchState, setSearchState] = useState<any>(DefaultListSearchParams);
    const [editModal, setEditModal] = useState<any>();
    const searchFetcher = useFetcher();
    const editFetcher = useFetcher();


    useEffect(() => {
        if (searchFetcher.data) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);

    useEffect(()=>{
        if(editFetcher.data && editFetcher.type === 'done') {
            toast.success('修改成功', {
                position: "top-center",
                autoClose: 800,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
            searchFetcher.submit(searchState, {method: 'get'});
            setEditModal(null);
        }
    }, [editFetcher.state]);

    const handleOnAction = (row: any, e: any) => {
        switch (e) {
            case 'edit':
                //编辑
                setEditModal(row);
                break;
        }
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
    const handleSort = (field: any, order: any): void => {
        searchState.column = field;
        searchState.order = order;
        setSearchState({...searchState});
        searchFetcher.submit(searchState, {method: 'get'});
    }
    const columns: any[] = [
        {
            text: '角色名称',
            dataField: 'roleName',
            headerStyle: {width: 170}
        },
        {
            text: '角色编码',
            dataField: 'roleCode',
            headerStyle: {width: 170}
        },
        {
            text: '创建时间',
            dataField: 'createTime',
            headerStyle: {width: 200},
            sort: true,
            onSort: handleSort,
            headerSortingClasses,
            sortFunc: emptySortFunc
        },

        {
            text: '操作',
            dataField: 'operation',
            headerStyle: {width: 130},
            formatter: (cell: any, row: any) => {
                return (
                    <div className={'d-flex align-items-center'}>
                        <a href={'#'}>用户</a>
                        <span className={'divider'}/>
                        <Link to={'/'}>工单授权</Link>
                        <span className={'divider'}/>
                        <Dropdown as={'span'} onSelect={(e) => handleOnAction(row, e)}>
                            <Dropdown.Toggle as={'span'} className={'noafter'}>
                                <MoreVertical size={16} style={{marginTop: -2}}/>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey={'authorization'}>
                                    <div className={'d-flex align-items-center'}><Shield size={16} className={'mr-1'}/>授权</div>
                                </Dropdown.Item>
                                <Dropdown.Item eventKey={'edit'}>
                                    <div className={'d-flex align-items-center'}><Edit size={16} className={'mr-1'}/>编辑</div>
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
    const handleOnSearchSubmit = () => {
        //设置分页为1
        setSearchState({...searchState, pageNo: 1});
    }
    const handleOnRoleNameChanged = (e: any) => {
        setSearchState({...searchState, roleName: e.target.value});
    }
    const handleOnEditSubmit = (values:any) => {
        editFetcher.submit(values, {method: 'put', action: `/system/roles/${values.id}`});
    }
    return (
        <Card>
            <div className={'m-2'}>
                <Row>
                    <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                        <h4 className="mb-0">角色管理</h4>
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
                                <FormLabel htmlFor={'roleName'}>角色名称</FormLabel>
                                <Col>
                                    <InputGroup>
                                        <FormControl name={'roleName'} onChange={handleOnRoleNameChanged} placeholder={'请输入要搜索的内容'}/>
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

            <BootstrapTable classes={'table-layout-fixed position-relative b-table'} striped hover columns={columns} bootstrap4 data={list?.records}
                            keyField={'id'}/>


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

            <Modal
                show={!!editModal}
                onHide={() => setEditModal(null)}
                centered
                backdrop={'static'}
                aria-labelledby={'edit-modal'}
            >
                <Modal.Header closeButton>
                    <Modal.Title id={'edit-modal'}>编辑角色</Modal.Title>
                </Modal.Header>
                {editModal &&
                    <Formik initialValues={editModal} validationSchema={EditRoleSchema} onSubmit={handleOnEditSubmit}>
                        {({errors, touched})=>{
                            return (
                                <FormikForm >
                                    <Modal.Body>
                                        <FormGroup>
                                            <Form.Label htmlFor={'roleCode'}>角色编码</Form.Label>
                                            <Field className={'form-control'} id={'roleCode'} name={'roleCode'} placeholder={'角色编码'} readOnly />
                                        </FormGroup>
                                        <FormGroup>
                                            <Form.Label htmlFor={'roleName'}>角色名称</Form.Label>
                                            <Field className={classNames('form-control', !!errors.roleName? 'is-invalid':'')} id={'roleName'} name={'roleName'} placeholder={'角色名称'} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Form.Label htmlFor={'description'}>描述</Form.Label>
                                            <Field className={'form-control'} placeholder={'角色描述'} id={'description'} name={'description'} as={'textarea'} rows={3} />
                                        </FormGroup>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <AwesomeButton
                                            key={'submit'}
                                            type={'primary'}
                                            containerProps={{type: 'submit'}}
                                            disabled={editFetcher.state === 'submitting'}
                                        >
                                            保存
                                        </AwesomeButton>
                                    </Modal.Footer>
                                </FormikForm>
                            );
                        }}

                    </Formik>
                }
            </Modal>

        </Card>
    );
}

export default withAutoLoading(SystemRolesPage);