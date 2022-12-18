import {useEffect, useState} from "react";
import {useFetcher, useLoaderData} from "@remix-run/react";
import {
    DefaultListSearchParams,
    emptySortFunc, handleResult,
    headerSortingClasses,
    PageSizeOptions,
    showDeleteAlert,
    showToastError,
    showToastSuccess
} from "~/utils/utils";
import {Badge, Button, Card, Col, Dropdown, Form, FormControl, FormGroup, FormLabel, Image, InputGroup, Modal, Row} from "react-bootstrap";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import BootstrapTable from "react-bootstrap-table-next";
import SinglePagination from "~/components/pagination/SinglePagination";
import AppEdit from "~/pages/app/AppEdit";
import {Delete, Edit, MoreVertical} from "react-feather";


const AppList = (props: any) => {
    const {startPageLoading, stopPageLoading, setSelectedApp} = props;
    const [list, setList] = useState<any>(useLoaderData());
    const [searchState, setSearchState] = useState<any>(DefaultListSearchParams);
    const [editModal, setEditModal] = useState<any>();
    const searchFetcher = useFetcher();
    const deleteFetcher = useFetcher();
    const disableFetcher = useFetcher();
    const enableFetcher = useFetcher();
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


    useEffect(() => {
        if (disableFetcher.data && disableFetcher.type === 'done') {
            stopPageLoading();
            handleResult(disableFetcher.data, '冻结成功');
            loadData();
        }
    }, [disableFetcher.state]);

    useEffect(() => {
        if (enableFetcher.data && enableFetcher.type === 'done') {
            stopPageLoading();
            handleResult(enableFetcher.data, '解冻成功');
            loadData();
        }
    }, [enableFetcher.state]);

    const handleOnAction = (row: any, e: any) => {
        switch (e) {
            case 'bind-admin':
                setSelectedApp(row);
                break;
            case 'edit':
                //编辑
                setEditModal(row);
                break;
            case 'delete':
                //删除按钮
                showDeleteAlert(function () {
                    startPageLoading();
                    deleteFetcher.submit({id: row.id}, {method: 'delete', action: `/app/delete?id=${row.id}`, replace: true});
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
            text: '应用',
            dataField: 'logo',
            isDummyField: true,
            formatter: (cell:any, row:any) => {
                return (
                    <div className={'d-flex align-items-center'}>
                        <Image src={row.logo} roundedCircle={true} width={40} height={40} className={'badge-minimal'} />
                        <span className={'ml-1'}>{row.name}</span>
                    </div>
                );
            }
        },
        {
            text: '模块',
            dataField: 'moduleName',
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
            text: '操作',
            dataField: 'operation',
            isDummyField: true,
            headerStyle: {width: 190},
            formatter: (cell: any, row: any) => {
                return (
                    <div className={'d-flex align-items-center'}>
                        <a href={`/console?appid=${row.id}`} target={'_blank'}>控制台</a>
                        <span className={'divider'}/>
                        <a href={'#'} onClick={() => handleOnAction(row, 'edit')}>编辑</a>
                        <span className={'divider'}/>
                        <Dropdown as={'span'} onSelect={(e) => handleOnAction(row, e)}>
                            <Dropdown.Toggle as={'span'} className={'noafter'}>
                                <MoreVertical size={16} style={{marginTop: -2}}/>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey={'bind-admin'}>
                                    <div className={'d-flex align-items-center'}><Edit size={16} className={'mr-1'}/>管理员</div>
                                </Dropdown.Item>
                                <Dropdown.Item eventKey={'delete'}>
                                    <div className={'d-flex align-items-center'}><Delete size={16} className={'mr-1'}/>删除</div>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
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

    const handleOnAdd = () => {
        setEditModal({status: '1'});
    }
    return (
        <>
            <Card>
                <div className={'m-2'}>
                    <Row>
                        <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                            <h4 className="mb-0">所有应用</h4>
                            <ReactSelectThemed
                                id={'role-page-size'}
                                placeholder={'分页大小'}
                                isSearchable={false}
                                defaultValue={PageSizeOptions[0]}
                                options={PageSizeOptions}
                                className={'per-page-selector d-inline-block ml-50 mr-1'}
                                onChange={handlePageSizeChanged}
                            />
                            <Button onClick={handleOnAdd} className={'mr-1'}><i className={'feather icon-plus'} />新建应用</Button>
                        </Col>
                        <Col md={6} className={'d-flex align-items-center justify-content-end'}>
                            <searchFetcher.Form className={'form-inline justify-content-end'} onSubmit={handleOnSearchSubmit}>
                                <FormControl name={'pageNo'} value={1} type={'hidden'}/>
                                <FormControl name={'column'} value={searchState.column} type={'hidden'}/>
                                <FormControl name={'order'} value={searchState.order} type={'hidden'}/>
                                <FormControl name={'pageSize'} value={searchState.pageSize} type={'hidden'}/>

                                <FormGroup as={Form.Row} className={'mb-0'}>
                                    <FormLabel htmlFor={'name'}>应用名称</FormLabel>
                                    <Col>
                                        <InputGroup>
                                            <FormControl name={'name'} onChange={handleOnUsernameChanged} placeholder={'请输入要搜索的内容'}/>
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
            {editModal && <AppEdit model={editModal} onHide={()=>{
                setEditModal(null);
                loadData();
            }} />}
        </>
    );
}

export default AppList;