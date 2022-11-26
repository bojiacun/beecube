import {useEffect, useState} from "react";
import {useFetcher, useLoaderData} from "@remix-run/react";
import {
    DefaultListSearchParams,
    defaultTableExpandRow,
    emptySortFunc, handleResult, handleSaveResult,
    headerSortingClasses,
    PageSizeOptions,
    showDeleteAlert, showToastError,
    showToastSuccess
} from "~/utils/utils";
import {Button, Card, Col, Dropdown, Form, FormControl, FormGroup, FormLabel, InputGroup, Modal, Row} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import {Delete, Edit, MinusSquare, MoreVertical, PlusSquare} from "react-feather";
import ChildPermissionList from "~/pages/system/permissions/ChildPermissionList";
import PermissionEdit from "~/pages/system/permissions/PermissionEdit";
import RuleList from "~/pages/system/permissions/RuleList";


export const MenuTypes = [
    '一级菜单',
    '子菜单',
    '按钮权限'
];

const PermissionList = () => {
    const [list, setList] = useState<any>(useLoaderData());
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams});
    const [editModal, setEditModal] = useState<any>();
    const [selectedPermission, setSelectedPermission] = useState<any>();
    const searchFetcher = useFetcher();
    const deleteFetcher = useFetcher();

    useEffect(() => {
        if (searchFetcher.data) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);
    useEffect(() => {
        if (deleteFetcher.data && deleteFetcher.type === 'done') {
            handleResult(deleteFetcher.data, '删除成功');
            loadData();
        }
    }, [deleteFetcher.state]);

    const loadData = () => {
        searchFetcher.submit(searchState, {method: 'get', action: '/system/permissions'});
    }
    const doDelete = (model:any) => {
        deleteFetcher.submit({id: model.id}, {method: 'delete', action: `/system/permissions/delete?id=${model.id}`, replace: true});
    }

    const handleOnAction = (row: any, e: any) => {
        switch (e) {
            case 'add-child':
                //编辑
                setEditModal({menuType: 1, status: 1, parentId: row.id});
                break;
            case 'edit':
                //编辑
                setEditModal(row);
                break;
            case 'data-rule':
                setSelectedPermission(row);
                break;
            case 'delete':
                //删除按钮
                showDeleteAlert(function () {
                    doDelete(row);
                });
                break;
        }
    }
    const columns: any[] = [
        {
            text: '菜单名称',
            dataField: 'name',
        },
        {
            text: '菜单类型',
            dataField: 'menuType',
            headerStyle: {width: 120},
            formatter: (cell: any, row: any) => {
                return MenuTypes[row.menuType];
            }
        },
        {
            text: '图标',
            dataField: 'icon',
            headerStyle: {width: 300},
            classes: 'text-cut'
        },
        {
            text: '路径',
            dataField: 'url',
            headerStyle: {width: 260},
            classes: 'text-cut'
        },
        {
            text: '权限标识',
            dataField: 'component',
            headerStyle: {width: 260},
            classes: 'text-cut'
        },
        {
            text: '排序',
            dataField: 'sortNo',
            headerStyle: {width: 120},
        },
        {
            text: '操作',
            dataField: 'operation',
            isDummyField: true,
            headerStyle: {width: 180},
            formatter: (cell: any, row: any) => {
                return (
                    <div className={'d-flex align-items-center'}>
                        <a href={'#'} onClick={() => handleOnAction(row, 'edit')}>编辑</a>
                        <span className={'divider'}/>
                        <a href={'#'} onClick={() => handleOnAction(row, 'data-rule')}>数据规则</a>
                        <span className={'divider'}/>
                        <Dropdown as={'span'} onSelect={(e) => handleOnAction(row, e)}>
                            <Dropdown.Toggle as={'span'} className={'noafter'}>
                                <MoreVertical size={16} style={{marginTop: -2}}/>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey={'add-child'}>
                                    <div className={'d-flex align-items-center'}><Edit size={16} className={'mr-1'}/>添加下级</div>
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

    const expandRow = {
        ...defaultTableExpandRow,
        renderer: (row: any) => {
            return (
                <div style={{marginLeft: -1, marginRight: -1, paddingLeft: 57}}>
                    <ChildPermissionList list={row.children} onShowRule={(row:any)=>setSelectedPermission(row)} onEdit={(model:any)=>setEditModal(model)} onDelete={(model:any)=>doDelete(model)} />
                </div>
            );
        },
        nonExpandable: list.filter((x: any) => !x.children || x.children.length == 0).map((x: any) => x.id)
    }
    const handleKeywordChanged = (e: any) => {
        setSearchState({...searchState, keyWord: e.target.value});
    }
    const handleOnSearchSubmit = () => {
        //设置分页为1
        setSearchState({...searchState, pageNo: 1});
    }
    const handleOnAdd = () => {
        setEditModal({status: 1, sortNo: 1, permsType: 1});
    }

    return (
        <>
            <Card>
                <div className={'m-2'}>
                    <Row>
                        <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                            <h4 className="mb-0">菜单管理</h4>
                            <Button className={'ml-1'} onClick={handleOnAdd}><i className={'feather icon-plus'}/>新增菜单</Button>
                        </Col>
                        <Col md={6} className={'d-flex align-items-center justify-content-end'}>
                            <searchFetcher.Form className={'form-inline justify-content-end'} onSubmit={handleOnSearchSubmit}>
                                <FormControl name={'pageNo'} value={1} type={'hidden'}/>
                                <FormControl name={'column'} value={searchState.column} type={'hidden'}/>
                                <FormControl name={'order'} value={searchState.order} type={'hidden'}/>
                                <FormControl name={'pageSize'} value={searchState.pageSize} type={'hidden'}/>

                                <FormGroup as={Form.Row} className={'mb-0'}>
                                    <FormLabel htmlFor={'name'}>菜单名称</FormLabel>
                                    <Col>
                                        <InputGroup>
                                            <FormControl name={'name'} onChange={handleKeywordChanged} placeholder={'请输入要搜索的内容'}/>
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
                    striped hover columns={columns} bootstrap4 data={list}
                    expandRow={expandRow}
                    keyField={'id'}
                />
            </Card>
            {editModal &&  <PermissionEdit menus={list} model={editModal} onHide={()=>{
                loadData();
                setEditModal(null);
            }} /> }
            {selectedPermission && <RuleList show={!!selectedPermission} onHide={()=>{
                loadData();
                setSelectedPermission(null);
            }} selectedPermission={selectedPermission} />}
        </>
    );
}

export default PermissionList;