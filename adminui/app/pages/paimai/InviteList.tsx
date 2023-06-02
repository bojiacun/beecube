import {useEffect, useState} from "react";
import {DefaultListSearchParams, defaultSelectRowConfig, PageSizeOptions, showDeleteAlert, showToastError, showToastSuccess} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import {Badge, Button, Col, Dropdown, Form, FormControl, FormGroup, FormLabel, Image, InputGroup, Modal, Row} from "react-bootstrap";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import BootstrapTable from "react-bootstrap-table-next";
import SinglePagination from "~/components/pagination/SinglePagination";
import FigureImage from "react-bootstrap/FigureImage";
import {Delete, Edit, Eye, MoreVertical, User} from "react-feather";


const InviteList = (props: any) => {
    const {show, onHide, selectedRow} = props;
    const [list, setList] = useState<any>({records: []});
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams, performanceId: selectedRow.id});
    const searchFetcher = useFetcher();
    const deleteFetcher = useFetcher();

    useEffect(()=>{
        if(show) {
            searchFetcher.submit(searchState, {method: 'get', action: '/paimai/invites'});
        }
    }, [show]);

    useEffect(() => {
        if (deleteFetcher.data && deleteFetcher.type === 'done') {
            if (deleteFetcher.data.success) {
                showToastSuccess('操作成功');
                searchFetcher.submit(searchState, {method: 'get', action: '/paimai/invites'});
            } else {
                showToastError(deleteFetcher.data.message);
            }
        }
    }, [deleteFetcher.state]);

    useEffect(() => {
        if (searchFetcher.type == 'done' && searchFetcher.data) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);


    const handlePageChanged = (e: any) => {
        searchState.pageNo = e.selected + 1;
        setSearchState({...searchState});
        searchFetcher.submit(searchState, {method: 'get', action: '/paimai/invites'});
    }
    const handlePageSizeChanged = (newValue: any) => {
        searchState.pageSize = parseInt(newValue.value);
        setSearchState({...searchState});
        searchFetcher.submit(searchState, {method: 'get', action: '/paimai/invites'});
    }
    const handleOnSearchNameChanged = (e: any) => {
        setSearchState({...searchState, memberName: e.target.value});
    }
    const handleOnSearchSubmit = () => {
        //设置分页为1
        setSearchState({...searchState, pageNo: 1});
    }

    const columns: any[] = [
        {
            text: '预约码',
            dataField: 'inviteCode',
        },
        {
            text: '真实姓名',
            dataField: 'userName',
        },
        {
            text: '预约人',
            dataField: '',
            isDummyField: true,
            headerStyle: {width: 200},
            formatter: (cell:any, row:any) => {
                return (
                    <div className={'d-flex align-items-center'}>
                        {!row.avatar? <User size={40} /> : <Image src={row.avatar} roundedCircle={true} width={40} height={40} className={'badge-minimal'} />}
                        <span className={'ml-1'}>{row.nickname} {row.phone}</span>
                    </div>
                );
            }
        },
        {
            text: '预计参展时间',
            dataField: 'joinTime',
        },
        {
            text: '创建时间',
            dataField: 'createTime',
        }
    ]
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
                <Modal.Title id={'edit-modal'}>专场预约记录</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className={'m-2'}>
                    <h4>小程序地址页面:/performance/pages/invite?id={selectedRow.id}</h4>
                    <Row>
                        <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                            <ReactSelectThemed
                                placeholder={'分页大小'}
                                isSearchable={false}
                                defaultValue={PageSizeOptions[0]}
                                options={PageSizeOptions}
                                className={'per-page-selector d-inline-block ml-50 me-1'}
                                onChange={handlePageSizeChanged}
                            />
                        </Col>
                        <Col md={6} className={'d-flex align-items-center justify-content-end'}>
                            <searchFetcher.Form action={'/paimai/invites'} className={'form-inline justify-content-end'}
                                                onSubmit={handleOnSearchSubmit}>
                                <FormControl name={'pageNo'} value={1} type={'hidden'}/>
                                <FormControl name={'goodsId'} value={selectedRow.id} type={'hidden'}/>
                                <FormControl name={'column'} value={searchState.column} type={'hidden'}/>
                                <FormControl name={'order'} value={searchState.order} type={'hidden'}/>
                                <FormControl name={'pageSize'} value={searchState.pageSize} type={'hidden'}/>

                                <FormGroup as={Row} className={'mb-0'}>
                                    <FormLabel column htmlFor={'memberName'}>用户昵称</FormLabel>
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

            <Modal.Footer>
            </Modal.Footer>
        </Modal>
    );
}

export default InviteList;