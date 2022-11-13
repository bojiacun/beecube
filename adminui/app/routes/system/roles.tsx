import {
    Col,
    FormGroup,
    Card,
    InputGroup,
    Form,
    FormControl,
    FormLabel,
    Button, Row, Dropdown, Modal, Badge,
} from "react-bootstrap";
import vueSelectStyleUrl from '~/styles/react/libs/vue-select.css';
import {json, LinksFunction, LoaderFunction} from "@remix-run/node";
import {API_ROLE_LIST, requestWithToken} from "~/utils/request.server";
import {Link, useCatch, useFetcher, useLoaderData} from "@remix-run/react";
import {withPageLoading} from "~/utils/components";
import SinglePagination from "~/components/pagination/SinglePagination";
import {useEffect, useState} from "react";
import {
    DefaultListSearchParams,
    emptySortFunc,
    headerSortingClasses,
    PageSizeOptions,
    showDeleteAlert,
    showToastError,
    showToastSuccess
} from "~/utils/utils";
import BootstrapTable from 'react-bootstrap-table-next';
import * as Yup from 'yup';
import _ from 'lodash';
import querystring from 'querystring';
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import {Delete, Edit, MoreVertical, Plus, Shield, XCircle} from "react-feather";
import {AwesomeButton} from "react-awesome-button";
import {Formik, Form as FormikForm, Field} from "formik";
import classNames from "classnames";
import {requireAuthenticated} from "~/utils/auth.server";
import Error500Page from "~/components/error-page/500";
import Error401Page from "~/components/error-page/401";
import Error404Page from "~/components/error-page/404";



export const links: LinksFunction = () => {
    return [{rel: 'stylesheet', href: vueSelectStyleUrl}];
}
export function ErrorBoundary() {
    return <Error500Page />
}
export function CatchBoundary() {
    const caught = useCatch();
    if(caught.status === 401) {
        return <Error401Page />
    }
    else if(caught.status === 404) {
        return <Error404Page />
    }
    return <Error500Page />
}

const EditRoleSchema = Yup.object().shape({
    roleCode: Yup.string().required(),
    roleName: Yup.string().required()
});

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
    const result = await requestWithToken(request)(API_ROLE_LIST + queryString);
    return json(result.result);
}


