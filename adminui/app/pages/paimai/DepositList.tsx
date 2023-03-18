import {useEffect, useState} from "react";
import {DefaultListSearchParams, defaultSelectRowConfig, PageSizeOptions, showDeleteAlert, showToastError, showToastSuccess} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import {Badge, Button, Col, Dropdown, Form, FormControl, FormGroup, FormLabel, Image, InputGroup, Modal, Row} from "react-bootstrap";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import BootstrapTable from "react-bootstrap-table-next";
import SinglePagination from "~/components/pagination/SinglePagination";
import FigureImage from "react-bootstrap/FigureImage";
import {Delete, Edit, Eye, MoreVertical, User} from "react-feather";


const DepositList = (props: any) => {
    const {show, onHide, selectedRow} = props;
    const [list, setList] = useState<any>({records: []});
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams, goodsId: selectedRow.id});
    const searchFetcher = useFetcher();
    const deleteFetcher = useFetcher();

    useEffect(()=>{
        if(show) {
            searchFetcher.submit(searchState, {method: 'get', action: '/paimai/deposits'});
        }
    }, [show]);

    useEffect(() => {
        if (deleteFetcher.data && deleteFetcher.type === 'done') {
            if (deleteFetcher.data.success) {
                showToastSuccess('操作成功');
                searchFetcher.submit(searchState, {method: 'get', action: '/paimai/deposits'});
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
        searchFetcher.submit(searchState, {method: 'get', action: '/paimai/deposits'});
    }
    const handlePageSizeChanged = (newValue: any) => {
        searchState.pageSize = parseInt(newValue.value);
        setSearchState({...searchState});
        searchFetcher.submit(searchState, {method: 'get', action: '/paimai/deposits'});
    }
    const handleOnSearchNameChanged = (e: any) => {
        setSearchState({...searchState, memberName: e.target.value});
    }
    const handleOnSearchSubmit = () => {
        //设置分页为1
        setSearchState({...searchState, pageNo: 1});
    }
    const handleOnAction = (row: any, e: any) => {
        switch (e) {
            case 'refund':
                //删除按钮
                showDeleteAlert(function () {
                    deleteFetcher.submit({id: row.id}, {method: 'delete', action: `/paimai/deposits/refund?id=${row.id}`, replace: true});
                });
                break;
        }
    }
    const columns: any[] = [
        {
            text: 'ID',
            dataField: 'id',
        },
        {
            text: '缴纳人',
            dataField: '',
            isDummyField: true,
            headerStyle: {width: 200},
            formatter: (cell:any, row:any) => {
                return (
                    <div className={'d-flex align-items-center'}>
                        {!row.memberAvatar ? <User size={40} /> : <Image src={row.memberAvatar} roundedCircle={true} width={40} height={40} className={'badge-minimal'} />}
                        <span className={'ml-1'}>{row.memberName} {row.memberPhone}</span>
                    </div>
                );
            }
        },
        {
            text: '支付金额',
            dataField: 'price',
        },
        {
            text: '交易单号',
            dataField: 'transactionId',
            style: {wordBreak: 'break-all', wordWrap: 'break-word'}
        },
        {
            text: '创建时间',
            dataField: 'createTime',
        },
        {
            text: '资金状态',
            dataField: 'status_dictText',
            formatter(cell:number, row: any) {
                if(row.status == 0) {
                    return <Badge variant={'light'}>{row.status_dictText}</Badge>
                }
                else if(row.status == 1) {
                    return <Badge variant={'success'}>{row.status_dictText}</Badge>
                }
                else if(row.status == 2) {
                    return <Badge variant={'danger'}>{row.status_dictText}</Badge>
                }
                return <Badge variant={'dark'}>未知</Badge>
            }
        },
        {
            text: '操作',
            dataField: 'operation',
            formatter: (cell: any, row: any) => {
                if(row.status == 1) {
                    return (
                        <div className={'d-flex align-items-center'}>
                            <a href={'#'} onClick={() => handleOnAction(row, 'offers')}>退款</a>
                        </div>
                    );
                }
                return <></>;
            },
        },
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
                <Modal.Title id={'edit-modal'}>保证金记录</Modal.Title>
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
                            <searchFetcher.Form action={'/paimai/deposits'} className={'form-inline justify-content-end'}
                                                onSubmit={handleOnSearchSubmit}>
                                <FormControl name={'pageNo'} value={1} type={'hidden'}/>
                                <FormControl name={'goodsId'} value={selectedRow.id} type={'hidden'}/>
                                <FormControl name={'column'} value={searchState.column} type={'hidden'}/>
                                <FormControl name={'order'} value={searchState.order} type={'hidden'}/>
                                <FormControl name={'pageSize'} value={searchState.pageSize} type={'hidden'}/>

                                <FormGroup as={Form.Row} className={'mb-0'}>
                                    <FormLabel htmlFor={'memberName'}>用户昵称</FormLabel>
                                    <Col>
                                        <InputGroup>
                                            <FormControl name={'memberName'} autoComplete={'off'} onChange={handleOnSearchNameChanged}
                                                         placeholder={'请输入要搜索的内容'}/>
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

export default DepositList;