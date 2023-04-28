import {useEffect, useState} from "react";
import {useFetcher, useLoaderData} from "@remix-run/react";
import {
    DefaultListSearchParams,
    PageSizeOptions,
    showDeleteAlert,
    showToastError,
    showToastSuccess
} from "~/utils/utils";
import {Badge, Button, Card, Col, Form, FormControl, FormGroup, FormLabel, InputGroup, Modal, Row} from "react-bootstrap";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import BootstrapTable, {ColumnDescription} from "react-bootstrap-table-next";
import SinglePagination from "~/components/pagination/SinglePagination";
import FigureImage from "react-bootstrap/FigureImage";
import ArticleEditor from "~/pages/paimai/ArticleEditor";



export enum ArticleType {
    TEXT_IMAGE = 1,
    VIDEO = 2,
    SERVICES = 3,
}

const ArticleTypeNames:any = {
    '1': '图文类',
    '2': '视频类',
    '3': '服务指南',
}

const ArticleList = (props: any) => {
    const {startPageLoading, stopPageLoading, type} = props;
    const [list, setList] = useState<any>(useLoaderData());
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams});
    const [editModal, setEditModal] = useState<any>();
    const [selectedAuction, setSelectedAuction] = useState<any>();
    const [selectedRows, setSelectedRows] = useState<any>([]);
    const [operateValue, setOperateValue] = useState<any>();
    const [performanceListShow, setPerformanceListShow] = useState<boolean>(false);
    const [selectedListShow, setSelectedListShow] = useState<boolean>(false);
    const searchFetcher = useFetcher();
    const editFetcher = useFetcher();
    const deleteFetcher = useFetcher();

    const loadData = () => {
        searchFetcher.submit(searchState, {method: 'get'});
    }

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
                showToastSuccess('操作成功');
                searchFetcher.submit(searchState, {method: 'get'});
            } else {
                showToastError(deleteFetcher.data.message);
            }
        }
    }, [deleteFetcher.state]);

    const handleOnAction = (row: any, e: any) => {
        switch (e) {
            case 'selected':
                setSelectedAuction(row);
                setSelectedListShow(true);
                break;
            case 'select':
                setSelectedAuction(row);
                setPerformanceListShow(true);
                break;
            case 'edit':
                //编辑
                setEditModal(row);
                break;
            case 'delete':
                //删除按钮
                showDeleteAlert(function () {
                    startPageLoading();
                    deleteFetcher.submit({id: row.id}, {method: 'delete', action: `/paimai/articles/delete?id=${row.id}`, replace: true});
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
            text: '文章ID',
            dataField: 'id',
        },
        {
            text: '文章标题',
            dataField: 'title',
        },
        // {
        //     text: '外部链接',
        //     dataField: 'outerLink',
        // },
        {
            text: '列表封面图',
            dataField: '',
            isDummyField: true,
            formatter: (cell:any, row:any) => {
                let previewUrl = row.preview;
                return <FigureImage src={previewUrl} style={{width: 60, height: 60}} />
            }
        },
        {
            text: '首页封面图',
            dataField: '',
            isDummyField: true,
            formatter: (cell:any, row:any) => {
                let previewUrl = row.preview2;
                return <FigureImage src={previewUrl} style={{width: 60, height: 60}} />
            }
        },
        {
            text: '视频地址',
            dataField: '',
            isDummyField: true,
            hidden: type == 1,
            style: {wordBreak: 'break-all'},
            formatter: (cell:any, row:any) => {
                let previewUrl = row.video;
                return <a href={previewUrl}>{previewUrl}</a>
            }
        },
        {
            text: '创建时间',
            dataField: 'createTime',
        },
        {
            text: '精选',
            dataField: 'postFlag',
            formatter(cell:number, row: any) {
                if(row.postFlag == 0) {
                    return <Badge variant={'light'}>否</Badge>
                }
                else if(row.postFlag == 1) {
                    return <Badge variant={'success'}>是</Badge>
                }
                return <Badge variant={'dark'}>未知</Badge>
            }
        },
        {
            text: '显示状态',
            dataField: 'status_dictText',
            formatter(cell:number, row: any) {
                if(row.status == 0) {
                    return <Badge variant={'light'}>{row.status_dictText}</Badge>
                }
                else if(row.status == 1) {
                    return <Badge variant={'success'}>{row.status_dictText}</Badge>
                }
                return <Badge variant={'dark'}>未知</Badge>
            }
        },
        {
            text: '操作',
            dataField: 'operation',
            headerStyle: {width: 300},
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

    const handleOnAdd = () => {
        setEditModal({});
    }


    const handleOnOperateValueChanged = (newValue:any) => {
        setOperateValue(newValue.value);
    }
    let handleOnSelect = (row:any, isSelect:boolean) => {
        if (isSelect) {
            setSelectedRows([...selectedRows, row.id]);
        } else {
            setSelectedRows(selectedRows.filter((x:string)=> x !== row.id));
        }
    }

    let handleOnSelectAll = (isSelect:boolean, rows:any) => {
        const ids = rows.map((r:any) => r.id);
        if (isSelect) {
            setSelectedRows(ids);
        } else {
            setSelectedRows([]);
        }
    }
    const selectedRowConfig:any = {
        mode: 'checkbox',
        clickToSelect: true,
        onSelect: handleOnSelect,
        onSelectAll: handleOnSelectAll,
    }
    const operateBatch = () => {
        deleteFetcher.submit({status: operateValue, rows: selectedRows.join(',')}, {method: 'delete', action: `/paimai/articles/toggle-show`, replace: true});
    }

    return (
        <>
            <Card>
                <div className={'m-2'}>
                    <Row>
                        <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                            <h4 className="mb-0">{ArticleTypeNames[type]}文章管理</h4>
                            <ReactSelectThemed
                                id={'role-page-size'}
                                placeholder={'分页大小'}
                                isSearchable={false}
                                defaultValue={PageSizeOptions[0]}
                                options={PageSizeOptions}
                                className={'per-page-selector d-inline-block ml-50 mr-1'}
                                onChange={handlePageSizeChanged}
                            />
                            <Button onClick={handleOnAdd}><i className={'feather icon-plus'} />新建{ArticleTypeNames[type]}文章</Button>
                        </Col>
                        <Col md={6} className={'d-flex align-items-center justify-content-end'}>
                            <searchFetcher.Form className={'form-inline justify-content-end'} onSubmit={handleOnSearchSubmit}>
                                <FormControl name={'pageNo'} value={1} type={'hidden'}/>
                                <FormControl name={'type'} value={type} type={'hidden'}/>
                                <FormControl name={'column'} value={searchState.column} type={'hidden'}/>
                                <FormControl name={'order'} value={searchState.order} type={'hidden'}/>
                                <FormControl name={'pageSize'} value={searchState.pageSize} type={'hidden'}/>

                                <FormGroup as={Form.Row} className={'mb-0'}>
                                    <FormLabel htmlFor={'title'}>文章标题</FormLabel>
                                    <Col>
                                        <InputGroup>
                                            <FormControl name={'title'} onChange={handleOnNameChanged} placeholder={'请输入要搜索的内容'}/>
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
                                selectRow={selectedRowConfig}
                                keyField={'id'}/>


                <div className={'mx-2 mb-2 mt-1'}>
                    <Row>
                        <Col sm={6} className={'d-flex align-items-center justify-content-center justify-content-sm-start'}>
                            <ReactSelectThemed
                                id={'operate-buyout'}
                                placeholder={'操作方式'}
                                isSearchable={false}
                                options={[{label: '下架', value: '0'}, {label:'上架', value:'1'}]}
                                className={'per-page-selector d-inline-block ml-50 mr-1'}
                                onChange={handleOnOperateValueChanged}
                            />
                            <Button className={'btn btn-danger'} disabled={selectedRows.length == 0 || !operateValue} onClick={operateBatch}><i className={'feather icon-trash'}/>批量操作</Button>
                        </Col>
                        <Col sm={6} className={'d-flex align-items-center justify-content-center justify-content-sm-end'}>
                        <span className="text-muted mr-2">共 {list?.total} 条记录 显示 {(list?.current - 1) * list.size + 1} 至 {list?.current * list.size > list.total ? list.total : list?.current * list.size} 条</span>
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
            {editModal && <ArticleEditor type={type} model={editModal} onHide={()=>{
                setEditModal(null);
                loadData();
            }} />}
        </>
    );
}

export default ArticleList;