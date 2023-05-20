import {useEffect, useState} from "react";
import {DefaultListSearchParams, defaultSelectRowConfig, FetcherState, getFetcherState, PageSizeOptions, showToastError, showToastSuccess} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import {Button, Col, FormControl, FormGroup, FormLabel, Image, InputGroup, Modal, Row} from "react-bootstrap";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import BootstrapTable from "react-bootstrap-table-next";
import SinglePagination from "~/components/pagination/SinglePagination";
import {User} from "react-feather";


const CouponTicketList = (props: any) => {
    const {show, onHide, selectedRow} = props;
    const [list, setList] = useState<any>({records: []});
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams, couponId: selectedRow?.id});
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const searchFetcher = useFetcher();
    useEffect(()=>{
        if(show && selectedRow) {
            searchFetcher.submit(searchState, {method: 'get', action: '/paimai/coupons/tickets'});
        }
    }, [show, selectedRow]);

    useEffect(() => {
        if (getFetcherState(searchFetcher.data) === FetcherState.DONE) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);



    const handlePageChanged = (e: any) => {
        searchState.pageNo = e.selected + 1;
        setSearchState({...searchState});
        searchFetcher.submit(searchState, {method: 'get', action: '/paimai/coupons/tickets'});
    }
    const handlePageSizeChanged = (newValue: any) => {
        searchState.pageSize = parseInt(newValue.value);
        setSearchState({...searchState});
        searchFetcher.submit(searchState, {method: 'get', action: '/paimai/coupons/tickets'});
    }
    const handleOnSearchNameChanged = (e: any) => {
        setSearchState({...searchState, roleName: e.target.value});
    }
    const handleOnSearchSubmit = () => {
        //设置分页为1
        setSearchState({...searchState, pageNo: 1});
    }
    const columns: any[] = [
        {
            text: '领取人',
            dataField: '',
            isDummyField: true,
            headerStyle: {width: 200},
            formatter: (cell:any, row:any) => {
                return (
                    <div className={'d-flex align-items-center'}>
                        {!row.memberAvatar ? <User size={40} /> : <Image src={row.memberAvatar} roundedCircle={true} width={40} height={40} className={'badge-minimal'} />}
                        <span className={'ms-1'}>{row.memberName}</span>
                    </div>
                );
            }
        },
        {
            text: '领取时间',
            dataField: 'createTime',
        },
        {
            text: '使用状态',
            dataField: 'status_dictText',
        },
        {
            text: '使用时间',
            dataField: 'usedTime',
        },
        {
            text: '关联单号',
            dataField: 'useOrderId',
        },
    ]

    const handleOnRowSelect = (row:any, isSelect:boolean) => {
        if(isSelect) {
            setSelectedRows([...selectedRows, row.id])
        }
        else {
            let selected = selectedRows.filter(x=> x !== row.id);
            setSelectedRows([...selected]);
        }
    }
    const handleOnRowSelectAll = (isSelect:boolean, rows:any[]) => {
        if(isSelect) {
            setSelectedRows([...rows.map(x=>x.id)]);
        }
        else {
            setSelectedRows([]);
        }
    }

    const selectRowConfig = {
        ...defaultSelectRowConfig,
        onSelect: handleOnRowSelect,
        onSelectAll: handleOnRowSelectAll,
    }

    return (
        <Modal
            show={show}
            size={'lg'}
            onHide={onHide}
            centered
            backdrop={'static'}
            aria-labelledby={'edit-modal'}
        >
            <Modal.Header closeButton>
                <Modal.Title id={'edit-modal'}>
                    <p>领取记录</p>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className={'m-2'}>
                    <Row>
                        <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                            <ReactSelectThemed
                                placeholder={'分页大小'}
                                isSearchable={false}
                                defaultValue={PageSizeOptions[0]}
                                options={PageSizeOptions}
                                className={'per-page-selector d-inline-block ml-50 mr-1'}
                                onChange={handlePageSizeChanged}
                            />
                        </Col>
                        <Col md={6} className={'d-flex align-items-center justify-content-end'}>
                            <searchFetcher.Form action={'/paimai/coupons/tickets'} className={'form-inline justify-content-end'}
                                                onSubmit={handleOnSearchSubmit}>
                                <FormControl name={'pageNo'} value={1} type={'hidden'}/>
                                <FormControl name={'column'} value={searchState.column} type={'hidden'}/>
                                <FormControl name={'order'} value={searchState.order} type={'hidden'}/>
                                <FormControl name={'pageSize'} value={searchState.pageSize} type={'hidden'}/>

                                <FormGroup as={Row} className={'mb-0'}>
                                    <FormLabel column htmlFor={'memberName'}>领取人</FormLabel>
                                    <Col md={'auto'}>
                                        <InputGroup>
                                            <FormControl name={'memberName'} autoComplete={'off'} onChange={handleOnSearchNameChanged}
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
                    selectRow={selectRowConfig}
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
    );
}

export default CouponTicketList;