import {useEffect, useState} from "react";
import {useFetcher, useLoaderData} from "@remix-run/react";
import {DefaultListSearchParams, FetcherState, getFetcherState, handleResult, PageSizeOptions, showDeleteAlert,} from "~/utils/utils";
import {Button, Card, Col, Row} from "react-bootstrap";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import BootstrapTable from "react-bootstrap-table-next";
import SinglePagination from "~/components/pagination/SinglePagination";
import FigureImage from "react-bootstrap/FigureImage";
import GoodsSwiperEditor from "~/pages/paimai/GoodsSwiperEditor";


const GoodsSwiperList = (props: any) => {
    const {startPageLoading, stopPageLoading} = props;
    const [list, setList] = useState<any>(useLoaderData());
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams});
    const [editModal, setEditModal] = useState<any>();
    const searchFetcher = useFetcher();
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
        if (getFetcherState(deleteFetcher) === FetcherState.DONE) {
            stopPageLoading();
            handleResult(deleteFetcher.data, '删除成功');
            loadData();
        }
    }, [deleteFetcher.state]);

    const handleOnAction = (row: any, e: any) => {
        switch (e) {
            case 'edit':
                setEditModal(row);
                break;
            case 'delete':
                //删除按钮
                showDeleteAlert(function () {
                    startPageLoading();
                    deleteFetcher.submit({id: row.id}, {method: 'delete', action: `/paimai/goods/swipers/delete?id=${row.id}`, replace: true});
                });
                break;
        }
    }
    const handlePageChanged = (e: any) => {
        searchState.pageNo = e.selected + 1;
        setSearchState({...searchState});
        loadData();
    }

    const handlePageSizeChanged = (newValue: any) => {
        searchState.pageSize = parseInt(newValue.value);
        setSearchState({...searchState});
        loadData();
    }
    const handleSort = (field: any, order: any): void => {
        searchState.column = field;
        searchState.order = order;
        setSearchState({...searchState});
        loadData();
    }
    const handleOnAdd = () => {
        setEditModal({});
    }
    const columns: any[] = [
        {
            text: 'ID',
            dataField: 'id',
            headerStyle: {width: 200},
        },
        {
            text: '图片',
            dataField: 'image',
            isDummyField: true,
            headerStyle: {width: 200},
            formatter: (cell:any, row:any) => {
                let previewUrl = row.image;
                return <FigureImage src={previewUrl} style={{width: 60, height: 60}} />
            }
        },
        {
            text: '链接地址',
            dataField: 'url',
        },
        {
            text: '操作',
            dataField: 'operation',
            isDummyField: true,
            headerStyle: {width: 190},
            formatter: (cell: any, row: any) => {
                return (
                    <div className={'d-flex align-items-center'}>
                        <Button variant={'link'} onClick={()=>handleOnAction(row, 'edit')}>编辑</Button>
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
    const handleOnUsernameChanged = (e: any) => {
        setSearchState({...searchState, roleName: e.target.value});
    }

    return (
        <>
            <Card>
                <div className={'m-2'}>
                    <Row>
                        <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                            <ReactSelectThemed
                                id={'role-page-size'}
                                placeholder={'分页大小'}
                                isSearchable={false}
                                defaultValue={PageSizeOptions[0]}
                                options={PageSizeOptions}
                                className={'per-page-selector d-inline-block ml-50 me-1'}
                                onChange={handlePageSizeChanged}
                            />
                            <Button onClick={handleOnAdd}><i className={'feather icon-plus'} />新建轮播图</Button>
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
                            className="text-muted">共 {list?.total} 条记录 显示 {(list?.current - 1) * list?.size + 1} 至 {list?.current * list?.size > list?.total ? list?.total : list?.current * list.size} 条</span>
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

            {editModal && <GoodsSwiperEditor model={editModal} onHide={()=>{
                setEditModal(null);
                loadData();
            }} />}
        </>
    );
}

export default GoodsSwiperList;