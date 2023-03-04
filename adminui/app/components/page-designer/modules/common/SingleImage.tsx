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
                                    <FormGroup>
                                        <FormLabel htmlFor={'image'}>广告图</FormLabel>
                                        <FileBrowserInput name={'image'} type={1} multi={false} onChange={()=>formik.submitForm()} />
                                    </FormGroup>
                                    <FormGroup>
                                        <FormLabel htmlFor={'url'}>链接地址</FormLabel>
                                        <BootstrapLinkSelector name={'url'} links={links} onChange={()=>formik.submitForm()} />
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
            <FallbackImage src={resolveUrl(_data.basic.image)} style={{ width: '100%', objectFit: 'cover' }} width={'100%'}  />
        </div>
    );
}



export default function (){
    registerModule(SINGLE_IMAGE_MODULE, "单图", image, '公共模块', SingleImageModule, SingleImageModuleAttribute, defaultData);
}