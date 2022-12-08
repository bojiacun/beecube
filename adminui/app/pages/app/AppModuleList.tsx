import {Button, Card, Col, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import {useFetcher, useLoaderData} from "@remix-run/react";
import SinglePagination from "~/components/pagination/SinglePagination";
import {DefaultListSearchParams} from "~/utils/utils";
import FigureImage from "react-bootstrap/FigureImage";


const AppModuleList = () => {
    const [list, setList] = useState<any>(useLoaderData());
    const [searchState, setSearchState] = useState<any>(DefaultListSearchParams);
    const searchFetcher = useFetcher();

    const loadData = () => {
        searchFetcher.submit(searchState, {method: 'get'});
    }
    useEffect(() => {
        if (searchFetcher.type === 'done' && searchFetcher.data) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);
    const handlePageChanged = (e: any) => {
        searchState.pageNo = e.selected + 1;
        setSearchState({...searchState});
        loadData();
    }


    return (
        <Card>
            <Card.Header>
                <Card.Title>所有模块</Card.Title>
            </Card.Header>
            <Card.Body>
                <Row>
                    {list?.records.map((m:any)=>{
                        return (
                            <Col sm={12} md={3} lg={2} key={m.id}>
                                <div className={'module-box d-flex flex-column align-items-center justify-space-around'}>
                                    <FigureImage src={m.logo} width={80} height={80} />
                                    <h5 className={'text-bold text-lg'}>{m.name}</h5>
                                    <div className={'text-muted'}>{m.version}</div>
                                    <div>
                                        {m.status == 0 && <Button variant={'primary'} size={'sm'}>安装</Button>}
                                    </div>
                                </div>
                            </Col>
                        );
                    })}
                </Row>
            </Card.Body>
            <Card.Footer>
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
            </Card.Footer>
        </Card>
    );
}

export default AppModuleList;