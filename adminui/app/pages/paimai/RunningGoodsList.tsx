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
import GoodsEditor from "~/pages/paimai/GoodsEditor";
import FigureImage from "react-bootstrap/FigureImage";
import {Delete, Edit, Eye, MoreVertical} from "react-feather";
import OfferList from "~/pages/paimai/OfferList";
import DepositList from "~/pages/paimai/DepositList";
import ViewList from "~/pages/paimai/ViewList";
import FollowList from "~/pages/paimai/FollowList";
import OfferConfirmEditor from "~/pages/paimai/OfferConfirmEditor";


const RunningGoodsList = (props: any) => {
    const [list, setList] = useState<any>(useLoaderData());
    const [searchState, setSearchState] = useState<any>(DefaultListSearchParams);
    const [editModal, setEditModal] = useState<any>();
    const [offersShow, setOffersShow] = useState<boolean>(false);
    const [selectedRow, setSelectedRow] = useState<any>();
    const searchFetcher = useFetcher();
    const editFetcher = useFetcher();

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


    const handleOnAction = (row: any, e: any) => {
        switch (e) {
            case 'offer':
                //编辑
                setEditModal(row);
                break;
            case 'offers':
                setSelectedRow(row);
                setOffersShow(true);
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
            text: '标的号',
            dataField: 'sortNum',
        },
        {
            text: '拍品名称',
            dataField: 'title',
        },
        {
            text: '预览图',
            dataField: '',
            isDummyField: true,
            formatter: (cell: any, row: any) => {
                let previewUrl = row.images?.split(',')[0];
                return <FigureImage src={previewUrl} style={{width: 60, height: 60}}/>
            }
        },
        {
            text: '当前价',
            dataField: 'startPrice',
            isDummyField: true,
            formatter:(cell:number, row:any)=>{
                return row.curretnPrice || row.startPrice;
            }
        },
        {
            text: '所在专场',
            dataField: 'performanceTitle',
        },
        {
            text: '操作',
            dataField: 'operation',
            headerStyle: {width: 230},
            formatter: (cell: any, row: any) => {
                return (
                    <div className={'d-flex align-items-center'}>
                        <a href={'#'} onClick={() => handleOnAction(row, 'offer')}>我要出价</a>
                        <span className={'divider'}/>
                        <a href={'#'} onClick={() => handleOnAction(row, 'offers')}>出价记录</a>
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
                            <h4 className="mb-0">进行中拍品管理</h4>
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
                            <searchFetcher.Form className={'form-inline justify-content-end'} onSubmit={handleOnSearchSubmit}>
                                <FormControl name={'pageNo'} value={1} type={'hidden'}/>
                                <FormControl name={'column'} value={searchState.column} type={'hidden'}/>
                                <FormControl name={'order'} value={searchState.order} type={'hidden'}/>
                                <FormControl name={'pageSize'} value={searchState.pageSize} type={'hidden'}/>

                                <FormGroup as={Form.Row} className={'mb-0'}>
                                    <FormLabel htmlFor={'title'}>拍品名称</FormLabel>
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
            {selectedRow && <OfferList show={offersShow} onHide={()=>{
                setSelectedRow(null);
                setOffersShow(false);
            }} selectedRow={selectedRow} />}
            {editModal && <OfferConfirmEditor model={editModal} onHide={() => {
                setEditModal(null);
                loadData();
            }} onRefresh={()=>{
                loadData();
            }} />}
        </>
    );
}

export default RunningGoodsList;