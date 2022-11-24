import {useEffect, useState} from "react";
import {DefaultListSearchParams, defaultSelectRowConfig, PageSizeOptions, showToastError} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import {Button, Col, Form, FormControl, FormGroup, FormLabel, InputGroup, Modal, Row} from "react-bootstrap";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import BootstrapTable from "react-bootstrap-table-next";
import SinglePagination from "~/components/pagination/SinglePagination";
import {AwesomeButton} from "react-awesome-button";
import {Plus} from "react-feather";
import RuleEdit from "~/pages/system/permissions/RuleEdit";


const API_LIST = '/system/permissions/rules';

const RuleList = (props: any) => {
    const {show, onHide, selectedPermission} = props;
    const [list, setList] = useState<any>({records: []});
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams, ruleId: selectedPermission.id});
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [editModal, setEditModal] = useState<any>();
    const searchFetcher = useFetcher();
    const editFetcher = useFetcher();


    const loadData = () => {
        searchFetcher.submit(searchState, {method: 'get', action: API_LIST});
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

    const handlePageChanged = (e: any) => {
        searchState.pageNo = e.selected + 1;
        setSearchState({...searchState});
        searchFetcher.submit(searchState, {method: 'get', action: API_LIST});
    }

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
                <Modal.Body>
                    <div className={'m-2'}>
                        <Row>
                            <Col md={4}>
                                <Button onClick={handleOnAdd}><Plus size={16}/>新建</Button>
                            </Col>
                            <Col md={8} className={'d-flex align-items-center justify-content-end'}>
                                <searchFetcher.Form action={'/system/permissions/rules'} className={'form-inline justify-content-end'}
                                                    onSubmit={handleOnSearchSubmit}>
                                    <FormControl name={'pageNo'} value={1} type={'hidden'}/>
                                    <FormControl name={'column'} value={searchState.column} type={'hidden'}/>
                                    <FormControl name={'order'} value={searchState.order} type={'hidden'}/>
                                    <FormControl name={'pageSize'} value={searchState.pageSize} type={'hidden'}/>

                                    <FormGroup as={Form.Row} className={'mb-0'}>
                                        <FormLabel htmlFor={'roleName'}>规则名称</FormLabel>
                                        <FormControl name={'roleName'} autoComplete={'off'} onChange={handleOnRuleNameChanged}
                                                     placeholder={'请输入要搜索的内容'}/>
                                    </FormGroup>

                                    <FormGroup as={Form.Row} className={'mb-0'}>
                                        <FormLabel htmlFor={'roleValue'}>规则值</FormLabel>
                                        <FormControl name={'roleValue'} autoComplete={'off'} onChange={handleOnRuleValueChanged}
                                                     placeholder={'请输入要搜索的内容'}/>
                                    </FormGroup>


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
                        data={list?.records}
                        selectRow={selectRowConfig}
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
            {editModal && <RuleEdit model={editModal} onHide={()=>{
                setEditModal(null);
                loadData();
            }} selectedPermission={selectedPermission} />}
        </>
    );
}

export default RuleList;