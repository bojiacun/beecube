import {DragEventHandler, FC, useEffect, useState} from "react";
import _ from "lodash";
import {ControlType, getControl, getControls, getModule, getModules, ModuleType} from "~/components/page-designer/component";
import PageSettings, {DEFAULT_PAGE_DATA} from "~/components/page-designer/page";
import {Button, Col, Container, Modal, Row, Form} from "react-bootstrap";
import classNames from "classnames";
import {ArrowDown, ArrowUp, Copy, Delete, Edit2, File, Grid, Layers, PlusCircle, Settings, Trash2, X} from "react-feather";
import {handleSaveResult, showDeleteAlert, showToastError, showToastSuccess} from "~/utils/utils";
import {MINI_APP_HEADER} from "./controls/MiniAppHeader";
import {POP_ADVERTISE} from "./controls/PopAdvertise";
import {AnimatePresence, motion} from "framer-motion";
import Collapse from 'rc-collapse';
import collapseMotion from "~/components/page-designer/motion";
import {POP_ATTENTION} from "~/components/page-designer/controls/PopAttention";
import BootstrapInput from "~/components/form/BootstrapInput";
import {Formik, Form as FormikForm} from "formik";
import * as Yup from "yup";

export declare interface PageType {
    title: string;
    identifier: string;
    id: number;
    canDelete: boolean;
    style?: any;
    modules?: ModuleType[],
    controls?: ControlType[],
}

export declare interface PageDesignerProps extends Partial<any> {
    pages: PageType[];
    style?: any;
    backable?: boolean;
    onDataSaved?: (values: any) => Promise<any>;
    onNewPageSave?: (values: any) => Promise<any>;
    onDeletePage ?: (values: any) => Promise<any>;
    lockPage?: boolean;
}

const newPageSchema = Yup.object().shape({
    title: Yup.string().required('必填字段'),
    identifier: Yup.string().required('必填字段')
});

