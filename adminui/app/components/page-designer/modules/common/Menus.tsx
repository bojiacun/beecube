import { AttributeTabs, registerModule } from "../../component"
import image from 'assets/designer/s1_1.png';
import React, { useEffect } from "react";
import BoxSettings, { DEFAULT_BOX_STYLES } from "../BoxSettings";
import FallbackImage from "~/components/fallback-image";
import { resolveUrl } from "~/utils/utils";
import Collapse from "rc-collapse";
import collapseMotion from "~/components/page-designer/motion";
import {Form, Formik} from "formik";
import BootstrapInput from "~/components/form/BootstrapInput";
import BootstrapSwitch from "~/components/form/BootstrapSwitch";
import {FormGroup, FormLabel} from "react-bootstrap";
import FileBrowserInput from "~/components/filebrowser/form";
import BootstrapLinkSelector from "~/components/form/BootstrapLinkSelector";
import BootstrapSelect from "~/components/form/BootstrapSelect";
import BootstrapFormList from "~/components/form/BootstrapFormList";


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
    const handleOnSubmit1 = (values:any) => {
        _data.basic = values;
        console.log(values);
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
                                    <BootstrapFormList list={_data.basic.menus}>
                                        {(item:any)=>{
                                            return ('项目'+item.text);
                                        }}
                                    </BootstrapFormList>
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