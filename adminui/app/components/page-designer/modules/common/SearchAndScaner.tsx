import searchImage from 'assets/designer/s5_1.png';
import sousuo from 'assets/designer/sousuo.png';
import React, {useEffect} from "react";
import {AttributeTabs, registerModule} from "~/components/page-designer/component";
import {Form, Formik} from "formik";
import BoxSettings, {DEFAULT_BOX_STYLES} from "~/components/page-designer/modules/BoxSettings";
import BootstrapInput from "~/components/form/BootstrapInput";

export const SEARCH_AND_SCANNER_MODULE = "SEARCH_AND_SCANNER_MODULE";

export const defaultData = {
    basic: {
        placeholder: '搜索专场及拍品',
    },
    inputStyle: {
        borderRadius: 28,
        borderColor: "#fdc019",
        borderSize: 4,
        borderStyle: 'solid',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 15
    },
    buttonStyle: {
        backgroundColor: '#fdc019',
        borderRadius: 28,
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        height: 36,
        paddingLeft: 15,
        paddingRight: 15,
    },
    style: {
        ...DEFAULT_BOX_STYLES,
        background: 'transparent',
    }
};


const SearchAndScanerAttribute = (props: any) => {
    const {onUpdate, data} = props;

    let _data = {...defaultData, ...data};
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
            <div style={{padding: 15}}>
                <Formik initialValues={_data.basic} onSubmit={handleOnSubmit1}>
                    {
                        (formik) => {
                            return (
                                <Form method={'post'} onChange={(e)=>formik.submitForm()}>
                                    <BootstrapInput label={'提示文本'} name={'placeholder'} />
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

const SearchAndScanner = (props: any) => {
    const {index, data,isPreview, ...rest} = props;
    let _data = {...defaultData, ...data};
    return (
        <div style={{..._data.style, display: 'flex'}} {...rest}>
            <div style={_data.inputStyle}>
                <img src={sousuo} style={{width: 18}}/>
                <input placeholder={_data.basic.placeholder} style={{border: 'none', background: 'transparent'}} />
            </div>
        </div>
    );
}


export default function () {
    registerModule(SEARCH_AND_SCANNER_MODULE, "搜索条", searchImage, "公共模块", SearchAndScanner, SearchAndScanerAttribute, defaultData);
}