import {defaultRouteCatchBoundary, defaultRouteErrorBoundary} from "~/utils/utils";
import {withPageLoading} from "~/utils/components";
import {Row, Col, Container, Button, Collapse} from "react-bootstrap";
import diyPageStyleUrl from 'app/styles/diy.css';
import {LinksFunction} from "@remix-run/node";
import classNames from "classnames";
import {useState} from "react";
import {Delete, Edit2, File, Grid, Layers, PlusCircle, Settings} from "react-feather";
import _ from 'lodash';
import PageSettings, {DEFAULT_PAGE_DATA} from "~/components/page-designer/page";
import {ControlType, getControls, getModules, ModuleType} from "~/components/page-designer/component";

export const ErrorBoundary = defaultRouteErrorBoundary;
export const CatchBoundary = defaultRouteCatchBoundary;

export const links: LinksFunction = () => {
    return [{rel: 'stylesheet', href: diyPageStyleUrl}];
}

export declare interface PageType {
    title: string;
    id: number;
    canDelete: boolean;
    style?: any;
    modules?: ModuleType[],
    controls?: ControlType[],
}

const DiyPage = (props:any) => {
    const {settings} = props;
    const [tabIndex, setTabIndex] = useState("module");
    const [pages, setPages] = useState<PageType[]>(props.pages);
    const [currentPage, setCurrentPage] = useState<PageType>(props.pages[0]);
    const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
    const [currentData, setCurrentData] = useState<any>();
    const groupedModules: string[] = _.union(getModules().map(item => item.group).sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    }));
    const onPageChanged = (newPage: PageType, index: number) => {
        setCurrentData(null);
        setCurrentPage(newPage);
        setCurrentPageIndex(index);
        pages[index] = newPage;
        setPages([...pages]);
    }
    const onPageSettings = (page: PageType, index: number) => {
        setCurrentPage(page);
        setCurrentData({type: 3, dataIndex: 0, settings: PageSettings, data: {...page.style}});
        setCurrentPageIndex(index);
        pages[index] = page;
        setPages([...pages]);
    }

    return (
        <Container id={'diy-container'} fluid>
            <Row style={{backgroundColor: 'white', padding: '0 20px', fontWeight: 'bold', zIndex: 22}}>
                <Col className={'header'}>
                    <Button variant={'light'} style={{marginRight: 20}}>预览</Button>
                    <Button>保存</Button>
                </Col>
            </Row>
            <Row style={{height: 'calc(100vh - 64px)', position: 'relative', overflow: 'hidden', width: '100vw'}}>
                <Col className={'diy-content'}>
                    <div className={'sider'}>
                        <ul className={'menu'}>
                            <li key='module' onClick={() => setTabIndex('module')}
                                className={classNames(tabIndex === 'module' ? 'on': '')}>
                                <Grid size={18} style={{fontSize: 18, marginBottom: 5}} />模块
                            </li>
                            <li key='page' onClick={() => setTabIndex('page')}
                                className={classNames(tabIndex === 'page' ? 'on': '')}><File size={18}
                                style={{fontSize: 18, marginBottom: 5}}/> 页面
                            </li>
                            <li key='control' onClick={() => setTabIndex('control')}
                                className={classNames(tabIndex === 'control' ? 'on': '')}><Layers size={18}
                                style={{fontSize: 18, marginBottom: 5}}/>控件
                            </li>
                        </ul>
                    </div>
                    <div className={'main'}>
                        <div className={'control'} style={{display: tabIndex === 'page' ? 'block' : 'none'}}>
                            <ul className={'pages'}>
                                {
                                    pages.map((item, index) => {
                                        return (
                                            <li key={index}>
                                                <div
                                                    style={{color: currentPageIndex == index ? settings.primaryColor : '#333'}}>{item.title}</div>
                                                <div>
                                                        <Edit2 onClick={() => onPageChanged(item, index)}
                                                                      className={'anticon'}/>
                                                        {currentPageIndex == index &&
                                                            <Settings onClick={() => onPageSettings(item, index)}
                                                                             className={'anticon'}/>}
                                                        {(currentPageIndex != index && item?.canDelete && !lockPage) ?
                                                            <Popconfirm title="确认要删除此页面吗？" okText="确定" cancelText="取消"
                                                                        onConfirm={() => {
                                                                            if (index !== currentPageIndex) {
                                                                                pages.splice(index, 1);
                                                                                setPages([...pages]);
                                                                                setCurrentPageIndex(0);
                                                                                setCurrentPage(pages[0]);
                                                                            }
                                                                        }}>
                                                                <Delete className={'anticon'}/>
                                                            </Popconfirm>
                                                            : <></>}
                                                </div>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                            {!lockPage &&
                                <Button style={{borderRadius: 40}} type="primary" block icon={<PlusCircle />}
                                        size="large" onClick={() => setNewPageVisible(true)}>新建自定义页面</Button>
                            }
                        </div>
                        <div className={'control'}
                             style={{display: tabIndex === 'module' ? 'block' : 'none', padding: 0}}>
                            <Collapse expandIconPosition="right" bordered={false} ghost={true}>
                                {
                                    groupedModules.map(group => {
                                        return (
                                            <Collapse.Panel key={group} header={group}>
                                                <Row gutter={[10, 10]}>
                                                    {
                                                        getModules().filter(item => item.group == group).sort((a, b) => {
                                                            if (a.key < b.key) return -1;
                                                            if (a.key > b.key) return 1;
                                                            return 0;
                                                        }).map((item) => {
                                                            return (
                                                                <Col span={8} key={item.key}>
                                                                    <div className={styles.componentItem}
                                                                         onClick={() => addModule(item)} draggable={true}
                                                                         data-item={item.key} onDragEnd={onModuleDragEnd}
                                                                         onDragStart={onModuleDragStart}>
                                                                        <img src={item.image} draggable="false"
                                                                             alt={item.name}
                                                                             style={{minHeight: 45, objectFit: 'cover'}}/>
                                                                        <span>{item.name}</span>
                                                                    </div>
                                                                </Col>
                                                            );
                                                        })
                                                    }
                                                </Row>
                                            </Collapse.Panel>
                                        );
                                    })
                                }
                            </Collapse>
                        </div>
                        <div className={'control'} style={{display: tabIndex === 'control' ? 'block' : 'none'}}>
                            <ul className={'pages'}>
                                {
                                    getControls().map((item: any) => {
                                        const index = _.findIndex(currentPage.controls, o => o.key == item.key);
                                        return (
                                            <li key={item.key}>
                                                <Checkbox disabled={item.required}
                                                          checked={index>= 0}
                                                          onChange={(e) => onControlSelected(e, item)}>{item.name}</Checkbox>
                                                <Settings onClick={() => {
                                                    if(index>=0) {
                                                        const settings = getControl(item.key).settings;
                                                        let data = currentPage.controls![index].data;
                                                        setCurrentData({
                                                            type: 1,
                                                            dataIndex: index,
                                                            settings: settings,
                                                            data: data
                                                        });
                                                    }
                                                }} className={'anticon'}/>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default withPageLoading(DiyPage);