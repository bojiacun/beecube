import {useEffect, useState} from "react";
import {useFetcher, useLoaderData} from "@remix-run/react";
import {
    DefaultListSearchParams,
    PageSizeOptions,
    showDeleteAlert,
    showToastError,
    showToastSuccess
} from "~/utils/utils";
import {Badge, Button, Card, Col, Dropdown, Form, FormControl, FormGroup, FormLabel, InputGroup, Modal, Row} from "react-bootstrap";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import BootstrapTable, {ColumnDescription} from "react-bootstrap-table-next";
import SinglePagination from "~/components/pagination/SinglePagination";
import FigureImage from "react-bootstrap/FigureImage";
import PerformanceEditor from "~/pages/paimai/PerformanceEditor";
import GoodsListSelected from "~/pages/paimai/GoodsListSelected";
import {Delete, Edit, Eye, MoreVertical} from "react-feather";
import PerformanceDepositList from "~/pages/paimai/PerformanceDepositList";
import moment from "moment";




const PerformanceList = (props: any) => {
    const {startPageLoading, stopPageLoading, type} = props;
    const [list, setList] = useState<any>(useLoaderData());
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams, type: type});
    const [editModal, setEditModal] = useState<any>();
    const [selectedPerformance, setSelectedPerformance] = useState<any>();
    const [selectedRow, setSelectedRow] = useState<any>();
    const [depositsShow, setDepositsShow] = useState<boolean>(false);
    const [selectedListShow, setSelectedListShow] = useState<boolean>(false);
    const searchFetcher = useFetcher();
    const editFetcher = useFetcher();
    const deleteFetcher = useFetcher();
    const controlFetcher = useFetcher();

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
                showToastSuccess('删除成功');
                searchFetcher.submit(searchState, {method: 'get'});
            } else {
                showToastError(deleteFetcher.data.message);
            }
        }
    }, [deleteFetcher.state]);


    useEffect(() => {
        if (controlFetcher.data && controlFetcher.type === 'done') {
            if (controlFetcher.data.success) {
                stopPageLoading();
                showToastSuccess('设置成功');
                searchFetcher.submit(searchState, {method: 'get'});
            } else {
                showToastError(controlFetcher.data.message);
            }
        }
    }, [controlFetcher.state]);
    const handleOnAction = (row: any, e: any) => {
        switch (e) {
            case 'start':
                //编辑
                showDeleteAlert(function () {
                    controlFetcher.submit({}, {method: 'put', action: `/paimai/performances/start?id=${row.id}`, replace: true});
                }, '确定要开始本场拍卖吗？', '确认开始');
                break;
            case 'end':
                showDeleteAlert(function () {
                    controlFetcher.submit({}, {method: 'put', action: `/paimai/performances/end?id=${row.id}`, replace: true});
                }, '确定要结束本场拍卖吗？', '确认结束');
                break;
            case 'selected':
                setSelectedPerformance(row);
                setSelectedListShow(true);
                break;
            case 'deposits':
                setSelectedRow(row);
                setDepositsShow(true);
                break;
            case 'edit':
                //编辑
                setEditModal(row);
                break;
            case 'delete':
                //删除按钮
                showDeleteAlert(function () {
                    startPageLoading();
                    deleteFetcher.submit({id: row.id}, {method: 'delete', action: `/paimai/performances/delete?id=${row.id}`, replace: true});
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
            text: 'ID',
            dataField: 'id',
        },
        {
            text: '排序',
            dataField: 'sortNum',
        },
        {
            text: '专场名称',
            dataField: 'title',
        },
        {
            text: '预览图',
            dataField: '',
            isDummyField: true,
            formatter: (cell:any, row:any) => {
                let previewUrl = row.preview;
                return <FigureImage src={previewUrl} style={{width: 60, height: 60}} />
            }
        },
        {
            text: '保证金',
            dataField: 'deposit',
        },
        {
            text: '标签',
            dataField: 'tags',
        },
        {
            text: '拍品数',
            dataField: 'goodsCount',
        },
        {
            text: '开拍时间',
            dataField: 'startTime',
        },
        {
            text: '结束时间',
            dataField: 'endTime',
            hidden: type == 2
        },
        {
            text: '运行状态',
            dataField: '',
            isDummyField: true,
            hidden: type == 2,
            formatter(cell:number, row: any) {
                let nowTime = moment();
                if(moment(row.startTime).isAfter(nowTime)) {
                    return <Badge variant={'light'}>未开始</Badge>
                }
                else if(moment(row.startTime).isBefore(nowTime) && moment(row.endTime).isAfter(nowTime)) {
                    return <Badge variant={'success'}>进行中</Badge>
                }
                else if(moment(row.endTime).isBefore(nowTime)) {
                    return <Badge variant={'dark'}>已结束</Badge>
                }
                return <Badge variant={'dark'}>未知</Badge>
            }
        },
        {
            text: '同步状态',
            dataField: '',
            isDummyField: true,
            hidden: type == 1,
            formatter(cell:number, row: any) {
                if(row.state == 0) {
                    return <Badge variant={'light'}>{row.state_dictText}</Badge>
                }
                else if(row.state == 1) {
                    return <Badge variant={'success'}>{row.state_dictText}</Badge>
                }
                else if(row.state == 2) {
                    return <Badge variant={'dark'}>{row.state_dictText}</Badge>
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
                        <a href={'#'} onClick={() => handleOnAction(row, 'selected')}>拍品管理</a>
                        <span className={'divider'}/>
                        {type == 2 && <>
                            {row.state == 0&&<a href={'#'} onClick={() => handleOnAction(row, 'start')}>开始</a>}
                            {row.state == 1 && <a href={'#'} onClick={() => handleOnAction(row, 'end')}>结束</a>}
                            <span className={'divider'}/>
                        </>}
                        <Dropdown as={'span'} onSelect={(e) => handleOnAction(row, e)}>
                            <Dropdown.Toggle as={'span'} className={'noafter'}>
                                <MoreVertical size={16} style={{marginTop: -2}}/>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey={'deposits'}>
                                    <div className={'d-flex align-items-center'}><Eye size={16} className={'mr-1'}/>保证金记录</div>
                                </Dropdown.Item>
                                <Dropdown.Item eventKey={'edit'}>
                                    <div className={'d-flex align-items-center'}><Edit size={16} className={'mr-1'}/>编辑</div>
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
    let titleText;
    switch (type) {
        case 1:
            titleText = '限时拍';
            break;
        case 2:
            titleText = '同步拍';
            break;
        case 3:
            titleText = '公益拍';
            break;
    }
    return (
        <>
            <Card>
                <div className={'m-2'}>
                    <Row>
                        <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                            <h4 className="mb-0">{titleText}专场管理</h4>
                            <ReactSelectThemed
                                id={'role-page-size'}
                                placeholder={'分页大小'}
                                isSearchable={false}
                                defaultValue={PageSizeOptions[0]}
                                options={PageSizeOptions}
                                className={'per-page-selector d-inline-block ml-50 mr-1'}
                                onChange={handlePageSizeChanged}
                            />
                            <Button onClick={handleOnAdd}><i className={'feather icon-plus'} />新建{titleText}专场</Button>
                        </Col>
                        <Col md={6} className={'d-flex align-items-center justify-content-end'}>
                            <searchFetcher.Form className={'form-inline justify-content-end'} onSubmit={handleOnSearchSubmit}>
                                <FormControl name={'pageNo'} value={1} type={'hidden'}/>
                                <FormControl name={'column'} value={searchState.column} type={'hidden'}/>
                                <FormControl name={'order'} value={searchState.order} type={'hidden'}/>
                                <FormControl name={'pageSize'} value={searchState.pageSize} type={'hidden'}/>

                                <FormGroup as={Form.Row} className={'mb-0'}>
                                    <FormLabel htmlFor={'name'}>专场名称</FormLabel>
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
            {selectedPerformance &&
                <GoodsListSelected
                    show={true}
                    startPageLoading={startPageLoading}
                    stopPageLoading={stopPageLoading}
                    selectedPerformance={selectedPerformance}
                    setSelectedListShow={() => {
                        loadData();
                        setSelectedPerformance(null);
                    }}
                />
            }
            {editModal && <PerformanceEditor type={type} model={editModal} onHide={()=>{
                setEditModal(null);
                loadData();
            }} />}
            {selectedRow && <PerformanceDepositList show={depositsShow} onHide={()=>{
                setSelectedRow(null)
                setDepositsShow(false);
            }}  selectedRow={selectedRow} />}
        </>
    );
}

export default PerformanceList;