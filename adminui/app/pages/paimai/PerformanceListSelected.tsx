import {useEffect, useState} from "react";
import {DefaultListSearchParams, defaultSelectRowConfig, PageSizeOptions, showToastError, showToastSuccess} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import {Button, Col, Form, FormControl, FormGroup, FormLabel, InputGroup, Modal, Row} from "react-bootstrap";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import BootstrapTable from "react-bootstrap-table-next";
import SinglePagination from "~/components/pagination/SinglePagination";
import {AwesomeButton} from "react-awesome-button";


const PerformancesListSelected = (props: any) => {
    const {show, setSelectedListShow, selectedAuction} = props;
    const [list, setList] = useState<any>({records: []});
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams, ac_id: selectedAuction?.id});
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const searchFetcher = useFetcher();
    const removeFetcher = useFetcher();

    useEffect(()=>{
        if(show && selectedAuction) {
            searchState.ac_id = selectedAuction?.id;
            setSearchState({...searchState});
            searchFetcher.submit(searchState, {method: 'get', action: '/paimai/performances/selected'});
        }
    }, [show, selectedAuction]);

    useEffect(() => {
        if (searchFetcher.data) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);

    useEffect(() => {
        if (removeFetcher.data && removeFetcher.type === 'done') {
            if (removeFetcher.data.success) {
                showToastSuccess('移除成功');
                setSelectedListShow(false);
            } else {
                showToastError(removeFetcher.data.message);
            }
        }
    }, [removeFetcher.state]);

    const handlePageChanged = (e: any) => {
        searchState.pageNo = e.selected + 1;
        setSearchState({...searchState});
        searchFetcher.submit(searchState, {method: 'get', action: '/paimai/performances/selected'});
    }
    const handlePageSizeChanged = (newValue: any) => {
        searchState.pageSize = parseInt(newValue.value);
        setSearchState({...searchState});
        searchFetcher.submit(searchState, {method: 'get', action: '/paimai/performances/selected'});
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
            text: '专场名称',
            dataField: 'title',
        },
        {
            text: '专场类型',
            dataField: 'type_dictText',
        },
        {
            text: '开拍时间',
            dataField: 'endTime',
        },
        {
            text: '结束时间',
            dataField: 'endTime',
        },
        {
            text: '排序',
            dataField: 'sortNum',
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
    const handleOnRemovePerformances = () => {
        if(selectedRows.length > 0) {
            //添加
            let data:any = {auctionId: selectedAuction.id, perfIds: selectedRows.join(',')};
            removeFetcher.submit(data, {method: 'post', action: '/paimai/auctions/performances/remove'})
        }
        else{
            setSelectedListShow(false);
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
            onHide={()=>setSelectedListShow(false)}
            centered
            backdrop={'static'}
            aria-labelledby={'edit-modal'}
        >
            <Modal.Header closeButton>
                <Modal.Title id={'edit-modal'}>
                    <p>已选专场</p>
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
                            <searchFetcher.Form action={'/paimai/goods/auction'} className={'form-inline justify-content-end'}
                                                onSubmit={handleOnSearchSubmit}>
                                <FormControl name={'pageNo'} value={1} type={'hidden'}/>
                                <FormControl name={'column'} value={searchState.column} type={'hidden'}/>
                                <FormControl name={'order'} value={searchState.order} type={'hidden'}/>
                                <FormControl name={'pageSize'} value={searchState.pageSize} type={'hidden'}/>

                                <FormGroup as={Form.Row} className={'mb-0'}>
                                    <FormLabel htmlFor={'title'}>专场名称</FormLabel>
                                    <Col>
                                        <InputGroup>
                                            <FormControl name={'title'} autoComplete={'off'} onChange={handleOnSearchNameChanged}
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
            <Modal.Footer>
                <AwesomeButton type={'danger'} onPress={handleOnRemovePerformances} disabled={removeFetcher.state === 'submitting'}>确认移除</AwesomeButton>
            </Modal.Footer>
        </Modal>
    );
}

export default PerformancesListSelected;