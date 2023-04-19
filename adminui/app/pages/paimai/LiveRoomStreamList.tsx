import {useEffect, useState} from "react";
import {useFetcher, useLoaderData} from "@remix-run/react";
import {
    DefaultListSearchParams,
    PageSizeOptions,
    showDeleteAlert,
    showToastError,
    showToastSuccess
} from "~/utils/utils";
import {Badge, Button, Card, Col, Form, FormControl, FormGroup, FormLabel, Image, InputGroup, Modal, Row} from "react-bootstrap";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import BootstrapTable, {ColumnDescription} from "react-bootstrap-table-next";
import SinglePagination from "~/components/pagination/SinglePagination";
import FigureImage from "react-bootstrap/FigureImage";
import AuctionEditor from "~/pages/paimai/AuctionEditor";
import GoodsListSelector from "~/pages/paimai/GoodsListSelector";
import GoodsListSelected from "~/pages/paimai/GoodsListSelected";
import PerformanceListSelector from "~/pages/paimai/PerformanceListSelector";
import PerformancesListSelected from "~/pages/paimai/PerformanceListSelected";
import LiveRoomEditor from "~/pages/paimai/LiveRoomEditor";
import {User} from "react-feather";




const LiveRoomStreamList = (props: any) => {
    const {startPageLoading, stopPageLoading, streams, show, onHide} = props;
    const [list, setList] = useState<any>(streams);
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams});
    const searchFetcher = useFetcher();
    const deleteFetcher = useFetcher();

    const loadData = () => {
        setList(streams);
    }


    useEffect(() => {
        if (deleteFetcher.data && deleteFetcher.type === 'done') {
            if (deleteFetcher.data.success) {
                stopPageLoading();
                showToastSuccess('操作成功');
                loadData();
            } else {
                showToastError(deleteFetcher.data.message);
            }
        }
    }, [deleteFetcher.state]);

    const handleOnAction = (row: any, e: any) => {
        switch (e) {
            case 'show':
                showDeleteAlert(function () {
                    startPageLoading();
                    deleteFetcher.submit({id: row.id}, {method: 'delete', action: `/paimai/live/streams/repush?id=${row.id}`, replace: true});
                },'确认要本恢复视频流的推送吗?', '确认恢复推流');
                break;
            case 'hide':
                showDeleteAlert(function () {
                    startPageLoading();
                    deleteFetcher.submit({id: row.id}, {method: 'delete', action: `/paimai/live/streams/disable?id=${row.id}`, replace: true});
                },'确认要停止本视频流的推送吗?', '确认停止推流');
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
            text: '推拉流地址',
            dataField: '',
            isDummyField: true,
            formatter: (cell:any, row:any) => {
                return (
                    <Row>
                        <Col md={12}>
                            推流地址：{row.pushAddress}
                        </Col>
                        <Col md={12}>
                            拉流地址：{row.playAddress}
                        </Col>
                    </Row>
                );
            }
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
            text: '显示状态',
            dataField: 'status_dictText',
            formatter(cell:number, row: any) {
                if(row.status == 0) {
                    return <Badge variant={'light'}>不显示</Badge>
                }
                else if(row.status == 1) {
                    return <Badge variant={'success'}>显示</Badge>
                }
                return <Badge variant={'dark'}>未知</Badge>
            }
        },
        {
            text: '操作',
            dataField: 'operation',
            headerStyle: {width: 200},
            formatter: (cell: any, row: any) => {
                return (
                    <div className={'d-flex align-items-center'}>
                        {row.status == 0  && <a href={'#'} onClick={() => handleOnAction(row, 'show')}>恢复推流</a>}
                        {row.status == 1  && <a href={'#'} onClick={() => handleOnAction(row, 'hide')}>停止推流</a>}
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

    return (
        <>
            <Modal
                show={show}
                size={'xl'}
                onHide={onHide}
                centered
                backdrop={'static'}
                aria-labelledby={'edit-modal'}
            >
                <Modal.Header closeButton>
                    <Modal.Title id={'edit-modal'}> 直播间流管理 </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={'m-2'}>
                        <Row>
                            <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                                <ReactSelectThemed
                                    id={'role-page-size'}
                                    placeholder={'分页大小'}
                                    isSearchable={false}
                                    defaultValue={PageSizeOptions[0]}
                                    options={PageSizeOptions}
                                    className={'per-page-selector d-inline-block ml-50 mr-1'}
                                    onChange={handlePageSizeChanged}
                                />
                            </Col>
                            <Col md={6} className={'d-flex align-items-center justify-content-end'}>
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
                </Modal.Body>
            </Modal>
        </>
    );
}

export default LiveRoomStreamList;