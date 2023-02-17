import { AttributeTabs, registerModule } from "../../component"
import image from 'assets/designer/s2_3.png';
import React, { useEffect } from "react";
import { resolveUrl } from "~/utils/utils";
import BoxSettings, { DEFAULT_BOX_STYLES } from "../BoxSettings";
import FallbackImage from "~/components/fallback-image";
import {Form, Formik} from "formik";
import BootstrapSwitch from "~/components/form/BootstrapSwitch";
import {FormGroup, FormLabel} from "react-bootstrap";
import FileBrowserInput from "~/components/filebrowser/form";
import BootstrapLinkSelector from "~/components/form/BootstrapLinkSelector";
import BootstrapRadioGroup from "~/components/form/BootstrapRadioGroup";
import BootstrapInput from "~/components/form/BootstrapInput";
import Divider from "~/components/divider";


export const MULTIPLE_IMAGES_MODULE = "MULTIPLE_IMAGES_MODULE";
export const defaultData = {
    basic: {
        style: '1',
        space: '10px',
        image1: '',
        url1: '',
        image2: '',
        url2: '',
        image3: '',
        url3: '',
    },
    style: {
        ...DEFAULT_BOX_STYLES,
    }
};

const MultipleImagesModuleAttribute = (props: any) => {
    const { onUpdate, data, links } = props;
    let _data = { ...defaultData, ...data };
    const handleOnSubmit1 = (values:any) => {
        _data.basic = values;
        onUpdate({..._data});
    }
    const handleOnSubmit2 = (values:any) => {
        _data.style = values;
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
                                    <BootstrapRadioGroup options={[{ label: '样式一', value: '1' }, { label: '样式二', value: '2' }]} name={'style'} label={'布局方式'} />
                                    <BootstrapInput label={'间距'} name={'space'} />
                                    <Divider />
                                    <FormGroup>
                                        <FormLabel htmlFor={'image1'}>图片1</FormLabel>
                                        <FileBrowserInput name={'image1'} type={1} multi={false} onRemove={()=>formik.submitForm()} />
                                    </FormGroup>
                                    <FormGroup>
                                        <FormLabel htmlFor={'url1'}>图片1地址</FormLabel>
                                        <BootstrapLinkSelector name={'url1'} links={links} onSelect={()=>formik.submitForm()} />
                                    </FormGroup>
                                    <Divider />
                                    <FormGroup>
                                        <FormLabel htmlFor={'image2'}>图片2</FormLabel>
                                        <FileBrowserInput name={'image2'} type={1} multi={false} onRemove={()=>formik.submitForm()} />
                                    </FormGroup>
                                    <FormGroup>
                                        <FormLabel htmlFor={'url2'}>图片2地址</FormLabel>
                                        <BootstrapLinkSelector name={'url2'} links={links} onSelect={()=>formik.submitForm()} />
                                    </FormGroup>
                                    <Divider />
                                    <FormGroup>
                                        <FormLabel htmlFor={'image3'}>图片3</FormLabel>
                                        <FileBrowserInput name={'image3'} type={1} multi={false} onRemove={()=>formik.submitForm()} />
                                    </FormGroup>
                                    <FormGroup>
                                        <FormLabel htmlFor={'url3'}>图片3地址</FormLabel>
                                        <BootstrapLinkSelector name={'url3'} links={links} onSelect={()=>formik.submitForm()} />
                                    </FormGroup>
                                </Form>
                            );
                        }
                    }

                </Formik>
            </div>
            <div style={{ padding: 15 }}>
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
            </div>
        </AttributeTabs>
    );
}

const MultipleImagesModule = (props: any) => {
    const { index, data,isPreview, ...rest } = props;
    let _data = { ...defaultData, ...data };

    return (
        <div {...rest} style={_data.style}>
            <div {...rest} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{ flex: 1, marginRight: _data.basic.space}}>
                    <FallbackImage src={resolveUrl(_data.basic.image1)} style={{width: '100%'}} width='100%' />
                </div>
                <div style={{ flex: 1}}>
                    <FallbackImage src={resolveUrl(_data.basic.image2)} style={{width: '100%'}} width='100%' />
                </div>
            </div>
            {_data.basic.style == 2 && <>
                <div style={{ width: '100%', marginTop: _data.basic.space}}>
                    <FallbackImage src={resolveUrl(_data.basic.image3)} style={{width: '100%'}} width='100%' />
                </div>
            </>}
        </div>
    );
}



export default function () {
    registerModule(MULTIPLE_IMAGES_MODULE, "多图", image, '公共模块', MultipleImagesModule, MultipleImagesModuleAttribute, defaultData);
}