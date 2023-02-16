import { AttributeTabs, registerModule } from "../../component"
import image from 'assets/designer/divider.jpg';
import React, { useEffect } from "react";
import BoxSettings, { DEFAULT_BOX_STYLES } from "../BoxSettings";
import {Form, Formik} from "formik";
import BootstrapInput from "~/components/form/BootstrapInput";


export const DIVIDER_MODULE = "DIVIDER_MODULE";
export const defaultData = {
    basic: {
        height: '10px',
    },
    style: {
        ...DEFAULT_BOX_STYLES,
    }
};

const DividerModuleAttribute = (props: any) => {
    const { onUpdate, data } = props;

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
                                    <BootstrapInput label={'高度'} name={'height'} />
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

const DividerModule = (props: any) => {
    const { index, data,isPreview, isPreivew, ...rest } = props;
    let _data = { ...defaultData, ...data };

    return (
        <div {...rest} style={{..._data.style, height: _data.basic.height}}>
        </div>
    );
}



export default function () {
    registerModule(DIVIDER_MODULE, "分隔条", image, '公共模块', DividerModule, DividerModuleAttribute, defaultData);
}