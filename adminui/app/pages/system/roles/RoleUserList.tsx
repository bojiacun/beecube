import {useEffect, useState} from "react";
import {DefaultListSearchParams, PageSizeOptions, showDeleteAlert, showToastError, showToastSuccess} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import {Badge, Button, Card, Col, Form, FormControl, FormGroup, FormLabel, InputGroup, Row} from "react-bootstrap";
import {Plus, XCircle} from "react-feather";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import BootstrapTable from "react-bootstrap-table-next";
import SinglePagination from "~/components/pagination/SinglePagination";


const RoleUserList = (props: any) => {
    const {selectedRole, startPageLoading, stopPageLoading, setSelectedRole} = props;
    const [list, setList] = useState<any>({records: []});
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams, roleId: selectedRole.id});
    const [editModal, setEditModal] = useState<any>();
    const [userListShow, setUserListShow] = useState<boolean>(false);
    const searchFetcher = useFetcher();
    const deleteFetcher = useFetcher();

    useEffect(() => {
        if (searchFetcher.data) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);
    useEffect(() => {
        if (selectedRole) {
            searchState.roleId = selectedRole.id;
            setSearchState({...searchState});
            searchFetcher.submit(searchState, {method: 'get', action: '/system/roles/users'});
        }
    }, [selectedRole]);
    useEffect(() => {
        if (deleteFetcher.data && deleteFetcher.type === 'done') {
            if (deleteFetcher.data.success) {
                stopPageLoading();
                showToastSuccess('取消成功');
                searchFetcher.submit(searchState, {method: 'get', action: '/system/roles/users'});
            } else {
                showToastError(deleteFetcher.data.message);
            }
        }
    }, [deleteFetcher.state]);

    const refreshRoleUsers = () => {
        searchFetcher.submit(searchState, {method: 'get', action: '/system/roles/users'});
    }
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
                showDeleteAlert(function () {
                    startPageLoading();
                    deleteFetcher.submit({userId: row.id, roleId: selectedRole.id},
                        {method: 'delete', action: `/system/roles/users/delete?userId=${row.id}&roleId=${selectedRole.id}`, replace: true}
                    );
                }, '确认取消关联吗?', '取消提醒', '确认取消');
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
            formatter: (cell: any, row: any) => {
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
                        <a href={'#'} onClick={() => handleOnAction(row, 'edit')}>编辑</a>
                        <span className={'divider'}/>
                        <a href={'#'} onClick={() => handleOnAction(row, 'delete')}>取消关联</a>
                        <span className={'divider'}/>
                    </div>
                );
            }
        },
    ]

    return (
        <>
            <Card>
                <XCircle size={28} className={'cursor-pointer'} style={{position: 'absolute', right: -14, top: -14, zIndex: 99}}
                         onClick={() => setSelectedRole(null)}/>
                <div className={'m-2'}>
                    <Row>
                        <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                            <ReactSelectThemed
                                placeholder={'分页大小'}
                                isSearchable={false}
                                defaultValue={PageSizeOptions[0]}
                                options={PageSizeOptions}
                                className={'per-page-selector d-inline-block ml-50 mr-1'}
                                onChange={handlePageSizeChanged}
                            />
                            <Button className={'mr-1'} onClick={handleOnAdd}><Plus size={16}/>新建用户</Button>
                            <Button variant={'secondary'} onClick={()=>setUserListShow(true)}><Plus size={16}/>已有用户</Button>
                        </Col>
                        <Col md={6} className={'d-flex align-items-center justify-content-end'}>
                            <searchFetcher.Form action={'/system/roles/users'} className={'form-inline justify-content-end'}
                                                onSubmit={handleOnSearchSubmit}>
                                <FormControl name={'pageNo'} value={1} type={'hidden'}/>
                                <FormControl name={'roleId'} value={selectedRole.id} type={'hidden'}/>
                                <FormControl name={'column'} value={searchState.column} type={'hidden'}/>
                                <FormControl name={'order'} value={searchState.order} type={'hidden'}/>
                                <FormControl name={'pageSize'} value={searchState.pageSize} type={'hidden'}/>

                                <FormGroup as={Form.Row} className={'mb-0'}>
                                    <FormLabel htmlFor={'username'}>用户账号</FormLabel>
                                    <Col>
                                        <InputGroup>
                                            <FormControl name={'username'} autoComplete={'off'} onChange={handleOnSearchNameChanged}
                                                         placeholder={'请输入要搜索的内容'}/>
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
                    striped
                    hover
                    columns={columns}
                    bootstrap4
                    data={list?.records}
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
            </Card>
            <UserListSelector show={userListShow} setUserListShow={setUserListShow} selectedRole={selectedRole} refreshRoleUsers={refreshRoleUsers} />
        </>
    );
}

export default RoleUserList