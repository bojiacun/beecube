import {useEffect, useState} from "react";
import {useFetcher, useLoaderData} from "@remix-run/react";
import {
    DefaultListSearchParams,
    emptySortFunc, handleResult,
    headerSortingClasses,
    PageSizeOptions,
    showDeleteAlert,
} from "~/utils/utils";
import {Badge, Button, Card, Col, Dropdown, Form, FormControl, FormGroup, FormLabel, Image, InputGroup, Modal, Row} from "react-bootstrap";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import BootstrapTable from "react-bootstrap-table-next";
import SinglePagination from "~/components/pagination/SinglePagination";
import {Delete, Edit, MoreVertical, User} from "react-feather";
import AppMemberEdit from "~/pages/app/AppMemberEdit";
import WalletRecordList from "~/pages/app/WalletRecordList";


const AppMemberList = (props: any) => {
    const {startPageLoading, stopPageLoading} = props;
    const [list, setList] = useState<any>(useLoaderData());
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams});
    const [editModal, setEditModal] = useState<any>();
    const [selectedRow, setSelectedRow] = useState<any>();
    const [walletShow, setWalletShow] = useState<boolean>(false);
    const searchFetcher = useFetcher();
    const deleteFetcher = useFetcher();



    const loadData = () => {
        searchFetcher.submit(searchState, {method: 'get'});
    }

    useEffect(() => {
        if (searchFetcher.type === 'done' && searchFetcher.data) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);


    useEffect(() => {
        if (deleteFetcher.data && deleteFetcher.type === 'done') {
            stopPageLoading();
            handleResult(deleteFetcher.data, '删除成功');
            loadData();
        }
    }, [deleteFetcher.state]);




    const handleOnAction = (row: any, e: any) => {
        switch (e) {
            case 'wallet':
                setSelectedRow(row);
                setWalletShow(true);
                break;
            case 'edit':
                setEditModal(row);
                break;
            case 'delete':
                //删除按钮
                showDeleteAlert(function () {
                    startPageLoading();
                    deleteFetcher.submit({id: row.id}, {method: 'delete', action: `/app/members/delete?id=${row.id}`, replace: true});
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
    const columns: any[] = [
        {
            text: '头像昵称',
            isDummyField: true,
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
            text: '账号',
            dataField: 'username',
        },
        {
            text: '真实姓名',
            dataField: 'realname',
        },
        {
            text: '手机号',
            dataField: 'phone',
        },
        {
            text: '余额',
            dataField: 'money',
        },

        {
            text: '分销商',
            dataField: 'isAgent',
            formatter: (cell:any, row:any) => {
                return row.isAgent == 1 ? <Badge variant={'success'}>是</Badge> : <Badge variant={'danger'}>否</Badge>
            }
        },
        {
            text: '认证状态',
            dataField: 'authStatus_dictText',
            headerStyle: {width: 130},
            formatter: (cell:any, row:any) => {
                return row.authStatus == 1 ? <Badge variant={'success'}>{row.authStatus_dictText}</Badge> : <Badge variant={'danger'}>{row.authStatus_dictText}</Badge>
            }
        },
        {
            text: '状态',
            dataField: 'status_dictText',
            headerStyle: {width: 100},
            formatter: (cell:any, row:any) => {
                return row.status == 1 ? <Badge variant={'success'}>{row.status_dictText}</Badge> : <Badge variant={'danger'}>{row.status_dictText}</Badge>
            }
        },

        {
            text: '创建时间',
            dataField: 'createTime',
            headerStyle: {width: 200},
            sort: true,
            onSort: handleSort,
            headerSortingClasses,
            sortFunc: emptySortFunc
        },
        {
            text: '操作',
            dataField: 'operation',
            isDummyField: true,
            headerStyle: {width: 230},
            formatter: (cell: any, row: any) => {
                return (
                    <div className={'d-flex align-items-center'}>
                        <a href={'#'} onClick={()=>handleOnAction(row, 'wallet')}> 资金流水 </a>
                        <span className={'divider'}/>
                        <a href={'#'} onClick={()=>handleOnAction(row, 'edit')}> 编辑 </a>
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
        setSearchState({...searchState, nickname: e.target.value});
    }

    return (
        <>
            <Card>
                <div className={'m-2'}>
                    <Row>
                        <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                            <h4 className="mb-0">会员管理</h4>
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
                                    <FormLabel htmlFor={'nickname'}>会员昵称</FormLabel>
                                    <Col>
                                        <InputGroup>
                                            <FormControl name={'nickname'} onChange={handleOnUsernameChanged} placeholder={'请输入要搜索的内容'}/>
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

            {editModal && <AppMemberEdit model={editModal} onHide={()=>{
                setEditModal(null);
                loadData();
            }} />}
            {selectedRow && walletShow &&
                <WalletRecordList show={walletShow} selectedRow={selectedRow} onHide={()=>{
                    setEditModal(null);
                    setWalletShow(false);
                }} />
            }
        </>
    );
}

export default AppMemberList;