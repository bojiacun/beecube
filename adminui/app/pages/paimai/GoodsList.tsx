import {useEffect, useState} from "react";
import {useFetcher, useLoaderData} from "@remix-run/react";
import {
    DefaultListSearchParams,
    emptySortFunc,
    headerSortingClasses,
    PageSizeOptions,
    showDeleteAlert,
    showToastError,
    showToastSuccess
} from "~/utils/utils";
import {Button, Card, Col, Dropdown, Form, FormControl, FormGroup, FormLabel, InputGroup, Modal, Row} from "react-bootstrap";
import {Delete, Edit, MoreVertical, Plus, Shield} from "react-feather";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import BootstrapTable, {ColumnDescription} from "react-bootstrap-table-next";
import SinglePagination from "~/components/pagination/SinglePagination";
import {Field, Formik, Form as FormikForm} from "formik";
import classNames from "classnames";
import {AwesomeButton} from "react-awesome-button";
import * as Yup from "yup";
import TreePermissionList from "~/pages/system/roles/TreePermissionList";
import BootstrapSelect from "~/components/form/BootstrapSelect";
import FallbackImage from "~/components/fallback-image";


const POST_RANKS = [
    {label: '员级', value: '1'},
    {label: '助级', value: '2'},
    {label: '中级', value: '3'},
    {label: '副高级', value: '4'},
    {label: '正高级', value: '5'},
];

const EditRoleSchema = Yup.object().shape({
    code: Yup.string().required(),
    name: Yup.string().required()
});
const GoodsList = (props: any) => {
    const {startPageLoading, stopPageLoading} = props;
    const [list, setList] = useState<any>(useLoaderData());
    const [searchState, setSearchState] = useState<any>(DefaultListSearchParams);
    const [editModal, setEditModal] = useState<any>();
    const searchFetcher = useFetcher();
    const editFetcher = useFetcher();
    const deleteFetcher = useFetcher();

    useEffect(() => {
        if (searchFetcher.data) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);

    useEffect(() => {
        if (editFetcher.data && editFetcher.type === 'done') {
            if (editFetcher.data.success) {
                showToastSuccess(editModal.id ? '修改成功' : '新建成功');
                searchFetcher.submit(searchState, {method: 'get'});
                setEditModal(null);
            } else {
                showToastError(editFetcher.data.message);
            }
        }
    }, [editFetcher.state]);
    useEffect(() => {
        if (deleteFetcher.data && deleteFetcher.type === 'done') {
            if (deleteFetcher.data.success) {
                stopPageLoading();
                showToastSuccess('删除成功');
                searchFetcher.submit(searchState, {method: 'get'});
            } else {
                showToastError(deleteFetcher.data.message);
            }
        }
    }, [deleteFetcher.state]);

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
                    deleteFetcher.submit({id: row.id}, {method: 'delete', action: `/system/positions/delete?id=${row.id}`, replace: true});
                });
                break;
        }
    }
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

    const columns: ColumnDescription[] = [
        {
            text: '拍品名称',
            dataField: 'title',
        },
        {
            text: '预览图',
            dataField: '',
            isDummyField: true,
            formatter: (cell:any, row:any) => {
                let previewUrl = row.images.split(',')[0];
                return <FallbackImage  href={previewUrl} style={{width: 100, height: 100}} />
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
                        <a href={'#'} onClick={() => handleOnAction(row, 'delete')}>删除</a>
                    </div>
                );
            }
        },
    ]
    const handleOnSearchSubmit = () => {
        //设置分页为1
        setSearchState({...searchState, pageNo: 1});
    }
    const handleOnNameChanged = (e: any) => {
        setSearchState({...searchState, roleName: e.target.value});
    }
    const handleOnEditSubmit = (values: any) => {
        if (values.id) {
            editFetcher.submit(values, {method: 'put', action: `/system/positions/edit`, replace: true});
        } else {
            editFetcher.submit(values, {method: 'post', action: `/system/positions/add`, replace: true});
        }
    }
    const handleOnAdd = () => {
        setEditModal({});
    }
    return (
        <>
            <Card>
                <div className={'m-2'}>
                    <Row>
                        <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                            <h4 className="mb-0">拍品管理</h4>
                            <ReactSelectThemed
                                id={'role-page-size'}
                                placeholder={'分页大小'}
                                isSearchable={false}
                                defaultValue={PageSizeOptions[0]}
                                options={PageSizeOptions}
                                className={'per-page-selector d-inline-block ml-50 mr-1'}
                                onChange={handlePageSizeChanged}
                            />
                            <Button onClick={handleOnAdd}><i className={'feather icon-plus'} />新建拍品</Button>
                        </Col>
                        <Col md={6} className={'d-flex align-items-center justify-content-end'}>
                            <searchFetcher.Form className={'form-inline justify-content-end'} onSubmit={handleOnSearchSubmit}>
                                <FormControl name={'pageNo'} value={1} type={'hidden'}/>
                                <FormControl name={'column'} value={searchState.column} type={'hidden'}/>
                                <FormControl name={'order'} value={searchState.order} type={'hidden'}/>
                                <FormControl name={'pageSize'} value={searchState.pageSize} type={'hidden'}/>

                                <FormGroup as={Form.Row} className={'mb-0'}>
                                    <FormLabel htmlFor={'name'}>拍品名称</FormLabel>
                                    <Col>
                                        <InputGroup>
                                            <FormControl name={'name'} onChange={handleOnNameChanged} placeholder={'请输入要搜索的内容'}/>
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

            </Card>

            <Modal
                show={!!editModal}
                onHide={() => setEditModal(null)}
                centered
                backdrop={'static'}
                aria-labelledby={'edit-modal'}
            >
                <Modal.Header closeButton>
                    <Modal.Title id={'edit-modal'}>编辑职务</Modal.Title>
                </Modal.Header>
                {editModal &&
                    <Formik initialValues={editModal} validationSchema={EditRoleSchema} onSubmit={handleOnEditSubmit}>
                        {(formik:any) => {
                            return (
                                <FormikForm>
                                    <Modal.Body>
                                        <FormGroup>
                                            <Form.Label htmlFor={'code'}>职务编码</Form.Label>
                                            <Field className={classNames('form-control', !!formik.errors.code ? 'is-invalid' : '')} id={'roleCode'}
                                                   name={'code'} placeholder={'职务编码'} readOnly={editModal.id}/>
                                        </FormGroup>
                                        <FormGroup>
                                            <Form.Label htmlFor={'name'}>职务名称</Form.Label>
                                            <Field className={classNames('form-control', !!formik.errors.name ? 'is-invalid' : '')} id={'roleName'}
                                                   name={'name'} placeholder={'职务名称'}/>
                                        </FormGroup>
                                        <BootstrapSelect name={'postRank'} label={'职务等级'} options={POST_RANKS} formik={formik} />
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

export default GoodsList;