import {useEffect, useState} from "react";
import {useFetcher, useLoaderData} from "@remix-run/react";
import {DefaultListSearchParams, defaultTableExpandRow, emptySortFunc, headerSortingClasses, PageSizeOptions} from "~/utils/utils";
import {Button, Col, Form, FormControl, FormGroup, FormLabel, InputGroup, Row} from "react-bootstrap";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import BootstrapTable from "react-bootstrap-table-next";
import SinglePagination from "~/components/pagination/SinglePagination";


const PermissionList = () => {
    const [list, setList] = useState<any>(useLoaderData());
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams, logType: 1});
    const searchFetcher = useFetcher();

    useEffect(() => {
        if (searchFetcher.data) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);


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
    const handleSort = (field: any, order: any): void => {
        searchState.column = field;
        searchState.order = order;
        setSearchState({...searchState});
        searchFetcher.submit(searchState, {method: 'get'});
    }
    const columns: any[] = [
        {
            text: '日志内容',
            dataField: 'logContent',
        },
        {
            text: '操作人ID',
            dataField: 'userid',
            headerStyle: {width: 150}
        },
        {
            text: '操作人',
            dataField: 'username',
            headerStyle: {width: 150}
        },
        {
            text: 'IP',
            dataField: 'ip',
            headerStyle: {width: 170}
        },
        {
            text: '耗时',
            dataField: 'costTime',
            headerStyle: {width: 170}
        },
        {
            text: '创建时间',
            dataField: 'createTime',
            headerStyle: {width: 200},
            sort: true,
            headerSortingClasses,
            sortFunc: emptySortFunc,
            onSort: handleSort
        },
    ]

    const expandRow = {
        ...defaultTableExpandRow,
        renderer: (row:any) => {
            return (
                <div></div>
            );
        },
    }
    const handleKeywordChanged = (e:any) => {
        setSearchState({...searchState, keyWord: e.target.value});
    }
    const handleOnSearchSubmit = () => {
        //设置分页为1
        setSearchState({...searchState, pageNo: 1});
    }
    return (
        <>
            <div className={'m-2'}>
                <Row>
                    <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                        <h4 className="mb-0">登录日志</h4>
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
                        <searchFetcher.Form className={'form-inline justify-content-end'} onSubmit={handleOnSearchSubmit}>
                            <FormControl name={'pageNo'} value={1} type={'hidden'}/>
                            <FormControl name={'logType'} value={searchState.logType} type={'hidden'}/>
                            <FormControl name={'column'} value={searchState.column} type={'hidden'}/>
                            <FormControl name={'order'} value={searchState.order} type={'hidden'}/>
                            <FormControl name={'pageSize'} value={searchState.pageSize} type={'hidden'}/>

                            <FormGroup as={Form.Row} className={'mb-0'}>
                                <FormLabel htmlFor={'keyWord'}>搜索</FormLabel>
                                <Col>
                                    <InputGroup>
                                        <FormControl name={'keyWord'} onChange={handleKeywordChanged} placeholder={'请输入要搜索的内容'}/>
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
                striped hover columns={columns} bootstrap4 data={list?.records}
                expandRow={expandRow}
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

        </>
    );
}

export default PermissionList;