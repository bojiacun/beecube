import React, {useEffect, useState} from "react";
import { AttributeTabs, registerControl } from "../component";
import {XCircle} from "react-feather";
import nopic from 'assets/designer/img.jpg';
import {resolveUrl} from "~/utils/utils";
import {Form, Formik} from "formik";
import BootstrapInput from "~/components/form/BootstrapInput";
import {FormGroup, FormLabel} from "react-bootstrap";
import FileBrowserInput from "~/components/filebrowser/form";

export const POP_ADVERTISE = "POP_ADVERTISE";

export const defaultData = {
    basic: {
        image: nopic,
        link: '',
    },
    style: {
        opacity: 0.7,
    }
};

const PopAdvertiseAttributeView : React.FC<any> = (props) => {
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
                                    <FormGroup>
                                        <FormLabel htmlFor={'image'}>广告图</FormLabel>
                                        <FileBrowserInput name={'image'} type={1} multi={false} onChange={()=>formik.submitForm()} />
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
                                    <BootstrapInput label={'遮罩层透明度'} name={'opacity'} />
                                </Form>
                            );
                        }
                    }

                </Formik>
            </div>
        </AttributeTabs>
    );
}
const PopAdvertise = (props: any) => {
    const { data, isPreview, ...rest } = props;
    const [hide, setHide] = useState<boolean>(false);
    let _data = { ...defaultData, ...data };

    const closeAdv = () => {
        setHide(true);
    }

    if(hide) {
        return <></>;
    }

    return (
        <div {...rest}  style={{width: '100%', height: '100%', top: 0, left: 0, position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: `rgba(0,0,0,${_data.style.opacity})`}}>
            <div style={{width: '50%', position: 'relative', opacity: 1}}>
                <img alt={'pop_advertise'} src={resolveUrl(_data.basic.image)} style={{width: '100%', display: 'block'}} />
                <div style={{marginTop: 20, textAlign: 'center', color: 'white', fontSize: 24, cursor: 'pointer'}}><XCircle size={14} onPointerDown={closeAdv} /></div>
            </div>
        </div>
    );
};


export default function () {
    registerControl(POP_ADVERTISE, false, "弹窗广告", PopAdvertise, PopAdvertiseAttributeView, defaultData);
}

