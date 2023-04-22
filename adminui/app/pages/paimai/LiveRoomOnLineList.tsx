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




const LiveRoomOnLineList = (props: any) => {
    const {startPageLoading, stopPageLoading, liveRoom, show, onHide} = props;
    const [users, setUsers] = useState([]);
    const searchFetcher = useFetcher();
    const deleteFetcher = useFetcher();

    const loadData = () => {
        searchFetcher.load('/paimai/live/onlines?roomId='+liveRoom.id);
    }
    useEffect(()=>{
        loadData();
    }, []);
    useEffect(() => {
        if (searchFetcher.data && searchFetcher.type === 'done') {
            setUsers(searchFetcher.data);
        }
    }, [searchFetcher.state]);

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
            case 'mute':
                showDeleteAlert(function () {
                    startPageLoading();
                    deleteFetcher.submit({roomId: liveRoom.id, userId: row.id}, {method: 'put', action: `/paimai/live/mute?userId=${row.id}&roomId=${liveRoom.id}`, replace: true});
                },'确认禁言该用户吗?', '禁言用户');
                break;
            case 'kickout':
                showDeleteAlert(function () {
                    startPageLoading();
                    deleteFetcher.submit({roomId: liveRoom.id, userId: row.id}, {method: 'put', action: `/paimai/live/kickout?userId=${row.id}&roomId=${liveRoom.id}`, replace: true});
                },'确认要将该用户踢出直播间吗?', '踢出用户');
                break;
        }
    }
    const columns: ColumnDescription[] = [
        {
            text: '用户信息',
            dataField: '',
            isDummyField: true,
            headerStyle: {width: 200},
            formatter: (cell:any, row:any) => {
                return (
                    <div className={'d-flex align-items-center'}>
                        {!row.avatar ? <User size={40} /> : <Image src={row.avatar} roundedCircle={true} width={40} height={40} className={'badge-minimal'} />}
                        <span className={'ml-1'}>{row.nickname}</span>
                    </div>
                );
            }
        },
        {
            text: '操作',
            dataField: 'operation',
            headerStyle: {width: 200},
            formatter: (cell: any, row: any) => {
                return (
                    <div className={'d-flex align-items-center'}>
                        <a href={'#'} onClick={() => handleOnAction(row, 'mute')}>禁言</a>
                        <span className={'divider'}/>
                        <a href={'#'} onClick={() => handleOnAction(row, 'kickout')}>踢出房间</a>
                    </div>
                );
            }
        },
    ]
    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                centered
                backdrop={'static'}
                aria-labelledby={'edit-modal'}
            >
                <Modal.Header closeButton>
                    <Modal.Title id={'edit-modal'}> 直播间用户管理 </Modal.Title>
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
                                    data={users}
                                    keyField={'id'}/>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default LiveRoomOnLineList;