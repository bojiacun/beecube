import { AttributeTabs, registerModule } from "../../component"
import image from 'assets/designer/s3_2.png';
import React, { useEffect } from "react";
import BoxSettings, { DEFAULT_BOX_STYLES } from "../BoxSettings";
import FallbackImage from "~/components/fallback-image";
import {resolveUrl} from "~/utils/utils";
import {Form, Formik} from "formik";
import BootstrapInput from "~/components/form/BootstrapInput";
import {FormGroup, FormLabel} from "react-bootstrap";
import FileBrowserInput from "~/components/filebrowser/form";
import BootstrapLinkSelector from "~/components/form/BootstrapLinkSelector";


export const IMAGE_TEXT_MODULE = "IMAGE_TEXT_MODULE";
export const defaultData = {
    basic: {
        image: '',
        description: '描述文字描述文字描述文字描述文字描述文字描述文字描述文字描述文字描述文字描述文字描述文字',
        url: '',
    },
    style: {
        ...DEFAULT_BOX_STYLES,
    }
};

const ImageTextModuleAttribute = (props: any) => {
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
                                        <FileBrowserInput name={'image'} type={1} multi={false} onRemove={()=>formik.submitForm()} />
                                    </FormGroup>
                                    <BootstrapInput label={'标题'} name={'description'} />
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

const ImageTextModule = (props: any) => {
    const { index, data,isPreview, ...rest } = props;
    let _data = { ...defaultData, ...data };

    return (
        <div {...rest} style={_data.style}>
            <FallbackImage src={resolveUrl(_data.basic.image)} style={{ width: '100%', objectFit: 'cover' }} width={'100%'} height={150} />
            <div style={{ marginTop: 8, lineHeight: 1.5 }}>{_data.basic.description}</div>
        </div>
    );
}



export default function () {
    registerModule(IMAGE_TEXT_MODULE, "图文信息", image, '公共模块', ImageTextModule, ImageTextModuleAttribute, defaultData);
}