const PageDesigner: FC<PageDesignerProps> = (props) => {
    const {links, lockPage = false, onDataSaved} = props;
    const [tabIndex, setTabIndex] = useState("module");
    const [pages, setPages] = useState<PageType[]>([]);
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

    useEffect(() => {
        if (props.pages) {
            props.pages.forEach((item, i) => {
                let controls = item.controls || [];
                if (_.findIndex(controls, o => o.key == MINI_APP_HEADER) < 0) {
                    let control = {...getControl(MINI_APP_HEADER)};
                    delete control.designer;
                    delete control.settings;
                    //添加默认导航栏
                    controls.push(control);
                }
                item.controls = controls;
                item.style = {...DEFAULT_PAGE_DATA, ...item?.style};
                if(i > 0) {
                    item.canDelete = true;
                }
            });
            setPages([...props.pages]);
        }
    }, [props.pages]);

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
    let SettingsComponent = currentData?.type ? currentData!.settings : null;
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

    const handleOnNewPage = (values: any) => {
        values.modules = [];
        values.style = DEFAULT_PAGE_DATA;
        values.controls = [];
        props.onNewPageSave && props.onNewPageSave(values).then(res=>{
            setNewPageVisible(false);
        });
    }

    return (
        <Container id={'diy-container'} fluid>
            <Row style={{backgroundColor: 'white', padding: '0 20px', fontWeight: 'bold', zIndex: 22}}>
                <Col className={'header'}>
                    <Button variant={'light'} style={{marginRight: 20, display: 'none'}}>预览</Button>
                    <Button disabled={saving} onClick={() => {
                        setSaving(true);
                        if (onDataSaved) {
                            onDataSaved(currentPage).then((res) => {
                                setSaving(false);
                                if (!res.data.success) {
                                    showToastError(res.data.message);
                                } else {
                                    showToastSuccess('保存成功！');
                                }
                            }).catch(e => {
                                setSaving(false);
                                showToastError('保存失败');
                            });
                        }
                    }}>保存</Button>
                </Col>
            </Row>
            <div style={{height: 'calc(100vh - 64px)', position: 'relative', overflow: 'hidden', width: '100vw'}}>
                <div className={'diy-content'}>
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
                                                    style={{color: currentPageIndex == index ? '#3366CC' : '#333'}}>{item.title}(标识：{item.identifier}){currentPageIndex == index ? '(编辑中)':''}</div>
                                                <div>
                                                    <Edit2 onClick={() => onPageChanged(item, index)} size={16} className={'anticon'}/>
                                                    {currentPageIndex == index &&
                                                        <Settings style={{marginLeft: 10}} onClick={() => onPageSettings(item, index)} size={16} className={'anticon'}/>}
                                                    {(currentPageIndex != index && item?.canDelete && !lockPage) ?
                                                        <Trash2 style={{marginLeft: 10}} className={'anticon'} size={16} onClick={() => {
                                                            showDeleteAlert(() => {
                                                                if (index !== currentPageIndex) {
                                                                    pages.splice(index, 1);
                                                                    setPages([...pages]);
                                                                    setCurrentPageIndex(0);
                                                                    setCurrentPage(pages[0]);
                                                                    props.onDeletePage && props.onDeletePage(item);
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
                                <Button style={{borderRadius: 40, width: '100%'}} variant="primary" onClick={() => setNewPageVisible(true)}>新建自定义页面</Button>
                            }
                            <Modal
                                onHide={() => setNewPageVisible(false)}
                                show={newPageVisible}
                                size={'lg'}
                                backdrop={'static'}
                                aria-labelledby={'edit-modal'}
                                centered
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        新建自定义页面
                                    </Modal.Title>
                                </Modal.Header>
                                <Formik initialValues={{}} validationSchema={newPageSchema} onSubmit={handleOnNewPage}>
                                    {(formik)=>{
                                        return (
                                            <FormikForm method={'post'}>
                                                <Modal.Body>
                                                    <BootstrapInput label={'页面标识'} name={'identifier'} placeholder={'页面标识，全局唯一，必填'} />
                                                    <BootstrapInput label={'页面标题'} name={'title'} />
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button
                                                        variant={'primary'}
                                                        type={'submit'}
                                                    >
                                                        保存
                                                    </Button>
                                                </Modal.Footer>
                                            </FormikForm>
                                        );
                                    }}
                                </Formik>
                            </Modal>
                        </div>
                        <div className={'control'} style={{display: tabIndex === 'module' ? 'block' : 'none', padding: 0}}>
                            <Collapse accordion={true} openMotion={collapseMotion}>
                                {
                                    groupedModules.map(group => {
                                        return (
                                            <Collapse.Panel key={group} header={group}>
                                                <Row>
                                                    {
                                                        getModules().filter(item => item.group == group).sort((a, b) => {
                                                            if (a.key < b.key) return -1;
                                                            if (a.key > b.key) return 1;
                                                            return 0;
                                                        }).map((item) => {
                                                            return (
                                                                <Col key={item.key} sm={4}>
                                                                    <div className={'componentItem'}
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
                        <div className={'mobileContainer'} style={{...currentPage.style, backgroundImage: `url(${currentPage.style.backgroundImage})`}}>
                            {_controls.filter(item => item.key === MINI_APP_HEADER).map((item: any) => {
                                const Component = getControl(item.key).designer;
                                const settings = getControl(item.key).settings;
                                const index = _.findIndex(currentPage.controls, o => o.key == item.key);
                                return <Component key={item.key} links={links} data={item?.data} dataKey={item.key} onActive={(key: string) => {
                                    setCurrentData({type: 1, dataIndex: index, settings: settings, data: item.data});
                                }}/>
                            })}
                            <div className={'module'} style={{marginTop: currentPage.controls![0].data.basic.hide ? 0 : 50}} onDrop={onModuleContainerDrop}
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
                                                      links={links}
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
                                return <Component key={item.key} data={item?.data} links={links} dataKey={item.key} onActive={(key: string) => {
                                    setCurrentData({type: 1, dataIndex: index, settings: settings, data: item.data});
                                }}/>
                            })}
                            {_controls.filter(item => item.key === POP_ATTENTION).map((item: any) => {
                                const Component = getControl(item.key).designer;
                                const settings = getControl(item.key).settings;
                                const index = _.findIndex(currentPage.controls, o => o.key == item.key);
                                return <Component key={item.key} data={item?.data} links={links} dataKey={item.key} onActive={(key: string) => {
                                    setCurrentData({type: 1, dataIndex: index, settings: settings, data: item.data});
                                }}/>
                            })}
                            {
                                showTools &&
                                <ul style={{top: toolTop, padding: 0}} onMouseEnter={() => setShowTools(true)}
                                    onMouseLeave={() => setShowTools(false)} className={'xcxModuleOption'}>
                                    {activeIndex > 0 && <li onClick={up}><span><ArrowUp size={14}/></span></li>}
                                    <li onClick={removeModule}><span><X size={14}/></span></li>
                                    <li onClick={copy}><span><Copy size={14}/></span></li>
                                    {activeIndex < _modules.length - 1 && <li onClick={down}><span><ArrowDown size={14}/></span></li>}
                                </ul>
                            }
                            {_modules.length == 0 && !placeholder &&
                                <div className={'nomodule'}><h2>拖动或点击左侧模块进行页面DIY</h2></div>}
                        </div>

                        <AnimatePresence mode={'wait'}>
                            {currentData != null &&
                                <motion.div transition={{duration: 0.5}} initial={{right: -400}} animate={{right: 0}} exit={{right: -400}} className={'attributeContainer'}
                                            style={{height: '100%', borderTop: '1px solid #eee'}}>
                                    {SettingsComponent && <SettingsComponent links={links} data={currentData?.data} onUpdate={(data: any) => {
                                        let itemData = {};
                                        if (currentData!.type == 1) {
                                            //控件类型数据
                                            itemData = currentPage!.controls![currentData!.dataIndex].data;
                                            itemData = {...itemData, ...data};
                                            currentPage!.controls![currentData!.dataIndex].data = itemData;
                                        } else if (currentData!.type == 2) {
                                            itemData = currentPage!.modules![currentData!.dataIndex].data;
                                            itemData = {...itemData, ...data};
                                            currentPage!.modules![currentData!.dataIndex].data = itemData;
                                        } else if (currentData!.type == 3) {
                                            itemData = data;
                                            currentPage.style = itemData;
                                        }
                                        refreshPage();
                                    }}/>}
                                </motion.div>
                            }
                        </AnimatePresence>

                    </div>
                </div>
            </div>
        </Container>
    );
}

export default PageDesigner;