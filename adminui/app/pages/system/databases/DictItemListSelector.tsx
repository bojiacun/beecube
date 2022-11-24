import {useEffect, useState} from "react";
import {DefaultListSearchParams, defaultSelectRowConfig, handleSaveResult, PageSizeOptions, showDeleteAlert, showToastError} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import {Button, Col, Form, FormControl, FormGroup, FormLabel, InputGroup, Modal, Row} from "react-bootstrap";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import BootstrapTable from "react-bootstrap-table-next";
import SinglePagination from "~/components/pagination/SinglePagination";
import {Field, Formik} from "formik";
import {Form as FormikForm} from "formik";
import classNames from "classnames";
import * as Yup from "yup";


const checkHandlers:any = {};
const DictItemListSelector = (props: any) => {
    const {show, onHide, selectedDict} = props;
    const [list, setList] = useState<any>({records: []});
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams, dictId: selectedDict?.id});
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [editModal, setEditModal] = useState<any>();
    const searchFetcher = useFetcher();
    const editFetcher = useFetcher();
    const deleteFetcher = useFetcher();
    const itemValueCheckFetcher = useFetcher();
    const itemTextCheckFetcher = useFetcher();


    const DictItemSchema = Yup.object().shape({
        itemValue: Yup.string().required().test('item-value', 'not available', (value)=>{
            return new Promise((resolve, reject)=>{
                checkHandlers.itemValue = resolve;
                if(editModal) {
                    itemValueCheckFetcher.load(`/system/databases/items/check?itemValue=${value}&dictId=${selectedDict.id}&id=${editModal.id}`);
                }
                else {
                    itemValueCheckFetcher.load(`/system/databases/items/check?itemValue=${value}&dictId=${selectedDict.id}`);
                }
            });
        }),
        itemText: Yup.string().required().test('item-text', 'not available', (value)=>{
            return new Promise((resolve, reject)=>{
                checkHandlers.itemText = resolve;
                if(editModal) {
                    itemTextCheckFetcher.load(`/system/databases/items/check?itemValue=${value}&dictId=${selectedDict.id}&id=${editModal.id}`);
                }
                else {
                    itemTextCheckFetcher.load(`/system/databases/items/check?itemValue=${value}&dictId=${selectedDict.id}`);
                }
            });
        })
    });
    useEffect(()=>{
        if(itemTextCheckFetcher.type === 'done' && itemTextCheckFetcher.data) {
            checkHandlers.itemText(itemTextCheckFetcher.data.success);
        }
    }, [itemTextCheckFetcher.state]);
    useEffect(()=>{
        if(itemValueCheckFetcher.type === 'done' && itemValueCheckFetcher.data) {
            checkHandlers.itemValue(itemValueCheckFetcher.data.success);
        }
    }, [itemValueCheckFetcher.state]);


    useEffect(() => {
        if (show) {
            searchFetcher.submit(searchState, {method: 'get', action: '/system/databases/items'});
        }
    }, [show]);


    useEffect(() => {
        if (searchFetcher.data) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);

    useEffect(() => {
        if (editFetcher.data && editFetcher.type === 'done') {
            handleSaveResult(editFetcher.data);
            if (editFetcher.data.success) {
                setEditModal(null);
                searchFetcher.submit(searchState, {method: 'get', action: '/system/databases/items'});
            }
        }
    }, [editFetcher.state]);

    useEffect(() => {
        if (deleteFetcher.data && deleteFetcher.type === 'done') {
            handleSaveResult(deleteFetcher.data);
            if (deleteFetcher.data.success) {
                searchFetcher.submit(searchState, {method: 'get', action: '/system/databases/items'});
            }
        }
    }, [deleteFetcher.state]);

    const handlePageChanged = (e: any) => {
        searchState.pageNo = e.selected + 1;
        setSearchState({...searchState});
        searchFetcher.submit(searchState, {method: 'get', action: `/system/databases/items?dictId=${selectedDict?.id}`});
    }

    const handleOnSearchNameChanged = (e: any) => {
        setSearchState({...searchState, itemText: e.target.value});
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
                    deleteFetcher.submit({id: row.id}, {method: 'delete', action: `/system/databases/items/delete?id=${row.id}`, replace: true});
                });
                break;
        }
    }
    const columns: any[] = [
        {
            text: '名称',
            dataField: 'itemText',
        },
        {
            text: '数据值',
            dataField: 'itemValue',
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

    const handleOnEditSubmit = (values: any) => {
        if (values.id) {
            editFetcher.submit(values, {method: 'put', action: `/system/databases/items/edit`, replace: true});
        } else {
            editFetcher.submit(values, {method: 'post', action: `/system/databases/items/add`, replace: true});
        }
    }
    const handleOnAdd = () => {
        setEditModal({status: 1, dictId: selectedDict.id});
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
                    <Modal.Title id={'edit-modal'}>字典列表</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={'m-2'}>
                        <Row>
                            <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                                <Button onClick={handleOnAdd}><i className={'feather icon-plus'} />新建</Button>
                            </Col>
                            <Col md={6} className={'d-flex align-items-center justify-content-end'}>
                                <searchFetcher.Form method={'get'} action={'/system/databases/items'} className={'form-inline justify-content-end'}
                                                    onSubmit={handleOnSearchSubmit}>
                                    <FormControl name={'pageNo'} value={1} type={'hidden'}/>
                                    <FormControl name={'dictId'} value={searchState.dictId} type={'hidden'}/>
                                    <FormControl name={'column'} value={searchState.column} type={'hidden'}/>
                                    <FormControl name={'order'} value={searchState.order} type={'hidden'}/>
                                    <FormControl name={'pageSize'} value={searchState.pageSize} type={'hidden'}/>

                                    <FormGroup as={Form.Row} className={'mb-0'}>
                                        <FormLabel htmlFor={'dictName'}>字典项</FormLabel>
                                        <Col>
                                            <InputGroup>
                                                <FormControl name={'dictName'} autoComplete={'off'} onChange={handleOnSearchNameChanged}
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
            <Modal
                show={!!editModal}
                onHide={() => setEditModal(null)}
                centered
                backdrop={'static'}
                aria-labelledby={'edit-modal'}
            >
                <Modal.Header closeButton>
                    <Modal.Title id={'edit-modal'}>编辑字典项目</Modal.Title>
                </Modal.Header>
                {editModal &&
                    <Formik initialValues={editModal} validationSchema={DictItemSchema} onSubmit={handleOnEditSubmit}>
                        {(formik: any) => {
                            return (
                                <FormikForm>
                                    <Modal.Body>
                                        <FormGroup>
                                            <Form.Label htmlFor={'itemText'}>名称</Form.Label>
                                            <Field className={classNames('form-control', !!formik.errors.itemText? 'is-invalid' : '')} id={'itemText'}
                                                   name={'itemText'} placeholder={'名称'} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Form.Label htmlFor={'itemValue'}>数据值</Form.Label>
                                            <Field className={classNames('form-control', !!formik.errors.itemValue ? 'is-invalid' : '')} id={'itemValue'}
                                                   name={'itemValue'} placeholder={'数据值'}/>
                                        </FormGroup>
                                        <FormGroup>
                                            <Form.Label htmlFor={'description'}>描述</Form.Label>
                                            <Field className={'form-control'} placeholder={'描述'} id={'description'} name={'description'}
                                                   as={'textarea'} rows={3}/>
                                        </FormGroup>
                                        <FormGroup>
                                            <Form.Label htmlFor={'sortOrder'}>排序</Form.Label>
                                            <Field type={'number'} className={classNames('form-control', !!formik.errors.sortOrder? 'is-invalid' : '')} id={'sortOrder'}
                                                   name={'sortOrder'} placeholder={'名称'} />
                                        </FormGroup>
                                        <FormGroup>
                                            <FormLabel htmlFor={'status'}>是否启用</FormLabel>
                                            <Row>
                                                <Col>
                                                    <Form.Check inline value={1} onChange={formik.handleChange} checked={formik.values.status == 1} name={'status'} label={'启用'} id={'status-1'} type={'radio'} />
                                                    <Form.Check inline value={2} onChange={formik.handleChange} checked={formik.values.status == 2} name={'status'} label={'不启用'} id={'status-2'} type={'radio'} />
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button
                                            type={'submit'}
                                            variant={'primary'}
                                            disabled={editFetcher.state === 'submitting'}
                                        >
                                            保存
                                        </Button>
                                    </Modal.Footer>
                                </FormikForm>
                            );
                        }}

                    </Formik>
                }
            </Modal>
        </>
    );
}

export default DictItemListSelector;