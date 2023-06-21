import React, {useEffect, useState} from "react";
import {useFetcher, useLoaderData} from "@remix-run/react";
import {DefaultListSearchParams, FetcherState, getFetcherState, PageSizeOptions, showDeleteAlert, showToastError, showToastSuccess} from "~/utils/utils";
import {Badge, Button, Card, Col, Form, FormControl, FormGroup, FormLabel, Image, InputGroup, Row} from "react-bootstrap";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import BootstrapTable, {ColumnDescription} from "react-bootstrap-table-next";
import SinglePagination from "~/components/pagination/SinglePagination";
import FigureImage from "react-bootstrap/FigureImage";
import DeliveryConfirmEditor from "~/pages/paimai/DeliveryConfirmEditor";
import {User} from "react-feather";
import DatePicker from "react-datepicker";
import BootstrapSelect from "~/components/form/BootstrapSelect";

const PAY_TYPE_COLORS :any = {
    '1': 'primary',
    '2': 'warning',
}
const ORDER_STATUS_COLORS:any = {
    '-1': 'light',
    '0': 'light',
    '1': 'danger',
    '2': 'success',
    '3': 'dark',
    '4': 'danger',
}

const OrderList = (props: any) => {
    const {startPageLoading, stopPageLoading} = props;
    const [list, setList] = useState<any>(useLoaderData());
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams});
    const [editModal, setEditModal] = useState<any>();
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
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
                showToastSuccess(editModal.id ? '修改成功' : '新建成功');
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
                showToastSuccess('确认成功');
                searchFetcher.submit(searchState, {method: 'get'});
            } else {
                showToastError(deleteFetcher.data.message);
            }
        }
    }, [deleteFetcher.state]);

    const handleOnAction = (row: any, e: any) => {
        switch (e) {
            case 'delivery':
                //编辑
                setEditModal(row);
                break;
            case 'confirm-pay':
                //删除按钮
                showDeleteAlert(function () {
                    startPageLoading();
                    deleteFetcher.submit({id: row.id}, {method: 'put', action: `/paimai/orders/confirm_pay?id=${row.id}`, replace: true});
                }, '此订单确认已经支付了吗？', '确认支付');
                break;
            case 'confirm-delivery':
                //删除按钮
                showDeleteAlert(function () {
                    startPageLoading();
                    deleteFetcher.submit({id: row.id}, {method: 'put', action: `/paimai/orders/confirm_delivery?id=${row.id}`, replace: true});
                }, '此订单确认已经收货了吗？', '确认收货');
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
            text: '商品信息',
            dataField: '',
            isDummyField: true,
            headerStyle: {width: 300},
            formatter: (cell: any, row: any) => {
                return (
                    <>
                        <Row><Col>订单号：{row.id}</Col></Row>
                        {row.orderGoods.map((item:any)=>{
                            return (
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <div style={{width: 60, marginRight: 10}}>
                                        <FigureImage src={item.goodsImage} style={{width: 60, height: 60}}/>
                                    </div>
                                    <div style={{flex:1, display: 'flex', justifyContent: 'space-around', flexDirection: 'column'}}>
                                        <div> {item.goodsName} </div>
                                        <div> ￥{item.goodsPrice} X {item.goodsCount} </div>
                                    </div>
                                </div>
                            );
                        })}

                    </>
                );
            }
        },
        {
            text: '购买人',
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
            text: '订单备注',
            dataField: 'note',
        },
        {
            text: '支付方式',
            dataField: 'payType_dictText',
            formatter(cell:number, row: any) {
                return <Badge bg={PAY_TYPE_COLORS[row.payType]}>{row.payType_dictText}</Badge>
            }
        },
        {
            text: '支付金额',
            dataField: 'payedPrice',
        },
        {
            text: '支付时间',
            dataField: 'payTime',
        },
        {
            text: '支付凭证',
            dataField: 'payImage',
            formatter(cell:number, row:any) {
                return <a href={row.payImage} target={'_blank'}><Image src={row.payImage} width={60} height={60} /></a>
            }
        },
        {
            text: '下单时间',
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
            text: '订单类型',
            dataField: 'type_dictText',
        },
        {
            text: '是否开票',
            dataField: 'fapiaoStatus_dictText',
        },
        {
            text: '操作',
            dataField: 'operation',
            headerStyle: {width: 180},
            formatter: (cell: any, row: any) => {
                return (
                    <div className={'d-flex align-items-center'}>
                        {row.status == 0 && <a href={'#'} onClick={() => handleOnAction(row, 'confirm-pay')}>确认支付</a>}
                        {row.status == 1  && <a href={'#'} onClick={() => handleOnAction(row, 'delivery')}>发货</a>}
                        {row.status == 2  && <a href={'#'} onClick={() => handleOnAction(row, 'confirm-delivery')}>确认收货</a>}
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
                        <Col md={12} className={'d-flex align-items-center'}>
                            <searchFetcher.Form className={'form-inline justify-content-end'} onSubmit={handleOnSearchSubmit}>
                                <FormControl name={'pageNo'} value={1} type={'hidden'}/>
                                <FormControl name={'column'} value={searchState.column} type={'hidden'}/>
                                <FormControl name={'order'} value={searchState.order} type={'hidden'}/>
                                <FormControl name={'pageSize'} value={searchState.pageSize} type={'hidden'}/>

                                <FormGroup as={Row} className={'mb-0'}>
                                    <FormLabel column md={'auto'}>下单时间：</FormLabel>
                                    <Col md={'auto'}>
                                        <DatePicker
                                            selectsRange={true}
                                            startDate={startDate}
                                            endDate={endDate}
                                            className={'form-control'}
                                            dateFormat={'yyyy-MM-dd'}
                                            onChange={(update: any) => {
                                                setDateRange(update);
                                            }}
                                            isClearable={true}
                                        />
                                    </Col>
                                    <FormLabel column md={'auto'}>支付方式：</FormLabel>
                                    <Col md={'auto'}>
                                        <Form.Select name={'payType'}>
                                            <option value={''}>不设置</option>
                                            <option value={'1'}>微信支付</option>
                                            <option value={'2'}>线下支付</option>
                                        </Form.Select>
                                    </Col>
                                    <FormLabel column md={'auto'}>订单状态：</FormLabel>
                                    <Col md={'auto'}>
                                        <Form.Select name={'status'}>
                                            <option value={''}>不设置</option>
                                            <option value={'0'}>待支付</option>
                                            <option value={'1'}>待发货</option>
                                            <option value={'2'}>待收货</option>
                                            <option value={'3'}>已完成</option>
                                            <option value={'4'}>申请售后</option>
                                        </Form.Select>
                                    </Col>
                                    <FormLabel column md={'auto'}>订单类型：</FormLabel>
                                    <Col md={'auto'}>
                                        <Form.Select name={'type'}>
                                            <option value={''}>不设置</option>
                                            <option value={'1'}>拍卖订单</option>
                                            <option value={'2'}>一口价订单</option>
                                        </Form.Select>
                                    </Col>
                                    <FormLabel column htmlFor={'id'} md={'auto'}>关键字：</FormLabel>
                                    <Col md={'auto'}>
                                        <FormControl name={'id'} placeholder={'订单号'} style={{width: 120}} />
                                    </Col>
                                    <Col md={'auto'}>
                                        <Button type={'submit'}>搜索</Button>
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
                            <ReactSelectThemed
                                id={'role-page-size'}
                                placeholder={'分页大小'}
                                isSearchable={false}
                                defaultValue={PageSizeOptions[0]}
                                options={PageSizeOptions}
                                className={'per-page-selector d-inline-block ml-50 me-1'}
                                onChange={handlePageSizeChanged}
                            />
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
            {editModal && <DeliveryConfirmEditor model={editModal} onHide={()=>{
                setEditModal(null);
                loadData();
            }} />}

        </>
    );
}

export default OrderList;