import {Button, Card, Col, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import {useFetcher, useLoaderData} from "@remix-run/react";
import SinglePagination from "~/components/pagination/SinglePagination";
import {DefaultListSearchParams, handleSaveResult} from "~/utils/utils";
import FigureImage from "react-bootstrap/FigureImage";

const semver = require("semver");


const AppModuleList = () => {
    const [list, setList] = useState<any>(useLoaderData());
    const [searchState, setSearchState] = useState<any>(DefaultListSearchParams);
    const searchFetcher = useFetcher();
    const installFetcher = useFetcher();
    const uninstallFetcher = useFetcher();
    const upgradeFetcher = useFetcher();

    const loadData = () => {
        searchFetcher.submit(searchState, {method: 'get'});
    }
    useEffect(() => {
        if (searchFetcher.type === 'done' && searchFetcher.data) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);

    useEffect(() => {
        if (installFetcher.data) {
            handleSaveResult(installFetcher.data, '安装成功');
            loadData();
        }
    }, [installFetcher.data]);
    useEffect(() => {
        if (uninstallFetcher.data) {
            handleSaveResult(uninstallFetcher.data, '卸载成功');
            loadData();
        }
    }, [uninstallFetcher.data]);


    const handlePageChanged = (e: any) => {
        searchState.pageNo = e.selected + 1;
        setSearchState({...searchState});
        loadData();
    }

    const handleOnInstall = (m:any) => {
        installFetcher.submit({}, {method: "put", action: "/app/install/"+m.id});
    }
    const handleOnUnInstall = (m:any) => {
        uninstallFetcher.submit({}, {method: "put", action: "/app/uninstall/"+m.id});
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
                                    <FigureImage src={m.logo} width={60} height={60} rounded={true} />
                                    <h5 className={'text-bold text-lg'}>{m.name}</h5>
                                    <div className={'text-muted'} style={{marginBottom: '0.5rem'}}>{m.version}</div>
                                    <div>
                                        {m.status != 1 && <Button onClick={()=>handleOnInstall(m)} disabled={installFetcher.state === 'submitting'} variant={'primary'} size={'sm'}>安装</Button>}
                                        {m.status == 1 && <Button onClick={()=>handleOnUnInstall(m)} disabled={uninstallFetcher.state === 'submitting'} variant={'danger'} size={'sm'}>卸载</Button>}
                                        {m.status == 1 && semver.gt(m.newVersion, m.version) && <Button disabled={upgradeFetcher.state === 'submitting'} variant={'light'}>升级</Button>}
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