import {useEffect, useState} from "react";
import {useFetcher, useLoaderData} from "@remix-run/react";
import {DefaultListSearchParams, FetcherState, getFetcherState, PageSizeOptions, showDeleteAlert, showToastError, showToastSuccess} from "~/utils/utils";
import {Badge, Button, Card, Col, FormControl, FormGroup, FormLabel, Image, InputGroup, Row} from "react-bootstrap";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import BootstrapTable, {ColumnDescription} from "react-bootstrap-table-next";
import SinglePagination from "~/components/pagination/SinglePagination";
import {User} from "react-feather";
import FapiaoDeliveryConfirmEditor from "~/pages/paimai/FapiaoDeliveryConfirmEditor";


const ORDER_STATUS_COLORS:any = {
    '0': 'light',
    '1': 'danger',
    '2': 'success',
}

const OrderList = (props: any) => {
    const {startPageLoading, stopPageLoading} = props;
    const [list, setList] = useState<any>(useLoaderData());
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams});
    const [editModal, setEditModal] = useState<any>();
    const searchFetcher = useFetcher();
    const editFetcher = useFetcher();
    const deleteFetcher = useFetcher();

    const loadData = () => {
        searchFetcher.submit(searchState, {method: 'get'});
    }

    useEffect(() => {
        if (getFetcherState(searchFetcher) === FetcherState.DONE) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);

    useEffect(() => {
        if (getFetcherState(editFetcher) === FetcherState.DONE) {
            if (editFetcher.data.success) {
                showToastSuccess(editModal.id ? '处理成功' : '处理成功');
                searchFetcher.submit(searchState, {method: 'get'});
                setEditModal(null);
            } else {
                showToastError(editFetcher.data.message);
            }
        }
    }, [editFetcher.state]);

    useEffect(() => {
        if (getFetcherState(deleteFetcher) === FetcherState.DONE) {
            if (deleteFetcher.data.success) {
                stopPageLoading();
                showToastSuccess('拒绝成功');
                searchFetcher.submit(searchState, {method: 'get'});
            } else {
                showToastError(deleteFetcher.data.message);
            }
        }
    }, [deleteFetcher.state]);

    const handleOnAction = (row: any, e: any) => {
        switch (e) {
            case 'pass':
                //编辑
                setEditModal(row);
                break;
            case 'reject':
                //删除按钮
                showDeleteAlert(function () {
                    startPageLoading();
                    deleteFetcher.submit({id: row.id}, {method: 'put', action: `/paimai/fapiaos/resolve?id=${row.id}&status=0`, replace: true});
                }, '确认要拒绝本次申请吗？', '拒绝开票申请');
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
            text: '申请人',
            dataField: '',
            isDummyField: true,
            headerStyle: {width: 200},
            formatter: (cell: any, row: any) => {
                let previewUrl = row.memberAvatar;
                return (
                    <div className={'d-flex align-items-center'}>
                        {!previewUrl ? <User size={40}/> :
                            <Image src={previewUrl} roundedCircle={true} width={40} height={40} className={'badge-minimal'}/>}
                        <span className={'ml-1'}>{row.memberName}</span>
                    </div>
                );
            }
        },
        {
            text: '收货地址',
            headerStyle: {width: 200},
            dataField: 'deliveryInfo',
        },
        {
            text: '开票种类',
            dataField: 'type_dictText',
        },
        {
            text: '开票金额',
            dataField: 'amount',
        },
        {
            text: '开票抬头',
            dataField: 'title',
        },
        {
            text: '开票税号',
            dataField: 'taxCode',
        },
        {
            text: '申请时间',
            dataField: 'createTime',
        },
        {
            text: '状态',
            dataField: 'status_dictText',
            formatter(cell:number, row: any) {
                if(row.status == -1) {
                    return <Badge bg={'light'}>已取消</Badge>
                }
                return <Badge bg={ORDER_STATUS_COLORS[row.status]}>{row.status_dictText}</Badge>
            }
        },
        {
            text: '操作',
            dataField: 'operation',
            headerStyle: {width: 180},
            formatter: (cell: any, row: any) => {
                return (
                    <div className={'d-flex align-items-center'}>
                        {row.status == 1  && <a href={'#'} onClick={() => handleOnAction(row, 'pass')}>确认开票</a>}
                        {row.status == 1  && <a href={'#'} onClick={() => handleOnAction(row, 'reject')}>拒绝申请</a>}
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
    return (
        <>
            <Card>
                <div className={'m-2'}>
                    <Row>
                        <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                            <h4 className="mb-0">订单管理</h4>
                            <ReactSelectThemed
                                id={'role-page-size'}
                                placeholder={'分页大小'}
                                isSearchable={false}
                                defaultValue={PageSizeOptions[0]}
                                options={PageSizeOptions}
                                className={'per-page-selector d-inline-block ml-50 me-1'}
                                onChange={handlePageSizeChanged}
                            />
                        </Col>
                        <Col md={6} className={'d-flex align-items-center justify-content-end'}>
                            <searchFetcher.Form className={'form-inline justify-content-end'} onSubmit={handleOnSearchSubmit}>
                                <FormControl name={'pageNo'} value={1} type={'hidden'}/>
                                <FormControl name={'column'} value={searchState.column} type={'hidden'}/>
                                <FormControl name={'order'} value={searchState.order} type={'hidden'}/>
                                <FormControl name={'pageSize'} value={searchState.pageSize} type={'hidden'}/>

                                <FormGroup as={Row} className={'mb-0'}>
                                    <FormLabel column htmlFor={'name'}>关键字</FormLabel>
                                    <Col md={'auto'}>
                                        <InputGroup>
                                            <FormControl name={'searchKey'} onChange={handleOnNameChanged} placeholder={'请输入要搜索的内容'}/>
                                            <Button type={'submit'}>搜索</Button>
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
                            className="text-muted">共 {list?.total} 条记录 显示 {(list?.current - 1) * list?.size + 1} 至 {list?.current * list?.size > list?.total ? list.total : list?.current * list?.size} 条</span>
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
            {editModal && <FapiaoDeliveryConfirmEditor model={editModal} onHide={()=>{
                setEditModal(null);
                loadData();
            }} />}

        </>
    );
}

export default OrderList;