const SystemRolesPage = (props:any) => {
    const {startPageLoading, stopPageLoading, setSelectedRole} = props;
    const [list, setList] = useState<any>(useLoaderData());
    const [searchState, setSearchState] = useState<any>(DefaultListSearchParams);
    const [editModal, setEditModal] = useState<any>();
    const searchFetcher = useFetcher();
    const editFetcher = useFetcher();
    const deleteFetcher = useFetcher();


    useEffect(() => {
        if (searchFetcher.data) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);

    useEffect(()=>{
        if(editFetcher.data && editFetcher.type === 'done') {
            if(editFetcher.data.success) {
                showToastSuccess(editModal.id ? '修改成功': '新建成功');
                searchFetcher.submit(searchState, {method: 'get'});
                setEditModal(null);
            }
            else {
                showToastError(editFetcher.data.message);
            }
        }
    }, [editFetcher.state]);
    useEffect(()=>{
        if(deleteFetcher.data && deleteFetcher.type === 'done') {
            if(deleteFetcher.data.success) {
                stopPageLoading();
                showToastSuccess('删除成功');
                searchFetcher.submit(searchState, {method: 'get'});
            }
            else {
                showToastError(editFetcher.data.message);
            }
        }
    }, [deleteFetcher.state]);

    const handleOnAction = (row: any, e: any) => {
        switch (e) {
            case 'edit':
                //编辑
                setEditModal(row);
                break;
            case 'delete':
                //删除按钮
                showDeleteAlert(function(){
                    startPageLoading();
                    deleteFetcher.submit({id: row.id}, {method: 'delete', action: `/system/roles/delete?id=${row.id}`, replace: true});
                });
                break;
            case 'list-user':
                setSelectedRole(row);
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
        },
        {
            text: '角色编码',
            dataField: 'roleCode',
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
            headerStyle: {width: 180},
            formatter: (cell: any, row: any) => {
                return (
                    <div className={'d-flex align-items-center'}>
                        <a href={'#'} onClick={()=>handleOnAction(row, 'list-user')}>用户</a>
                        <span className={'divider'}/>
                        <a href={'#'} onClick={()=>handleOnAction(row, 'grant')}>工单授权</a>
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
        if(values.id) {
            editFetcher.submit(values, {method: 'put', action: `/system/roles/${values.id}`, replace: true});
        }
        else {
            editFetcher.submit(values, {method: 'put', action: `/system/roles/add`, replace: true});
        }
    }
    const handleOnAdd = () => {
        setEditModal({});
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
                        <Button onClick={handleOnAdd}><Plus size={16} />新建角色</Button>
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
                                <FormikForm>
                                    <Modal.Body>
                                        <FormGroup>
                                            <Form.Label htmlFor={'roleCode'}>角色编码</Form.Label>
                                            <Field className={classNames('form-control', !!errors.roleCode ? 'is-invalid':'')} id={'roleCode'} name={'roleCode'} placeholder={'角色编码'} readOnly={editModal.id} />
                                        </FormGroup>
                                        {/*<FormGroup>*/}
                                        {/*    <Form.Label htmlFor={'roleId'}>id</Form.Label>*/}
                                        {/*    <Field className={classNames('form-control', !!errors.id? 'is-invalid':'')} id={'roleId'} name={'id'} placeholder={'角色ID'} />*/}
                                        {/*</FormGroup>*/}
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

const NestedUsersPage = (props:any) => {
    const {selectedRole, startPageLoading, stopPageLoading, setSelectedRole} = props;
    const [list, setList] = useState<any>({records: []});
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams, roleId: selectedRole.id});
    const [editModal, setEditModal] = useState<any>();
    const searchFetcher = useFetcher();

    useEffect(() => {
        if (searchFetcher.data) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);
    useEffect(()=>{
        if(selectedRole) {
            searchState.roleId = selectedRole.id;
            setSearchState({...searchState});
            searchFetcher.submit(searchState, {method: 'get', action: '/system/roles/users'});
        }
    }, [selectedRole]);

    const handleOnAdd = () => {
        setEditModal({});
    }
    const handlePageChanged = (e: any) => {
        searchState.pageNo = e.selected + 1;
        setSearchState({...searchState});
        searchFetcher.submit(searchState, {method: 'get', action: '/system/roles/users'});
    }
    const handlePageSizeChanged = (newValue: any) => {
        searchState.pageSize = parseInt(newValue.value);
        setSearchState({...searchState});
        searchFetcher.submit(searchState, {method: 'get', action: '/system/roles/users'});
    }
    const handleSort = (field: any, order: any): void => {
        searchState.column = field;
        searchState.order = order;
        setSearchState({...searchState});
        searchFetcher.submit(searchState, {method: 'get', action: '/system/roles/users'});
    }
    const handleOnSearchNameChanged = (e: any) => {
        setSearchState({...searchState, roleName: e.target.value});
    }
    const handleOnSearchSubmit = () => {
        //设置分页为1
        setSearchState({...searchState, pageNo: 1});
    }
    const handleOnAction = (row: any, e: any) => {
        switch (e) {
            case 'edit':
                //编辑
                setEditModal(row);
                break;
            case 'delete':
                //删除按钮
                showDeleteAlert(function(){
                    startPageLoading();
                });
                break;
        }
    }




    const columns: any[] = [
        {
            text: '用户账号',
            dataField: 'username',
        },
        {
            text: '用户名称',
            dataField: 'realname',
        },
        {
            text: '状态',
            dataField: 'status',
            formatter: (cell:any, row:any) => {
                return row.status == 1 ? <Badge variant={'success'}>正常</Badge> : <Badge variant={'danger'}>异常</Badge>
            }
        },

        {
            text: '操作',
            dataField: 'operation',
            headerStyle: {width: 180},
            formatter: (cell: any, row: any) => {
                return (
                    <div className={'d-flex align-items-center'}>
                        <a href={'#'} onClick={()=>handleOnAction(row, 'edit')}>编辑</a>
                        <span className={'divider'}/>
                        <a href={'#'} onClick={()=>handleOnAction(row, 'delete')}>取消关联</a>
                        <span className={'divider'}/>
                    </div>
                );
            }
        },
    ]


    return (
        <Card>
            <XCircle size={28} className={'cursor-pointer'} style={{position: 'absolute', right: -14, top: -14, zIndex: 99}} onClick={()=>setSelectedRole(null)} />
            <div className={'m-2'}>
                <Row>
                    <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                        <h4 className="mb-0">用户管理</h4>
                        <ReactSelectThemed
                            placeholder={'分页大小'}
                            isSearchable={false}
                            defaultValue={PageSizeOptions[0]}
                            options={PageSizeOptions}
                            className={'per-page-selector d-inline-block ml-50 mr-1'}
                            onChange={handlePageSizeChanged}
                        />
                        <Button onClick={handleOnAdd}><Plus size={16} />新建用户</Button>
                    </Col>
                    <Col md={6} className={'d-flex align-items-center justify-content-end'}>
                        <searchFetcher.Form action={'/system/roles/users'} className={'form-inline justify-content-end'} onSubmit={handleOnSearchSubmit}>
                            <FormControl name={'pageNo'} value={1} type={'hidden'}/>
                            <FormControl name={'roleId'} value={selectedRole.id} type={'hidden'}/>
                            <FormControl name={'column'} value={searchState.column} type={'hidden'}/>
                            <FormControl name={'order'} value={searchState.order} type={'hidden'}/>
                            <FormControl name={'pageSize'} value={searchState.pageSize} type={'hidden'}/>

                            <FormGroup as={Form.Row} className={'mb-0'}>
                                <FormLabel htmlFor={'username'}>用户账号</FormLabel>
                                <Col>
                                    <InputGroup>
                                        <FormControl name={'username'} autoComplete={'off'} onChange={handleOnSearchNameChanged} placeholder={'请输入要搜索的内容'}/>
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
        </Card>
    );
}


const MainSystemRolesPage = (props:any) => {
    const [selectedRole, setSelectedRole] = useState<any>();

    return (
        <Row>
            <Col>
                <SystemRolesPage {...props} setSelectedRole={setSelectedRole} />
            </Col>
            {selectedRole && <Col>
                <NestedUsersPage {...props} setSelectedRole={setSelectedRole} selectedRole={selectedRole} />
            </Col>}
        </Row>
    );
}

export default withPageLoading(MainSystemRolesPage);