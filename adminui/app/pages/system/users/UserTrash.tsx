import {useEffect, useState} from "react";
import {useFetcher, useLoaderData} from "@remix-run/react";
import {
    DefaultListSearchParams,
    emptySortFunc, handleResult,
    headerSortingClasses,
    PageSizeOptions,
    showDeleteAlert,
    showToastError,
    showToastSuccess
} from "~/utils/utils";
import {Badge, Button, Card, Col, Dropdown, Form, FormControl, FormGroup, FormLabel, Image, InputGroup, Modal, Row} from "react-bootstrap";
import {Circle, Delete, Edit, MoreVertical, Plus, Shield, X} from "react-feather";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import BootstrapTable from "react-bootstrap-table-next";
import SinglePagination from "~/components/pagination/SinglePagination";
import {Field, Formik, Form as FormikForm} from "formik";
import classNames from "classnames";
import {AwesomeButton} from "react-awesome-button";
import * as Yup from "yup";
import TreePermissionList from "~/pages/system/roles/TreePermissionList";
import UserEdit from "~/pages/system/roles/UserEdit";
import UserPassword from "~/pages/system/users/UserPassword";


const UserTrash = (props: any) => {
    const {show, onHide} = props;
    const [list, setList] = useState<any>(useLoaderData());
    const [searchState, setSearchState] = useState<any>(DefaultListSearchParams);
    const searchFetcher = useFetcher();
    const deleteFetcher = useFetcher();
    const restoreFetcher = useFetcher();


    const loadData = () => {
        searchFetcher.submit(searchState, {method: 'get', action: '/system/users/trash'});
    }

    useEffect(() => {
        if (searchFetcher.type === 'done' && searchFetcher.data) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);


    useEffect(() => {
        if (deleteFetcher.data && deleteFetcher.type === 'done') {
            handleResult(deleteFetcher.data, '删除成功');
            loadData();
        }
    }, [deleteFetcher.state]);
    useEffect(() => {
        if (restoreFetcher.data && restoreFetcher.type === 'done') {
            handleResult(restoreFetcher.data, '恢复成功');
            loadData();
        }
    }, [restoreFetcher.state]);


    const handleOnAction = (row: any, e: any) => {
        switch (e) {
            case 'restore':
                showDeleteAlert(function () {
                    restoreFetcher.submit({userIds: row.id}, {method: 'put', action: `/system/users/trash/restore?userIds=${row.id}`, replace: true});
                }, '确认恢复用户吗', '确认恢复');
                break;
            case 'delete':
                //删除按钮
                showDeleteAlert(function () {
                    deleteFetcher.submit({userIds: row.id}, {
                        method: 'delete',
                        action: `/system/users/trash/delete?userIds=${row.id}`,
                        replace: true
                    });
                });
                break;
        }
    }
    const handlePageChanged = (e: any) => {
        searchState.pageNo = e.selected + 1;
        setSearchState({...searchState});
        loadData();
    }

    const handleSort = (field: any, order: any): void => {
        searchState.column = field;
        searchState.order = order;
        setSearchState({...searchState});
        loadData();
    }
    const columns: any[] = [
        {
            text: '用户账号',
            dataField: 'username',
        },
        {
            text: '用户姓名',
            dataField: 'realname',
        },
        {
            text: '头像',
            isDummyField: true,
            formatter: (cell: any, row: any) => {
                return <Image src={row.avatar} roundedCircle={true} width={40} height={40} className={'badge-minimal'}/>;
            }
        },
        {
            text: '性别',
            dataField: 'sex_dictText',
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
                        <a href={'#'} onClick={() => handleOnAction(row, 'restore')}><Circle size={14} style={{marginRight: 5}}/>取回</a>
                        <span className={'divider'}/>
                        <a href={'#'} onClick={() => handleOnAction(row, 'delete')}><X size={14} style={{marginRight: 5}}/>彻底删除</a>
                    </div>
                );
            }
        },
    ]
    const handleOnSearchSubmit = () => {
        //设置分页为1
        setSearchState({...searchState, pageNo: 1});
    }
    const handleOnUsernameChanged = (e: any) => {
        setSearchState({...searchState, roleName: e.target.value});
    }

    return (
        <Modal show={show} onHide={onHide} backdrop={'static'}
               aria-labelledby={'edit-modal'}>
            <Modal.Body>
                <div className={'m-2'}>
                    <Row>
                        <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                            <h4 className="mb-0">用户回收站</h4>
                        </Col>
                        <Col md={6} className={'d-flex align-items-center justify-content-end'}>
                        </Col>
                    </Row>
                </div>

                <BootstrapTable classes={'table-layout-fixed position-relative b-table'} striped hover columns={columns} bootstrap4
                                data={list?.records}
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
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant={'info'}
                    type={'button'}
                    onClick={onHide}
                >
                    取消
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UserTrash;