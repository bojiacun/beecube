import {useEffect, useState} from "react";
import {DefaultListSearchParams, defaultSelectRowConfig, PageSizeOptions, showToastError} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import {Button, Col, Form, FormControl, FormGroup, FormLabel, InputGroup, Modal, Row} from "react-bootstrap";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import BootstrapTable from "react-bootstrap-table-next";
import SinglePagination from "~/components/pagination/SinglePagination";
import {AwesomeButton} from "react-awesome-button";


const PositionListSelector = (props: any) => {
    const {show, setPositionListShow, onSelect} = props;
    const [list, setList] = useState<any>({records: []});
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams});
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const searchFetcher = useFetcher();

    const searchUrl = '/system/positions';

    useEffect(()=>{
        if(show) {
            searchFetcher.submit(searchState, {method: 'get', action: searchUrl});
        }
    }, [show]);
    useEffect(() => {
        if (searchFetcher.data) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);



    const handlePageChanged = (e: any) => {
        searchState.pageNo = e.selected + 1;
        setSearchState({...searchState});
        searchFetcher.submit(searchState, {method: 'get', action: searchUrl});
    }
    const handlePageSizeChanged = (newValue: any) => {
        searchState.pageSize = parseInt(newValue.value);
        setSearchState({...searchState});
        searchFetcher.submit(searchState, {method: 'get', action: searchUrl});
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
            text: '序号',
            dataField: 'index',
            formatter: (cell:any, row:any, rowIndex:number) => {
                return rowIndex;
            }
        },
        {
            text: '职务编码',
            dataField: 'code',
        },
        {
            text: '职务名称',
            dataField: 'name',
        },
        {
            text: '职务等级',
            dataField: 'postRank_dictText',
        },
    ]

    const handleOnRowSelect = (row:any, isSelect:boolean) => {
        if(isSelect) {
            setSelectedRows([...selectedRows, row])
        }
        else {
            let selected = selectedRows.filter(x=> x.id !== row.id);
            setSelectedRows([...selected]);
        }
    }
    const hanldeOnRowSelectAll = (isSelect:boolean, rows:any[]) => {
        if(isSelect) {
            setSelectedRows([...rows]);
        }
        else {
            setSelectedRows([]);
        }
    }
    const handleOnSelected = () => {
        setPositionListShow(false);
        onSelect(selectedRows);
        setSelectedRows([]);
    }

    const selectRowConfig = {
        ...defaultSelectRowConfig,
        onSelect: handleOnRowSelect,
        onSelectAll: hanldeOnRowSelectAll,
    }

    return (
        <Modal
            show={show}
            size={'lg'}
            onHide={()=>{
                setSelectedRows([]);
                setPositionListShow(false)
            }}
            centered
            backdrop={'static'}
            aria-labelledby={'edit-modal'}
        >
            <Modal.Header closeButton>
                <Modal.Title id={'edit-modal'}>职务选择</Modal.Title>
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
                            <searchFetcher.Form action={'/system/users'} className={'form-inline justify-content-end'}
                                                onSubmit={handleOnSearchSubmit}>
                                <FormControl name={'pageNo'} value={1} type={'hidden'}/>
                                <FormControl name={'column'} value={searchState.column} type={'hidden'}/>
                                <FormControl name={'order'} value={searchState.order} type={'hidden'}/>
                                <FormControl name={'pageSize'} value={searchState.pageSize} type={'hidden'}/>

                                <FormGroup as={Form.Row} className={'mb-0'}>
                                    <FormLabel htmlFor={'username'}>职务名称</FormLabel>
                                    <Col>
                                        <InputGroup>
                                            <FormControl name={'username'} autoComplete={'off'} onChange={handleOnSearchNameChanged}
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
                <AwesomeButton type={'primary'} onPress={handleOnSelected}>确认选择</AwesomeButton>
            </Modal.Footer>
        </Modal>
    );
}

export default PositionListSelector;