import { AttributeTabs, registerModule } from "../../component"
import image from 'assets/designer/s1_1.png';
import React, {useEffect, useState} from "react";
import BoxSettings, { DEFAULT_BOX_STYLES } from "../BoxSettings";
import FallbackImage from "~/components/fallback-image";
import { resolveUrl } from "~/utils/utils";
import Collapse from "rc-collapse";
import collapseMotion from "~/components/page-designer/motion";
import {Form, Formik} from "formik";
import BootstrapInput from "~/components/form/BootstrapInput";
import {FormControl, FormGroup, FormLabel, Button} from "react-bootstrap";
import FileBrowserInput from "~/components/filebrowser/form";
import BootstrapLinkSelector from "~/components/form/BootstrapLinkSelector";
import BootstrapSelect from "~/components/form/BootstrapSelect";
import BootstrapFormList from "~/components/form/BootstrapFormList";
import Divider from "~/components/divider";
import {Plus} from "react-feather";


export const MENUS_MODULE = "MENUS_MODULE";

export const defaultData = {
    basic: {
        columns: 4,
        menus: [
            { image: '', url: '', text: '菜单1' },
            { image: '', url: '', text: '菜单2' },
            { image: '', url: '', text: '菜单3' },
            { image: '', url: '', text: '菜单4' },
        ],
    },
    style: {
        ...DEFAULT_BOX_STYLES,
    },
    imageStyle: {
        width: '48px',
        height: '48px',
        marginBottom: '0px',
    }
};

const MenusModuleAttribute = (props: any) => {
    const { onUpdate, data, links } = props;
    let _data = { ...defaultData, ...data };
    const [menus, setMenus] = useState(_data.basic.menus);


    const handleOnSubmit1 = (values:any) => {
        _data.basic = values;
        onUpdate({..._data});
    }
    const handleOnSubmit2 = (values:any) => {
        _data.style = values;
        onUpdate({..._data});
    }
    const handleOnSubmit3 = (values:any) => {
        _data.imageStyle = values;
        onUpdate({..._data});
    }

    const handleOnAdd = () => {
        let newMenus = [...menus, {image:'', url: '', text: '菜单'+(menus.length+1)}];
        setMenus(newMenus);
        _data.basic.menus = newMenus;
        onUpdate({...data});
    }

    return (
        <AttributeTabs tabs={['控件设置', '样式设置']}>
            <div style={{ padding: 15 }}>
                <Formik initialValues={_data.basic} onSubmit={handleOnSubmit1}>
                    {
                        (formik) => {
                            return (
                                <Form method={'post'} onChange={(e)=>formik.submitForm()}>
                                    <BootstrapSelect
                                        name={'columns'}
                                        label={'列数'}
                                        options={[{ label: '3列', value: '3' }, { label: '4列', value: '4' }, { label: '5列', value: '5' }]}
                                        onSelectChanged={()=>formik.submitForm()}
                                    />
                                    <BootstrapFormList name={'menus'} list={menus}>
                                        {(item:any, index:number)=>{
                                            return (<div key={'menu'+index}>
                                                <FormGroup>
                                                    <FormLabel>菜单{index+1}名称</FormLabel>
                                                    <FormControl value={item.text} onChange={(e)=>{
                                                        item.text = e.currentTarget.value;
                                                        _data.basic.menus = menus;
                                                        onUpdate({...data});
                                                    }} />
                                                </FormGroup>
                                                <FormGroup>
                                                    <FormLabel>菜单{index+1}图标</FormLabel>
                                                    <FileBrowserInput type={1} multi={false} initValue={item.image} onChange={(val:any)=>{
                                                        item.image = val;
                                                        _data.basic.menus = menus;
                                                        onUpdate({...data});
                                                    }} />
                                                </FormGroup>
                                                <FormGroup>
                                                    <FormLabel>菜单{index+1}地址</FormLabel>
                                                    <BootstrapLinkSelector links={links} initValue={item.url} onChange={(val:any)=>{
                                                        item.url = val;
                                                        _data.basic.menus = menus;
                                                        onUpdate({...data});
                                                    }} />
                                                </FormGroup>
                                                <Divider />
                                            </div>);
                                        }}
                                    </BootstrapFormList>
                                    <Button block onClick={handleOnAdd}><Plus size={14} />增加一个菜单</Button>
                                </Form>
                            );
                        }
                    }
                </Formik>
            </div>
            <div style={{ padding: 15 }}>
                <Collapse accordion={true} openMotion={collapseMotion}>
                    <Collapse.Panel key={'style'} header={'边框样式'}>
                        <Formik initialValues={_data.style} onSubmit={handleOnSubmit2}>
                            {
                                (formik) => {
                                    return (
                                        <Form method={'post'} onChange={(e)=>formik.submitForm()}>
                                            <BoxSettings />
                                        </Form>
                                    );
                                }
                            }
                        </Formik>
                    </Collapse.Panel>
                    <Collapse.Panel key={'imageStyle'} header={'图标样式'}>
                        <Formik initialValues={_data.imageStyle} onSubmit={handleOnSubmit3}>
                            {
                                (formik) => {
                                    return (
                                        <Form method={'post'} onChange={(e)=>formik.submitForm()}>
                                            <BootstrapInput label={'宽度'} name={'width'} />
                                            <BootstrapInput label={'高度'} name={'height'} />
                                            <BootstrapInput label={'下间距'} name={'marginBottom'} />
                                        </Form>
                                    );
                                }
                            }
                        </Formik>
                    </Collapse.Panel>
                </Collapse>
            </div>
        </AttributeTabs>
    );
}

const MenusModule = (props: any) => {
    const { index, data,isPreview, ...rest } = props;
    let _data = { ...defaultData, ...data };

    return (
        <div {...rest} style={_data.style}>
            {_data.basic.showTitle && <div style={{paddingLeft: 15, borderBottom: '1px solid #f5f5f5', marginBottom: 10}}>
                <h3>{_data.basic.title}</h3>
            </div>}
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap' }}>
                {_data.basic.menus.map((item: any, i:number) => {
                    return (
                        <div key={'menus'+index+''+i} style={{ width: 100 / parseInt(_data.basic.columns) + '%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <FallbackImage style={{..._data.imageStyle}} src={resolveUrl(item.image)} />
                            <div>{item.text}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}



export default function () {
    registerModule(MENUS_MODULE, "导航菜单", image, '公共模块', MenusModule, MenusModuleAttribute, defaultData);
}