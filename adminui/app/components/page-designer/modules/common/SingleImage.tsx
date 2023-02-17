import { AttributeTabs, registerModule } from "../../component"
import image from 'assets/designer/s3_2.png';
import biaoqian from 'assets/designer/biaoqian.png';
import React, { useEffect } from "react";
import { resolveUrl } from "~/utils/utils";
import BoxSettings, { DEFAULT_BOX_STYLES } from "../BoxSettings";
import FallbackImage from "~/components/fallback-image";
import {Form, Formik} from "formik";
import BootstrapInput from "~/components/form/BootstrapInput";
import {FormGroup, FormLabel} from "react-bootstrap";
import FileBrowserInput from "~/components/filebrowser/form";
import BootstrapLinkSelector from "~/components/form/BootstrapLinkSelector";
import BootstrapSwitch from "~/components/form/BootstrapSwitch";


export const SINGLE_IMAGE_MODULE = "SINGLE_IMAGE_MODULE";
export const defaultData = {
    basic: {
        showTitle: 0,
        titleImage: '',
        image: '',
        url: '',
    },
    style: {
        ...DEFAULT_BOX_STYLES,
    }
};

const SingleImageModuleAttribute = (props: any) => {
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
                                    <BootstrapSwitch  label={'显示标题'} name={'showTitle'} />
                                    <FormGroup>
                                        <FormLabel htmlFor={'titleImage'}>标题图片</FormLabel>
                                        <FileBrowserInput name={'titleImage'} type={1} multi={false} onRemove={()=>formik.submitForm()} />
                                    </FormGroup>
                                    <FormGroup>
                                        <FormLabel htmlFor={'image'}>广告图</FormLabel>
                                        <FileBrowserInput name={'image'} type={1} multi={false} onRemove={()=>formik.submitForm()} />
                                    </FormGroup>
                                    <FormGroup>
                                        <FormLabel htmlFor={'url'}>链接地址</FormLabel>
                                        <BootstrapLinkSelector name={'url'} links={links} onSelect={()=>formik.submitForm()} />
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

const SingleImageModule = (props: any) => {
    const { index, data, isPreview, ...rest } = props;
    let _data = { ...defaultData, ...data };

    return (
        <div {...rest} style={_data.style}>
            {_data.basic.showTitle === 1&&
                <img src={_data.basic.titleImage} alt={''} style={{ display: 'block', width: '100%'}} />
            }

            <FallbackImage src={resolveUrl(_data.basic.image)} style={{ width: '100%', objectFit: 'cover' }} width={'100%'}  />
        </div>
    );
}



export default function (){
    registerModule(SINGLE_IMAGE_MODULE, "单图", image, '公共模块', SingleImageModule, SingleImageModuleAttribute, defaultData);
}