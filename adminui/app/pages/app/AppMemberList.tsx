import React, {useEffect, useState} from "react";
import {Link, useFetcher, useLoaderData} from "@remix-run/react";
import {
    DefaultListSearchParams,
    emptySortFunc,
    handleResult,
    headerSortingClasses,
    PageSizeOptions,
    showDeleteAlert,
} from "~/utils/utils";
import {
    Badge,
    Button,
    Card,
    Col,
    Form,
    FormControl,
    FormGroup,
    FormLabel,
    Image,
    InputGroup,
    Row
} from "react-bootstrap";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import BootstrapTable from "react-bootstrap-table-next";
import SinglePagination from "~/components/pagination/SinglePagination";
import {User} from "react-feather";
import AppMemberEdit from "~/pages/app/AppMemberEdit";
import WalletRecordList from "~/pages/app/WalletRecordList";
import DatePicker from "react-datepicker";
import moment from "moment";
import numeral from 'numeral';
import ScoreRecordList from "~/pages/app/ScoreRecordList";


const AppMemberList = (props: any) => {
    const {startPageLoading, stopPageLoading, isChildren = false} = props;
    const [list, setList] = useState<any>(useLoaderData());
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams, startTime: null, endTime: null});
    const [editModal, setEditModal] = useState<any>();
    const [parent, setParent] = useState<any>();
    const [selectedRow, setSelectedRow] = useState<any>();
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [walletShow, setWalletShow] = useState<boolean>(false);
    const [scoreShow, setScoreShow] = useState<boolean>(false);
    const searchFetcher = useFetcher();
    const parentFetcher = useFetcher();
    const deleteFetcher = useFetcher();


    useEffect(() => {
        if (isChildren) {
            searchState.shareId = location.pathname.split('/')[3];
            setSearchState({...searchState});
            parentFetcher.load('/app/members/info?id=' + searchState.shareId);
        }
    }, []);

    const loadData = () => {
        searchFetcher.submit(searchState, {method: 'get'});
    }

    useEffect(() => {
        if (searchFetcher.type === 'done' && searchFetcher.data) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);

    useEffect(() => {
        if (parentFetcher.type === 'done' && parentFetcher.data) {
            setParent(parentFetcher.data);
        }
    }, [parentFetcher.state]);
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
            case 'score':
                setSelectedRow(row);
                setScoreShow(true);
                break;
            case 'edit':
                setEditModal(row);
                break;
            case 'delete':
                //删除按钮
                showDeleteAlert(function () {
                    startPageLoading();
                    deleteFetcher.submit({id: row.id}, {
                        method: 'delete',
                        action: `/app/members/delete?id=${row.id}`,
                        replace: true
                    });
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
            text: '用户ID',
            dataField: 'id',
        },
        {
            text: '上级用户ID',
            dataField: 'shareId',
        },
        {
            text: '头像昵称',
            isDummyField: true,
            formatter: (cell: any, row: any) => {
                return (
                    <div className={'d-flex align-items-center'}>
                        {!row.avatar ? <User size={40}/> :
                            <Image src={row.avatar} roundedCircle={true} width={40} height={40}
                                   className={'badge-minimal'}/>}
                        <span className={'ml-1'}>{row.nickname}</span>
                    </div>
                );
            }
        },
        {
            text: '真实姓名',
            dataField: 'realname',
        },
        {
            text: '手机号',
            dataField: 'phone',
            headerStyle: {width: 150},
        },
        {
            text: '余额/积分',
            dataField: 'money',
            headerStyle: {width: 120},
            isDummyField: true,
            formatter(cell: number, row: any) {
                return `￥${numeral(row.money).format('0,0.00')}/${numeral(row.score).format('0.00')}`;
            },
        },
        {
            text: '分销商',
            dataField: 'isAgent',
            headerStyle: {width: 120},
            isDummyField: true,
            formatter: (cell: any, row: any) => {
                return (
                    <div style={{textAlign: 'center'}}>
                        <div>
                            {row.isAgent == 1 ? <Badge bg={'success'}>是</Badge> :
                                <Badge bg={'danger'}>否</Badge>}
                        </div>
                        <div><Link to={'/app/members/' + row.id}>下级用户</Link></div>
                    </div>
                );
            }
        },
        {
            text: '状态',
            dataField: 'status_dictText',
            headerStyle: {width: 100},
            isDummyField: true,
            formatter: (cell: any, row: any) => {
                return (
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <div style={{marginBottom: 5}}>
                            {row.status == 1 ? <Badge bg={'success'}>{row.status_dictText}</Badge> :
                                <Badge bg={'danger'}>{row.status_dictText}</Badge>}
                        </div>
                        <div>
                            {row.authStatus == 2 && <Badge bg={'success'}>{row.authStatus_dictText}</Badge>}
                            {row.authStatus == 1 && <Badge bg={'warning'}>{row.authStatus_dictText}</Badge>}
                            {row.authStatus == 0 && <Badge bg={'dark'}>{row.authStatus_dictText}</Badge>}
                        </div>
                    </div>
                );
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
                        <a href={'#'} onClick={() => handleOnAction(row, 'wallet')}> 资金流水 </a>
                        <span className={'divider'}/>
                        <a href={'#'} onClick={() => handleOnAction(row, 'score')}> 积分流水 </a>
                        <span className={'divider'}/>
                        <a href={'#'} onClick={() => handleOnAction(row, 'edit')}> 编辑 </a>
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
    const handleOnAuthStatusChange = (e: any) => {
        setSearchState({...searchState, authStatus: e.target.checked ? 'on' : null});
    }
    const handleOnIsAgentChange = (e: any) => {
        setSearchState({...searchState, isAgent: e.target.checked ? 'on' : null});
    }
    const handleOnUsernameChanged = (e: any) => {
        setSearchState({...searchState, keywords: e.target.value});
    }

    const handleOnStartSearchTime = () => {

    }
    const handleOnEndSearchTime = () => {

    }

    return (
        <>
            <Card>
                <div className={'m-2'}>
                    <Row>
                        <Col md={2} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                            <h4 className="mb-0 me-1">{isChildren ? (parent?.nickname || parent?.realname) + '下级用户' : '会员管理'}</h4>
                            <ReactSelectThemed
                                id={'role-page-size'}
                                placeholder={'分页大小'}
                                isSearchable={false}
                                defaultValue={PageSizeOptions[0]}
                                options={PageSizeOptions}
                                className={'per-page-selector d-inline-block ml-50 mr-1'}
                                onChange={handlePageSizeChanged}
                            />
                            {isChildren && <Link to={'/app/members'}>返回列表</Link>}
                        </Col>
                        <Col md={10}>
                            <searchFetcher.Form className={'form-inline justify-content-end'}
                                                onSubmit={handleOnSearchSubmit}>
                                <FormControl name={'pageNo'} value={1} type={'hidden'}/>
                                <FormControl name={'shareId'} value={searchState.shareId} type={'hidden'}/>
                                <FormControl name={'column'} value={searchState.column} type={'hidden'}/>
                                <FormControl name={'order'} value={searchState.order} type={'hidden'}/>
                                <FormControl name={'pageSize'} value={searchState.pageSize} type={'hidden'}/>
                                <FormControl name={'startDate'} value={moment(startDate).isValid() ? moment(startDate).format('YYYY-MM-DD') : ''} type={'hidden'}/>
                                <FormControl name={'endDate'} value={moment(endDate).isValid() ? moment(endDate).format('YYYY-MM-DD') : ''} type={'hidden'}/>
                                <FormGroup as={Row} className={'align-items-center justify-content-end'}>
                                    <FormLabel column md={'auto'}>注册时间：</FormLabel>
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
                                    <FormLabel column md={'auto'}>是否分销商：</FormLabel>
                                    <Col md={'auto'}>
                                        <Form.Switch name={'isAgent'} id={'isAgent'} onChange={handleOnIsAgentChange}/>
                                    </Col>
                                    <FormLabel column md={'auto'}>待审核：</FormLabel>
                                    <Col md={'auto'}>
                                        <Form.Switch name={'authStatus'} id={'authStatus'} onChange={handleOnAuthStatusChange}/>
                                    </Col>
                                    <FormLabel column htmlFor={'keywords'} md={'auto'}>关键字：</FormLabel>
                                    <Col md={'auto'}>
                                        <FormControl name={'keywords'} onChange={handleOnUsernameChanged}
                                                     placeholder={'会员昵称、真实姓名、手机号、ID等'}/>
                                    </Col>
                                    <Col md={'auto'}>
                                        <Button type={'submit'}>搜索</Button>
                                    </Col>
                                </FormGroup>

                            </searchFetcher.Form>
                        </Col>
                    </Row>
                </div>

                <BootstrapTable classes={'table-layout-fixed position-relative b-table'} striped hover columns={columns}
                                bootstrap4
                                data={list?.records}
                                keyField={'id'}/>


                <div className={'mx-2 mb-2 mt-1'}>
                    <Row>
                        <Col sm={6}
                             className={'d-flex align-items-center justify-content-center justify-content-sm-start'}>
                        <span
                            className="text-muted">共 {list?.total} 条记录 显示 {(list?.current - 1) * list.size + 1} 至 {list?.current * list.size > list.total ? list.total : list?.current * list.size} 条</span>
                        </Col>
                        <Col sm={6}
                             className={'d-flex align-items-center justify-content-center justify-content-sm-end'}>
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

            {editModal && <AppMemberEdit model={editModal} refreshData={loadData} onHide={() => {
                setEditModal(null);
            }}/>}
            {selectedRow && walletShow &&
                <WalletRecordList show={walletShow} selectedRow={selectedRow} onHide={() => {
                    setEditModal(null);
                    setWalletShow(false);
                }}/>
            }
            {selectedRow && scoreShow &&
                <ScoreRecordList show={true} selectedRow={selectedRow} onHide={() => {
                    setEditModal(null);
                    setScoreShow(false);
                }}/>
            }
        </>
    );
}

export default AppMemberList;