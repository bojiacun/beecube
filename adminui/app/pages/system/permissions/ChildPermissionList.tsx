import {useEffect, useState} from "react";
import {useFetcher, useLoaderData} from "@remix-run/react";
import {DefaultListSearchParams, defaultTableExpandRow, emptySortFunc, headerSortingClasses, PageSizeOptions, showDeleteAlert} from "~/utils/utils";
import {Button, Col, Dropdown, Form, FormControl, FormGroup, FormLabel, InputGroup, Row} from "react-bootstrap";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import BootstrapTable from "react-bootstrap-table-next";
import SinglePagination from "~/components/pagination/SinglePagination";
import {Delete, Edit, MoreVertical} from "react-feather";
import {MenuTypes} from "~/pages/system/PermissionList";


const ChildPermissionList = (props: any) => {
    const {list} = props;


    const handleOnAction = (row: any, e: any) => {
        switch (e) {
            case 'edit':
                //编辑
                break;
            case 'delete':
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
        renderer: (row: any) => {
            return (
                <div></div>
            );
        },
        showExpandColumn: false,
        expandByColumnOnly: false,
    }

    return (
        <BootstrapTable
            classes={'table-layout-fixed position-relative b-table'}
            striped hover columns={columns} bootstrap4 data={list}
            expandRow={expandRow}
            keyField={'id'}
        />
    );
}

export default ChildPermissionList;