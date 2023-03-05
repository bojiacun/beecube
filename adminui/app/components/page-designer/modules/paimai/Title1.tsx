import BoxSettings, {DEFAULT_BOX_STYLES} from "~/components/page-designer/modules/BoxSettings";
import {AttributeTabs, registerModule} from "~/components/page-designer/component";
import {Form, Formik} from "formik";
import BootstrapRadioGroup from "~/components/form/BootstrapRadioGroup";
import BootstrapInput from "~/components/form/BootstrapInput";
import React from "react";
import {FormGroup, FormLabel} from "react-bootstrap";
import BootstrapLinkSelector from "~/components/form/BootstrapLinkSelector";
import FallbackImage from "~/components/fallback-image";
import {resolveUrl} from "~/utils/utils";
import image from "../../../../../assets/designer/s3_2.png";
import {SINGLE_IMAGE_MODULE} from "~/components/page-designer/modules/common/SingleImage";

export const TITLE1_MODULE = "TITLE1_MODULE";

export const defaultData = {
    basic: {
        style: 1,
        text: '标题标题',
        moreText: '查看更多',
        links: '',
    },
    style: {
        ...DEFAULT_BOX_STYLES,
        background: 'transparent',
    }
};

const Title1ModuleAttribute = (props:any) => {
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
                                    <BootstrapRadioGroup
                                        options={[{label: '样式1', value: '1'}, {label: '样式2', value: '2'}]}
                                        name={'style'}
                                        label={'数据类型'}
                                    />
                                    <BootstrapInput label={'标题名称'} name={'text'}/>
                                    <BootstrapInput label={'更多名称'} name={'moreText'}/>
                                    <FormGroup>
                                        <FormLabel>链接地址</FormLabel>
                                        <BootstrapLinkSelector name={'links'} links={links} initValue={_data.basic.link} onChange={()=>formik.submitForm()} />
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

const Title1Module = (props: any) => {
    const { index, data, ...rest } = props;
    let _data = { ...defaultData, ...data };

    return (
        <div {...rest} style={_data.style}>
            {_data.basic.style == 1 &&
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderLeft: '5px solid red',
                    backgroundImage: 'linear-gradient(to right, #FDEAEB, #FFFFFF)'
                }}>
                    <span style={{color: 'red', fontWeight: 'bold', lineHeight: 1, marginLeft: 10, fontSize: 16}}>{_data.basic.text}</span>
                    <span style={{color: 'red'}}>{_data.basic.moreText}</span>
                </div>
            }
            {_data.basic.style == 2 &&
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontWeight: 'bold', lineHeight: 1, fontSize: 18}}>{_data.basic.text}</span>
                    <span style={{}}>{_data.basic.moreText}</span>
                </div>
            }
        </div>
    );
}

export default function (module = ''){
    if(module === 'paimai') {
        registerModule(TITLE1_MODULE, "标题1", image, '拍卖模块', Title1Module, Title1ModuleAttribute, defaultData);
    }
}