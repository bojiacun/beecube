import BoxSettings, {DEFAULT_BOX_STYLES} from "~/components/page-designer/modules/BoxSettings";
import {AttributeTabs, registerModule} from "~/components/page-designer/component";
import {Form, Formik} from "formik";
import BootstrapInput from "~/components/form/BootstrapInput";
import React from "react";
import {FormGroup, FormLabel, Button} from "react-bootstrap";
import BootstrapLinkSelector from "~/components/form/BootstrapLinkSelector";
import image from "../../../../../assets/designer/s3_2.png";

export const VIEWMORE_MODULE = "VIEWMORE_MODULE";

export const defaultData = {
    basic: {
        text: '更多拍卖专场',
        links: '',
    },
    style: {
        ...DEFAULT_BOX_STYLES,
        background: 'transparent',
    }
};

const ViewMoreModuleAttribute = (props: any) => {
    const {onUpdate, data, links} = props;
    let _data = {...defaultData, ...data};

    const handleOnSubmit1 = (values: any) => {
        _data.basic = values;
        onUpdate({..._data});
    }
    const handleOnSubmit2 = (values: any) => {
        _data.style = values;
        onUpdate({..._data});
    }

    return (
        <AttributeTabs tabs={['控件设置', '样式设置']}>
            <div style={{padding: 15}}>
                <Formik initialValues={_data.basic} onSubmit={handleOnSubmit1}>
                    {
                        (formik) => {
                            return (
                                <Form method={'post'} onChange={(e) => formik.submitForm()}>
                                    <BootstrapInput label={'按钮文本'} name={'text'}/>
                                    <FormGroup>
                                        <FormLabel>链接地址</FormLabel>
                                        <BootstrapLinkSelector name={'links'} links={links} initValue={_data.basic.link}
                                                               onChange={() => formik.submitForm()}/>
                                    </FormGroup>
                                </Form>
                            );
                        }
                    }
                </Formik>
            </div>
            <div style={{padding: 15}}>
                <Formik initialValues={_data.style} onSubmit={handleOnSubmit2}>
                    {
                        (formik) => {
                            return (
                                <Form method={'post'} onChange={(e) => formik.submitForm()}>
                                    <BoxSettings/>
                                </Form>
                            );
                        }
                    }
                </Formik>
            </div>
        </AttributeTabs>
    );
}

const ViewMoreModule = (props: any) => {
    const {index, data, ...rest} = props;
    let _data = {...defaultData, ...data};

    return (
        <div {...rest} style={_data.style}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button variant={'outline-dark'}>{_data.basic.text}</Button>
            </div>
        </div>
    );
}

export default function (module = '') {
    if (module === 'paimai') {
        registerModule(VIEWMORE_MODULE, "查看更多", image, '拍卖模块', ViewMoreModule, ViewMoreModuleAttribute, defaultData);
    }
}