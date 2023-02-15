import {DragEventHandler, useState} from "react";
import _ from "lodash";
import {ControlType, getControl, getControls, getModule, getModules, ModuleType} from "~/components/page-designer/component";
import PageSettings from "~/components/page-designer/page";
import {Button, Col, Collapse, Container, Form, Row} from "react-bootstrap";
import register from './registers';
import classNames from "classnames";
import {ArrowDown, ArrowUp, Copy, Delete, Edit2, File, Grid, Layers, PlusCircle, Settings, XCircle} from "react-feather";
import {showDeleteAlert} from "~/utils/utils";
import { MINI_APP_HEADER } from "./controls/MiniAppHeader";
import { POP_ADVERTISE } from "./controls/PopAdvertise";

export declare interface PageType {
    title: string;
    id: number;
    canDelete: boolean;
    style?: any;
    modules?: ModuleType[],
    controls?: ControlType[],
}

export declare interface PageDesignerProps {
    pages: PageType[];
    style?: any;
    settings?: any;
    backable?: boolean;
    onDataSaved?: (values: any) => Promise<any>;
    lockPage?: boolean;
}

register();


const PageDesigner = (props: any) => {
    const {settings, lockPage = false} = props;
    const [tabIndex, setTabIndex] = useState("module");
    const [pages, setPages] = useState<PageType[]>(props.pages);
    const [placeholder, setPlaceholder] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [showTools, setShowTools] = useState<boolean>(false);
    const [preview, setPreview] = useState<boolean>(false);
    const [toolTop, setToolTop] = useState<number>(0);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [currentPage, setCurrentPage] = useState<PageType>(props.pages[0]);
    const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
    const [currentData, setCurrentData] = useState<any>();
    const [newPageVisible, setNewPageVisible] = useState<boolean>(false);
    const groupedModules: string[] = _.union(getModules().map(item => item.group).sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    }));
    const _modules = currentPage.modules || [];
    const _controls = currentPage.controls || [];
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
    const onControlSelected = (e: any, item: ControlType) => {
        currentPage.controls = currentPage.controls || [];
        if (e.target.checked) {
            if (_.findIndex(currentPage.controls, (o) => o.key == item.key) < 0) {
                currentPage.controls.push({...item});
            }
        } else {
            _.remove(currentPage.controls, o => o.key == item.key);
        }
        setCurrentPage({...currentPage});
    }
    const refreshPage = () => {
        // setCurrentPage({ ...currentPage });
        pages[currentPageIndex] = currentPage;
        setPages([...pages]);
    }
    const onModuleDragStart: DragEventHandler<HTMLDivElement> = (e: any) => {
        setPlaceholder(true);
        e.dataTransfer.effectAllowed = 'copyMove';
        e.dataTransfer.setData('itemKey', e.target.dataset.item);
    }
    const onModuleDragEnd = () => {
        setPlaceholder(false);
    }
    const onModuleContainerDragEnter: DragEventHandler<HTMLDivElement> = (e: any) => {
        if (e.target.dataset.type === 'placeholder') {
            e.target.className = classNames('placeholder', 'placeholderOn');
        }
    }
    const onModuleContainerDragLeave: DragEventHandler<HTMLDivElement> = (e: any) => {
        if (e.target.dataset.type === 'placeholder') {
            e.target.className = classNames('placeholder');
        }
    }
    const onModuleContainerDragOver: DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
    }
    const onModuleContainerDrop: DragEventHandler<HTMLDivElement> = (e: any) => {
        let itemKey = e.dataTransfer.getData('itemKey');
        let index = e.target.dataset.index;
        if (itemKey && index) {
            let module = {...getModule(itemKey)};
            if (_modules.length == 0) {
                _modules.push(module);
            } else {
                _modules.splice(index, 0, module);
            }
            currentPage.modules = _modules;
            refreshPage();
        }
    }
    const onModuleMouseEnter = (e: any) => {
        let top = e.currentTarget.getBoundingClientRect().top - 99;
        setToolTop(top);
        setShowTools(true);
        setActiveIndex(parseInt(e.currentTarget.dataset.index));
    }
    const onModuleMouseLeave = (e: any) => {
        setShowTools(false);
    }
    const removeModule = () => {
        _modules.splice(activeIndex, 1);
        currentPage.modules = _modules;
        setCurrentData(null);
        refreshPage();
    }

    const addModule = (item: any) => {
        //复制数据避免引用同一个数据
        _modules.push({...item});
        currentPage.modules = _modules;
        refreshPage();
    }
    //上移
    const up = () => {
        _modules.splice(activeIndex - 1, 0, _modules[activeIndex]);
        _modules.splice(activeIndex + 1, 1);
        let module = _modules[activeIndex - 1];
        setCurrentData({
            data: module.data,
            dataIndex: activeIndex - 1,
            type: 2,
            settings: getModule(module.key).settings
        });
        currentPage.modules = _modules;
        setShowTools(false);
        refreshPage();
    };

    //下移
    const down = () => {
        _modules.splice(activeIndex + 2, 0, _modules[activeIndex]);
        _modules.splice(activeIndex, 1);
        let module = _modules[activeIndex + 1];
        setCurrentData({
            data: module.data,
            dataIndex: activeIndex + 1,
            type: 2,
            settings: getModule(module.key).settings
        });
        currentPage.modules = _modules;
        setShowTools(false);
        refreshPage();
    };

    //复制模块
    const copy = () => {
        let item = JSON.stringify(_modules[activeIndex]);
        _modules.push(JSON.parse(item));
        currentPage.modules = _modules;
        refreshPage();
    };
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
                                className={classNames(tabIndex === 'module' ? 'on' : '')}>
                                <Grid size={18} style={{fontSize: 18, marginBottom: 5}}/>模块
                            </li>
                            <li key='page' onClick={() => setTabIndex('page')}
                                className={classNames(tabIndex === 'page' ? 'on' : '')}>
                                <File size={18} style={{fontSize: 18, marginBottom: 5}}/> 页面
                            </li>
                            <li key='control' onClick={() => setTabIndex('control')}
                                className={classNames(tabIndex === 'control' ? 'on' : '')}>
                                <Layers size={18} style={{fontSize: 18, marginBottom: 5}}/>控件
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
                                                    style={{color: currentPageIndex == index ? '#000': '#333'}}>{item.title}</div>
                                                <div>
                                                    <Edit2 onClick={() => onPageChanged(item, index)} size={16} className={'anticon'}/>
                                                    {currentPageIndex == index &&
                                                        <Settings style={{marginLeft: 10}} onClick={() => onPageSettings(item, index)} size={16} className={'anticon'}/>}
                                                    {(currentPageIndex != index && item?.canDelete && !lockPage) ?
                                                        <Delete style={{marginLeft: 10}} className={'anticon'} size={16} onClick={() => {
                                                            showDeleteAlert(() => {
                                                                if (index !== currentPageIndex) {
                                                                    pages.splice(index, 1);
                                                                    setPages([...pages]);
                                                                    setCurrentPageIndex(0);
                                                                    setCurrentPage(pages[0]);
                                                                }
                                                            })
                                                        }}/>
                                                        : <></>}
                                                </div>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                            {!lockPage &&
                                <Button style={{borderRadius: 40}} type="primary" block
                                        onClick={() => setNewPageVisible(true)}>新建自定义页面</Button>
                            }
                        </div>
                        <div className={'control'} style={{display: tabIndex === 'module' ? 'block' : 'none', padding: 0}}>
                            <div></div>
                        </div>
                        <div className={'control'} style={{display: tabIndex === 'control' ? 'block' : 'none'}}>
                            <ul className={'pages'}>
                                {
                                    getControls().map((item: any) => {
                                        const index = _.findIndex(currentPage.controls, o => o.key == item.key);
                                        return (
                                            <li key={item.key}>
                                                <Form.Check disabled={item.required}
                                                            checked={index >= 0}
                                                            onChange={(e: any) => onControlSelected(e, item)} label={item.name}/>
                                                <Settings size={16} onClick={() => {
                                                    if (index >= 0) {
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


                        <div className={'designerContent'} onClick={() => setCurrentData(null)}>&nbsp;</div>
                        <div className={'mobileContainer'} style={currentPage.style}>
                            {_controls.filter(item => item.key === MINI_APP_HEADER).map((item: any) => {
                                const Component = getControl(item.key).designer;
                                const settings = getControl(item.key).settings;
                                const index = _.findIndex(currentPage.controls, o => o.key == item.key);
                                return <Component key={item.key} data={item?.data} dataKey={item.key} onActive={(key: string) => {
                                    setCurrentData({type: 1, dataIndex: index, settings: settings, data: item.data});
                                }}/>
                            })}
                            <div className={'module'} style={{marginTop: currentPage.controls![0].data.basic.hide? 0:50}} onDrop={onModuleContainerDrop}
                                 onDragEnter={onModuleContainerDragEnter} onDragLeave={onModuleContainerDragLeave}
                                 onDragOver={onModuleContainerDragOver}>
                                {placeholder &&
                                    <div className={'placeholder'} data-index={0} data-type="placeholder">放在这里</div>}
                                {_modules.map((item: any, index: number) => {
                                    const Component = getModule(item.key).designer;
                                    const settings = getModule(item.key).settings;
                                    const onClassName = (index == currentData?.dataIndex && currentData?.type == 2) ? 'moduleItemOn' : '';
                                    return <Component onMouseEnter={onModuleMouseEnter} onMouseLeave={onModuleMouseLeave}
                                                      placeholder={placeholder}
                                                      dataKey={item.key}
                                                      className={classNames('moduleItem', onClassName)} index={index}
                                                      key={item.key + index} data={item?.data} onActive={(key: string) => {
                                        setCurrentData({type: 2, dataIndex: index, settings: settings, data: item.data});
                                    }}/>
                                })}
                            </div>
                            {_controls.filter(item => item.key === POP_ADVERTISE).map((item: any) => {
                                const Component = getControl(item.key).designer;
                                const settings = getControl(item.key).settings;
                                const index = _.findIndex(currentPage.controls, o => o.key == item.key);
                                return <Component key={item.key} data={item?.data} dataKey={item.key} onActive={(key: string) => {
                                    setCurrentData({type: 1, dataIndex: index, settings: settings, data: item.data});
                                }}/>
                            })}
                            {
                                showTools &&
                                <ul style={{top: toolTop, padding: 0}} onMouseEnter={() => setShowTools(true)}
                                    onMouseLeave={() => setShowTools(false)} className={'xcxModuleOption'}>
                                    {activeIndex > 0 && <li onClick={up}><ArrowUp size={14} /></li>}
                                    <li onClick={removeModule}><XCircle size={14} /></li>
                                    <li onClick={copy}><Copy size={14} /></li>
                                    {activeIndex < _modules.length - 1 && <li onClick={down}><ArrowDown size={14} /></li>}
                                </ul>
                            }
                            {_modules.length == 0 && !placeholder &&
                                <div className={'nomodule'}><h2>拖动或点击左侧模块进行页面DIY</h2></div>}
                        </div>


                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default PageDesigner;