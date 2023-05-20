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
import LiveRoomStreamEditor from "~/pages/paimai/LiveRoomStreamEditor";




const LiveRoomStreamList = (props: any) => {
    const {startPageLoading, stopPageLoading, streams, show, onHide, refreshData} = props;
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams});
    const [editModal, setEditModal] = useState<any>();
    const searchFetcher = useFetcher();
    const deleteFetcher = useFetcher();

    const loadData = () => {
        refreshData();
    }
    useEffect(() => {
        if (deleteFetcher.data && deleteFetcher.type === 'done') {
            if (deleteFetcher.data.success) {
                stopPageLoading();
                showToastSuccess('操作成功');
                refreshData();
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
                let index = row.pushAddress.lastIndexOf('/');
                let obs = [row.pushAddress.substring(0, index+1), row.pushAddress.substring(index+1)];
                return (
                    <Row>
                        <Col md={12}>
                            推流地址：{row.pushAddress}
                        </Col>
                        <Col md={12}>
                            OBS服务器：{obs[0]}
                        </Col>
                        <Col md={12}>
                            OBS推流码：{obs[1]}
                        </Col>
                        <Col md={12}>
                            拉流地址：{row.playAddress}
                        </Col>
                    </Row>
                );
            }
        },
        {
            text: '回放地址',
            dataField: 'playbackUrl',
        },
        {
            text: '屏幕适配',
            dataField: 'objectFit',
        },
        {
            text: '流宽度',
            dataField: 'width',
        },
        {
            text: '流高度',
            dataField: 'height',
        },
        {
            text: '显示状态',
            dataField: 'status_dictText',
            formatter(cell:number, row: any) {
                if(row.status == 0) {
                    return <Badge bg={'light'}>不显示</Badge>
                }
                else if(row.status == 1) {
                    return <Badge bg={'success'}>显示</Badge>
                }
                return <Badge bg={'dark'}>未知</Badge>
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
                        <span className={'divider'}/>
                        <a href={'#'} onClick={() => handleOnAction(row, 'edit')}>编辑</a>
                    </div>
                );
            }
        },
    ]
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
                            </Col>
                            <Col md={6} className={'d-flex align-items-center justify-content-end'}>
                            </Col>
                        </Row>
                    </div>

                    <BootstrapTable classes={'table-layout-fixed position-relative b-table'} striped hover columns={columns} bootstrap4
                                    data={streams}
                                    keyField={'id'}/>
                </Modal.Body>
            </Modal>

            {editModal && <LiveRoomStreamEditor model={editModal} onHide={()=>{
                setEditModal(null);
                loadData();
            }} />}



        </>
    );
}

export default LiveRoomStreamList;