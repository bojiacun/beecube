import {useEffect, useState} from "react";
import {DefaultListSearchParams, defaultSelectRowConfig, FetcherState, getFetcherState, showDeleteAlert, showToastError, showToastSuccess} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import {Button, Col, FormControl, FormGroup, FormLabel, InputGroup, Modal, Row} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import SinglePagination from "~/components/pagination/SinglePagination";
import ModuleMenuEditor from "~/pages/paimai/ModuleMenuEditor";


const LIST_URL = '/app/module/menus';
const DELETE_URL = '/app/module/menus/delete';

const ModuleMenuList = (props: any) => {
    const {show, onHide, selectedRoom, startPageLoading, stopPageLoading} = props;
    const [list, setList] = useState<any>({records: []});
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams, moduleId: selectedRoom?.id});
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [editModal, setEditModal] = useState<any>();
    const searchFetcher = useFetcher();
    const deleteFetcher = useFetcher();

    useEffect(() => {
        if (show && selectedRoom) {
            searchFetcher.submit(searchState, {method: 'get', action: LIST_URL});
        }
    }, [show, selectedRoom]);


    useEffect(() => {
        if (getFetcherState(searchFetcher) === FetcherState.DONE) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);

    useEffect(() => {
        if (getFetcherState(searchFetcher) === FetcherState.DONE) {
            if (deleteFetcher.data.success) {
                showToastSuccess('删除成功');
                searchFetcher.submit(searchState, {method: 'get', action: LIST_URL});
            } else {
                showToastError(deleteFetcher.data.message);
            }
            stopPageLoading();
        }
    }, [deleteFetcher.state]);

    const handlePageChanged = (e: any) => {
        searchState.pageNo = e.selected + 1;
        setSearchState({...searchState});
        searchFetcher.submit(searchState, {method: 'get', action: LIST_URL});
    }
    const handlePageSizeChanged = (newValue: any) => {
        searchState.pageSize = parseInt(newValue.value);
        setSearchState({...searchState});
        searchFetcher.submit(searchState, {method: 'get', action: LIST_URL});
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
                setEditModal(row);
                break;
            case 'delete':
                //删除按钮
                showDeleteAlert(function () {
                    startPageLoading();
                    deleteFetcher.submit({id: row.id}, {method: 'delete', action: `${DELETE_URL}?id=${row.id}`, replace: true});
                });
                break;
        }
    }
    const columns: any[] = [
        {
            text: '模块ID',
            dataField: 'moduleId',
        },
        {
            text: '模块名称',
            dataField: 'moduleName',
        },
        {
            text: '权限ID',
            dataField: 'menuId',
        },
        {
            text: '权限名称',
            dataField: 'menuName',
        },
        {
            text: '操作',
            dataField: 'operation',
            headerStyle: {width: 300},
            formatter: (cell: any, row: any) => {
                return (
                    <div className={'d-flex align-items-center'}>
                        {row.state == 0 && <a href={'#'} onClick={() => handleOnAction(row, 'edit')}>编辑</a>}
                        {row.state == 1  && <a href={'#'} onClick={() => handleOnAction(row, 'delete')}>删除</a>}
                    </div>
                );
            },

        },
    ]

    const handleOnRowSelect = (row: any, isSelect: boolean) => {
        if (isSelect) {
            setSelectedRows([...selectedRows, row.id])
        } else {
            let selected = selectedRows.filter(x => x !== row.id);
            setSelectedRows([...selected]);
        }
    }
    const handleOnRowSelectAll = (isSelect: boolean, rows: any[]) => {
        if (isSelect) {
            setSelectedRows([...rows.map(x => x.id)]);
        } else {
            setSelectedRows([]);
        }
    }
    const selectRowConfig = {
        ...defaultSelectRowConfig,
        onSelect: handleOnRowSelect,
        onSelectAll: handleOnRowSelectAll,
    }
    const handleOnAdd = () => {
        setEditModal({});
    }

    return (
        <>
            <Modal
                show={show}
                onHide={() => onHide(false)}
                centered
                backdrop={'static'}
                aria-labelledby={'edit-modal'}
            >
                <Modal.Header closeButton>
                    <Modal.Title id={'edit-modal'}> 模块【{selectedRoom?.name }】权限</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={'m-2'}>
                        <Row>
                            <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                                <Button onClick={handleOnAdd}><i className={'feather icon-plus'}/>新建权限</Button>
                            </Col>
                            <Col md={6} className={'d-flex align-items-center justify-content-end'}>
                                <searchFetcher.Form action={LIST_URL} className={'form-inline justify-content-end'}
                                                    onSubmit={handleOnSearchSubmit}>
                                    <FormControl name={'pageNo'} value={1} type={'hidden'}/>
                                    <FormControl name={'room_id'} value={selectedRoom?.id} type={'hidden'}/>
                                    <FormControl name={'column'} value={searchState.column} type={'hidden'}/>
                                    <FormControl name={'order'} value={searchState.order} type={'hidden'}/>
                                    <FormControl name={'pageSize'} value={searchState.pageSize} type={'hidden'}/>

                                    <FormGroup as={Row} className={'mb-0'}>
                                        <FormLabel column htmlFor={'menuId'}>菜单ID</FormLabel>
                                        <Col md={'auto'}>
                                            <InputGroup>
                                                <FormControl name={'menuId'} autoComplete={'off'} onChange={handleOnSearchNameChanged}
                                                             placeholder={'请输入要搜索的内容'}/>
                                                <Button type={'submit'}>搜索</Button>
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
                </Modal.Body>
            </Modal>
            {editModal && <ModuleMenuEditor model={editModal} selectedRoom={selectedRoom} onHide={()=>{
                setEditModal(null);
                searchFetcher.submit(searchState, {method: 'get', action: LIST_URL});
            }} />}
        </>
    );
}

export default ModuleMenuList;