import {useEffect, useState} from "react";
import {DefaultListSearchParams, defaultSelectRowConfig, PageSizeOptions, showDeleteAlert, showToastError, showToastSuccess} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import {Badge, Button, Col, Dropdown, Form, FormControl, FormGroup, FormLabel, InputGroup, Modal, Row} from "react-bootstrap";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import BootstrapTable from "react-bootstrap-table-next";
import SinglePagination from "~/components/pagination/SinglePagination";
import SyncGoodsEditor from "~/pages/paimai/SyncGoodsEditor";
import {Delete, Edit, Eye, MoreVertical} from "react-feather";
import OfferList from "~/pages/paimai/OfferList";
import DepositList from "~/pages/paimai/DepositList";
import ViewList from "~/pages/paimai/ViewList";
import FollowList from "~/pages/paimai/FollowList";
import RoomGoodsEditor from "~/pages/paimai/RoomGoodsEditor";


const RoomGoodsListSelected = (props: any) => {
    const {show, onHide, selectedRoom, startPageLoading, stopPageLoading} = props;
    const [list, setList] = useState<any>({records: []});
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams, room_id: selectedRoom?.id, column: 'sortNum', order: 'asc'});
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [editModal, setEditModal] = useState<any>();
    const [selectedRow, setSelectedRow] = useState<any>();
    const [viewsShow, setViewsShow] = useState<boolean>(false);
    const [followsShow, setFollowsShow] = useState<boolean>(false);
    const [depositsShow, setDepositsShow] = useState<boolean>(false);
    const [offersShow, setOffersShow] = useState<boolean>(false);
    const searchFetcher = useFetcher();
    const controlFetcher = useFetcher();
    const deleteFetcher = useFetcher();

    useEffect(() => {
        if (show && selectedRoom) {
            searchFetcher.submit(searchState, {method: 'get', action: '/paimai/goods/selected'});
        }
    }, [show, selectedRoom]);


    useEffect(() => {
        if (searchFetcher.data) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);
    useEffect(() => {
        if (deleteFetcher.data && deleteFetcher.type === 'done') {
            if (deleteFetcher.data.success) {
                showToastSuccess('删除成功');
                searchFetcher.submit(searchState, {method: 'get', action: '/paimai/goods/selected'});
            } else {
                showToastError(deleteFetcher.data.message);
            }
            stopPageLoading();
        }
    }, [deleteFetcher.state]);


    useEffect(() => {
        if (controlFetcher.data && controlFetcher.type === 'done') {
            if (controlFetcher.data.success) {
                showToastSuccess('设置成功');
                searchFetcher.submit(searchState, {method: 'get', action: '/paimai/goods/selected'});
            } else {
                showToastError(controlFetcher.data.message);
            }
            stopPageLoading();
        }
    }, [controlFetcher.state]);

    const handlePageChanged = (e: any) => {
        searchState.pageNo = e.selected + 1;
        setSearchState({...searchState});
        searchFetcher.submit(searchState, {method: 'get', action: '/paimai/goods/selected'});
    }
    const handlePageSizeChanged = (newValue: any) => {
        searchState.pageSize = parseInt(newValue.value);
        setSearchState({...searchState});
        searchFetcher.submit(searchState, {method: 'get', action: '/paimai/goods/selected'});
    }
    const handleOnSearchNameChanged = (e: any) => {
        setSearchState({...searchState, roleName: e.target.value});
    }
    const handleOnSearchSubmit = () => {
        //设置分页为1
        setSearchState({...searchState, pageNo: 1});
    }
    const handleOnAction = (row: any, e: any) => {
        switch (e) {
            case 'offers':
                setSelectedRow(row);
                setOffersShow(true);
                break;
            case 'deposits':
                setSelectedRow(row);
                setDepositsShow(true);
                break;
            case 'views':
                setSelectedRow(row);
                setViewsShow(true);
                break;
            case 'follows':
                setSelectedRow(row);
                setFollowsShow(true);
                break;
            case 'edit':
                setEditModal(row);
                break;
            case 'start':
                //编辑
                showDeleteAlert(function () {
                    controlFetcher.submit({}, {method: 'put', action: `/paimai/live/goods/start?id=${row.id}`, replace: true});
                }, '确定要上播本拍品吗？', '确认上播');
                break;
            case 'end':
                showDeleteAlert(function () {
                    controlFetcher.submit({}, {method: 'put', action: `/paimai/live/goods/end?id=${row.id}`, replace: true});
                }, '确定要下播本拍品吗？', '确认下播');
                break;
            case 'delete':
                //删除按钮
                showDeleteAlert(function () {
                    startPageLoading();
                    deleteFetcher.submit({id: row.id}, {method: 'delete', action: `/paimai/goods/delete?id=${row.id}`, replace: true});
                });
                break;
            case 'confirm_deal':
                //删除按钮
                showDeleteAlert(function () {
                    startPageLoading();
                    controlFetcher.submit({id: row.id}, {method: 'delete', action: `/paimai/goods/deal?id=${row.id}&status=3`, replace: true});
                }, '请确认改拍品已成交?', '确认成交');
                break;
            case 'confirm_deal_fail':
                //删除按钮
                showDeleteAlert(function () {
                    startPageLoading();
                    controlFetcher.submit({id: row.id}, {method: 'delete', action: `/paimai/goods/deal?id=${row.id}&status=4`, replace: true});
                }, '请确认该拍品已流拍', '确认流拍');
                break;
        }
    }
    const columns: any[] = [
        {
            text: 'ID',
            dataField: 'id',
        },
        {
            text: '标的号',
            dataField: 'sortNum',
        },
        {
            text: '拍品名称',
            dataField: 'title',
        },
        {
            text: '起拍价',
            dataField: 'startPrice',
        },
        {
            text: '成交价',
            dataField: 'dealPrice',
        },
        {
            text: '同步状态',
            isDummyField: true,
            formatter(cell:number, row: any) {
                if(row.state == 0) {
                    return <Badge bg={'light'}>{row.state_dictText}</Badge>
                }
                else if(row.state == 1) {
                    return <Badge bg={'success'}>{row.state_dictText}</Badge>
                }
                else if(row.state == 2) {
                    return <Badge bg={'warning'}>{row.state_dictText}</Badge>
                }
                else if(row.state == 3) {
                    return <Badge bg={'info'}>{row.state_dictText}</Badge>
                }
                else if(row.state == 4) {
                    return <Badge bg={'dark'}>{row.state_dictText}</Badge>
                }
                return <Badge bg={'dark'}>未知</Badge>
            }
        },
        {
            text: '显示状态',
            dataField: 'status_dictText',
            formatter(cell:number, row: any) {
                if(row.status == 0) {
                    return <Badge bg={'light'}>{row.status_dictText}</Badge>
                }
                else if(row.status == 1) {
                    return <Badge bg={'success'}>{row.status_dictText}</Badge>
                }
                return <Badge bg={'dark'}>未知</Badge>
            }
        },
        {
            text: '操作',
            dataField: 'operation',
            headerStyle: {width: 300},
            formatter: (cell: any, row: any) => {
                return (
                    <div className={'d-flex align-items-center'}>
                        {row.state == 0 && <a href={'#'} onClick={() => handleOnAction(row, 'start')}>上播</a>}
                        {row.state == 1  && <a href={'#'} onClick={() => handleOnAction(row, 'end')}>下播</a>}
                        {row.state == 2 && <>
                            <a href={'#'} onClick={() => handleOnAction(row, 'confirm_deal')}>确认成交</a>
                            <span className={'divider'}/>
                            <a href={'#'} onClick={() => handleOnAction(row, 'confirm_deal_fail')}>确认流拍</a>
                        </>}
                        <span className={'divider'}/>
                        <Dropdown as={'span'} onSelect={(e) => handleOnAction(row, e)}>
                            <Dropdown.Toggle as={'span'} className={'noafter'}>
                                <MoreVertical size={16} style={{marginTop: -2}}/>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey={'offers'}>
                                    <div className={'d-flex align-items-center'}><Eye size={16} className={'mr-1'}/>出价记录</div>
                                </Dropdown.Item>
                                <Dropdown.Item eventKey={'deposits'}>
                                    <div className={'d-flex align-items-center'}><Eye size={16} className={'mr-1'}/>保证金记录</div>
                                </Dropdown.Item>
                                <Dropdown.Item eventKey={'views'}>
                                    <div className={'d-flex align-items-center'}><Eye size={16} className={'mr-1'}/>围观记录</div>
                                </Dropdown.Item>
                                <Dropdown.Item eventKey={'follows'}>
                                    <div className={'d-flex align-items-center'}><Eye size={16} className={'mr-1'}/>关注记录</div>
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
            },

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
    const selectRowConfig = {
        ...defaultSelectRowConfig,
        onSelect: handleOnRowSelect,
        onSelectAll: handleOnRowSelectAll,
    }
    const handleOnAdd = () => {
        setEditModal({});
    }

    return (
        <>
            <Modal
                show={show}
                size={'xl'}
                onHide={() => onHide(false)}
                centered
                backdrop={'static'}
                aria-labelledby={'edit-modal'}
            >
                <Modal.Header closeButton>
                    <Modal.Title id={'edit-modal'}> 直播间【{selectedRoom?.title}】拍品 </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={'m-2'}>
                        <Row>
                            <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                                <Button onClick={handleOnAdd}><i className={'feather icon-plus'}/>新建拍品</Button>
                            </Col>
                            <Col md={6} className={'d-flex align-items-center justify-content-end'}>
                                <searchFetcher.Form action={'/paimai/goods/selected'} className={'form-inline justify-content-end'}
                                                    onSubmit={handleOnSearchSubmit}>
                                    <FormControl name={'pageNo'} value={1} type={'hidden'}/>
                                    <FormControl name={'room_id'} value={selectedRoom?.id} type={'hidden'}/>
                                    <FormControl name={'column'} value={searchState.column} type={'hidden'}/>
                                    <FormControl name={'order'} value={searchState.order} type={'hidden'}/>
                                    <FormControl name={'pageSize'} value={searchState.pageSize} type={'hidden'}/>

                                    <FormGroup as={Row} className={'mb-0'}>
                                        <FormLabel column htmlFor={'title'}>拍品名称</FormLabel>
                                        <Col md={'auto'}>
                                            <InputGroup>
                                                <FormControl name={'title'} autoComplete={'off'} onChange={handleOnSearchNameChanged}
                                                             placeholder={'请输入要搜索的内容'}/>
                                                <Button type={'submit'}>搜索</Button>
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
            {editModal && <RoomGoodsEditor model={editModal} selectedRoom={selectedRoom} onHide={()=>{
                setEditModal(null);
                searchFetcher.submit(searchState, {method: 'get', action: '/paimai/goods/selected'});
            }} />}
            {selectedRow && <OfferList startPageLoading={startPageLoading} stopPageLoading={stopPageLoading} show={offersShow} onHide={()=>{
                setSelectedRow(null);
                setOffersShow(false);
            }} selectedRow={selectedRow} />}
            {selectedRow && <DepositList show={depositsShow} onHide={()=>{
                setSelectedRow(null)
                setDepositsShow(false);
            }}  selectedRow={selectedRow} />}
            {selectedRow && <ViewList show={viewsShow} onHide={()=>{
                setSelectedRow(null)
                setViewsShow(false);
            }}  selectedRow={selectedRow} />}
            {selectedRow && <FollowList show={followsShow} onHide={()=>{
                setSelectedRow(null)
                setFollowsShow(false);
            }}  selectedRow={selectedRow} />}
        </>
    );
}

export default RoomGoodsListSelected;