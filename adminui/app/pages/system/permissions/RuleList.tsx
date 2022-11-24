import {useEffect, useState} from "react";
import {DefaultListSearchParams, defaultSelectRowConfig, handleResult, PageSizeOptions, showDeleteAlert, showToastError} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import {Button, Col, Dropdown, Form, FormControl, FormGroup, FormLabel, InputGroup, Modal, Row} from "react-bootstrap";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import BootstrapTable from "react-bootstrap-table-next";
import SinglePagination from "~/components/pagination/SinglePagination";
import {AwesomeButton} from "react-awesome-button";
import {Delete, Edit, MoreVertical, Plus} from "react-feather";
import RuleEdit from "~/pages/system/permissions/RuleEdit";


const API_LIST = '/system/permissions/rules';

const RuleList = (props: any) => {
    const {show, onHide, selectedPermission} = props;
    const [list, setList] = useState<any>([]);
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams, permissionId: selectedPermission.id});
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [editModal, setEditModal] = useState<any>();
    const searchFetcher = useFetcher();
    const editFetcher = useFetcher();
    const deleteFetcher = useFetcher();

    useEffect(() => {
        if (deleteFetcher.data && deleteFetcher.type === 'done') {
            handleResult(deleteFetcher.data, '删除成功');
            loadData();
        }
    }, [deleteFetcher.state]);
    const loadData = () => {
        searchFetcher.submit(searchState, {method: 'get', action: API_LIST});
    }
    const doDelete = (model:any) => {
        deleteFetcher.submit({id: model.id}, {method: 'delete', action: `/system/permissions/rules/delete?id=${model.id}`, replace: true});
    }
    useEffect(() => {
        if (show) {
            loadData();
        }
    }, [show]);


    useEffect(() => {
        if (searchFetcher.data) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);

    useEffect(() => {
        if (editFetcher.data && editFetcher.type === 'done') {
            if (editFetcher.data.success) {
                onHide();
            } else {
                showToastError(editFetcher.data.message);
            }
        }
    }, [editFetcher.state]);


    const handleOnRuleNameChanged = (e: any) => {
        setSearchState({...searchState, ruleName: e.target.value});
    }
    const handleOnRuleValueChanged = (e: any) => {
        setSearchState({...searchState, ruleValue: e.target.value});
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
                    doDelete(row);
                });
                break;
        }
    }
    const columns: any[] = [
        {
            text: '规则名称',
            dataField: 'ruleName',
        },
        {
            text: '规则字段',
            dataField: 'ruleColumn',
        },
        {
            text: '规则值',
            dataField: 'ruleValue',
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
                        <a href={'#'} onClick={() => handleOnAction(row, 'delete')}>删除</a>
                    </div>
                );
            }
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
    const handleOnAdd = () => {
        setEditModal({});
    }


    const selectRowConfig = {
        ...defaultSelectRowConfig,
        onSelect: handleOnRowSelect,
        onSelectAll: handleOnRowSelectAll,
    }

    return (
        <>
            <Modal
                show={show}
                size={'lg'}
                onHide={() => onHide()}
                centered
                backdrop={'static'}
                aria-labelledby={'edit-modal'}
            >
                <Modal.Header closeButton>
                    <Modal.Title id={'edit-modal'}>数据权限规则</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{maxHeight: 'calc(100vh - 200px)'}}>
                    <div className={'m-2'}>
                        <Row>
                            <Col md={2}>
                                <Button onClick={handleOnAdd}><Plus size={16}/>新建</Button>
                            </Col>
                            <Col md={10} className={'d-flex align-items-center justify-content-end'}>
                                <searchFetcher.Form action={'/system/permissions/rules'} className={'form-inline justify-content-end'}
                                                    onSubmit={handleOnSearchSubmit}>
                                    <FormControl name={'pageNo'} value={1} type={'hidden'}/>
                                    <FormControl name={'column'} value={searchState.column} type={'hidden'}/>
                                    <FormControl name={'order'} value={searchState.order} type={'hidden'}/>
                                    <FormControl name={'pageSize'} value={searchState.pageSize} type={'hidden'}/>

                                    <FormLabel htmlFor={'roleName'} className={'mr-1'}>规则名称</FormLabel>
                                    <FormControl name={'roleName'} className={'mr-1'} style={{maxWidth: 120}} autoComplete={'off'} onChange={handleOnRuleNameChanged}
                                                 placeholder={'请输入要搜索的内容'}/>

                                    <FormLabel htmlFor={'roleValue'} className={'mr-1'}>规则值</FormLabel>
                                    <FormControl name={'roleValue'} className={'mr-1'} style={{maxWidth: 120}} autoComplete={'off'} onChange={handleOnRuleValueChanged}
                                                 placeholder={'请输入要搜索的内容'}/>


                                    <Button type={'submit'}>搜索</Button>
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
                        data={list || []}
                        selectRow={selectRowConfig}
                        keyField={'id'}
                    />

                </Modal.Body>
            </Modal>
            {editModal && <RuleEdit model={editModal} onHide={() => {
                setEditModal(null);
                loadData();
            }} selectedPermission={selectedPermission}/>}
        </>
    );
}

export default RuleList;