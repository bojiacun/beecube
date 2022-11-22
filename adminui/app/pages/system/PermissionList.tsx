import {useEffect, useState} from "react";
import {useFetcher, useLoaderData} from "@remix-run/react";
import {DefaultListSearchParams, defaultTableExpandRow, emptySortFunc, headerSortingClasses, PageSizeOptions, showDeleteAlert} from "~/utils/utils";
import {Button, Col, Dropdown, Form, FormControl, FormGroup, FormLabel, InputGroup, Row} from "react-bootstrap";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import BootstrapTable from "react-bootstrap-table-next";
import SinglePagination from "~/components/pagination/SinglePagination";
import {Delete, Edit, MoreVertical} from "react-feather";
import ChildPermissionList from "~/pages/system/permissions/ChildPermissionList";


const PermissionList = () => {
    const [list, setList] = useState<any>(useLoaderData());
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams, logType: 1});
    const [editModal, setEditModal] = useState<any>();
    const searchFetcher = useFetcher();
    const editFetcher = useFetcher();
    const deleteFetcher = useFetcher();

    useEffect(() => {
        if (searchFetcher.data) {
            // setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);


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
        },
        {
            text: '菜单类型',
            dataField: 'menuType',
        },
        {
            text: '图标',
            dataField: 'icon',
        },
        {
            text: '组件',
            dataField: 'component',
        },
        {
            text: '路径',
            dataField: 'url',
        },
        {
            text: '排序',
            dataField: 'sortNo',
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

                </div>
            );
        },
    }
    const handleKeywordChanged = (e:any) => {
        setSearchState({...searchState, keyWord: e.target.value});
    }
    const handleOnSearchSubmit = () => {
        //设置分页为1
        setSearchState({...searchState, pageNo: 1});
    }
    return (
        <>
            <div className={'m-2'}>
                <Row>
                    <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                        <h4 className="mb-0">菜单管理</h4>
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
                striped hover columns={columns} bootstrap4 data={list?.records}
                keyField={'id'}
            />


            <div className={'mx-2 mb-2 mt-1'}>
                <Row>
                    <Col sm={6} className={'d-flex align-items-center justify-content-center justify-content-sm-start'}>
                        <span
                            className="text-muted">共 {list?.total} 条记录 显示 {(list?.current - 1) * list?.size + 1} 至 {list?.current * list?.size > list?.total ? list?.total : list?.current * list?.size} 条</span>
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

        </>
    );
}

export default PermissionList;