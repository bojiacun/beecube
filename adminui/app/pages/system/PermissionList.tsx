import {useEffect, useState} from "react";
import {useFetcher, useLoaderData} from "@remix-run/react";
import {DefaultListSearchParams, defaultTableExpandRow, emptySortFunc, headerSortingClasses, PageSizeOptions, showDeleteAlert} from "~/utils/utils";
import {Button, Card, Col, Dropdown, Form, FormControl, FormGroup, FormLabel, InputGroup, Row} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import {Delete, Edit, MinusSquare, MoreVertical, PlusSquare} from "react-feather";
import ChildPermissionList from "~/pages/system/permissions/ChildPermissionList";


export const MenuTypes = [
    '一级菜单',
    '子菜单',
    '按钮权限'
];

const PermissionList = () => {
    const [list, setList] = useState<any>(useLoaderData());
    const [expanded, setExpanded] = useState<any[]>([]);
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams, logType: 1});
    const [editModal, setEditModal] = useState<any>();
    const searchFetcher = useFetcher();
    const editFetcher = useFetcher();
    const deleteFetcher = useFetcher();

    useEffect(() => {
        if (searchFetcher.data) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);


    const handleOnExpand = (row:any, isExpand:boolean, rowIndex:number) => {
        if(isExpand) {
            setExpanded([...expanded, row.id]);
        }
        else {
            setExpanded(expanded.filter(x=>x !== row.id));
        }
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
                    deleteFetcher.submit({id: row.id}, {method: 'delete', action: `/system/positions/delete?id=${row.id}`, replace: true});
                });
                break;
        }
    }
    const columns: any[] = [
        {
            text: '菜单名称',
            dataField: 'name',
            formatter: (cell:any, row:any)=>{
                if(expanded.includes(row.id)) {
                    //已经展开的行
                    return (
                        <>
                            <MinusSquare size={16} style={{marginRight: 5}} />
                            {row.name}
                        </>
                    );
                }
                else {
                    return (
                        <>
                            <PlusSquare size={16} style={{marginRight: 5}} />
                            {row.name}
                        </>
                    );
                }
            }
        },
        {
            text: '菜单类型',
            dataField: 'menuType',
            headerStyle: {width: 120},
            formatter: (cell:any, row:any)=>{
                return MenuTypes[row.menuType];
            }
        },
        {
            text: '图标',
            dataField: 'icon',
            headerStyle: {width: 260},
            classes: 'text-cut'
        },
        {
            text: '路径',
            dataField: 'url',
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
        renderer: (row:any) => {
            return (
                <div>
                    <ChildPermissionList list={row.children} />
                </div>
            );
        },
        showExpandColumn: false,
        expandByColumnOnly: false,
        onExpand: handleOnExpand,
        expanded: expanded,
    }
    const handleKeywordChanged = (e:any) => {
        setSearchState({...searchState, keyWord: e.target.value});
    }
    const handleOnSearchSubmit = () => {
        //设置分页为1
        setSearchState({...searchState, pageNo: 1});
    }
    return (
        <Card>
            <div className={'m-2'}>
                <Row>
                    <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                        <h4 className="mb-0">菜单管理</h4>
                    </Col>
                    <Col md={6} className={'d-flex align-items-center justify-content-end'}>
                        <searchFetcher.Form className={'form-inline justify-content-end'} onSubmit={handleOnSearchSubmit}>
                            <FormControl name={'pageNo'} value={1} type={'hidden'}/>
                            <FormControl name={'logType'} value={searchState.logType} type={'hidden'}/>
                            <FormControl name={'column'} value={searchState.column} type={'hidden'}/>
                            <FormControl name={'order'} value={searchState.order} type={'hidden'}/>
                            <FormControl name={'pageSize'} value={searchState.pageSize} type={'hidden'}/>

                            <FormGroup as={Form.Row} className={'mb-0'}>
                                <FormLabel htmlFor={'keyWord'}>搜索</FormLabel>
                                <Col>
                                    <InputGroup>
                                        <FormControl name={'keyWord'} onChange={handleKeywordChanged} placeholder={'请输入要搜索的内容'}/>
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
    );
}

export default PermissionList;