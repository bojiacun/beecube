import React, {useEffect} from "react";
import xcx from "assets/designer/xcx.png";
import {AttributeTabs, presetColors, registerControl} from "../component";
import {ArrowLeft} from "react-feather";
import {Formik, Form} from "formik";
import BootstrapSwitch from "~/components/form/BootstrapSwitch";
import BootstrapInput from "~/components/form/BootstrapInput";
import BootstrapRadioGroup from "~/components/form/BootstrapRadioGroup";
import {FormGroup, FormLabel} from "react-bootstrap";
import FileBrowserInput from "~/components/filebrowser/form";
import FigureImage from "react-bootstrap/FigureImage";
import {resolveUrl} from "~/utils/utils";

export const MINI_APP_HEADER = "MINI_APP_HEADER";

export const defaultAppHeaderData = {
    basic: {
        text: '页面标题',
        color: 'black',
        fontSize: '14px',
        fontWeight: 1,
        fontStyle: 'normal',
        hide: 0,
        fixed: 0,
        logo: null,
    },
    style: {
        background: '#ffffff',
    }
};

const AttributeView: React.FC<any> = (props) => {
    const {onUpdate, data} = props;

    let _data = {...defaultAppHeaderData, ...data};

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
                                    <BootstrapSwitch label={'隐藏控件'} name={'hide'} />
                                    <BootstrapSwitch label={'固定标头'} name={'fixed'} />
                                    <BootstrapInput label={'页面标题'} name={'text'} />
                                    <BootstrapSwitch label={'字体加粗'} name={'fontWeight'} />
                                    <BootstrapInput label={'字体颜色'} name={'color'} />
                                    <BootstrapInput label={'字体大小'} name={'fontSize'} />
                                    <FormGroup>
                                        <FormLabel htmlFor={'logo'}>LOGO</FormLabel>
                                        <FileBrowserInput name={'logo'} type={1} multi={false} onChange={()=>formik.submitForm()} />
                                    </FormGroup>
                                    <BootstrapRadioGroup options={[{ label: '正常', value: 'normal' }, { label: '斜体', value: 'italic' }]} name={'fontStyle'} label={'字体样式'} />
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
                                <Form method={'post'} onChange={(e)=>formik.submitForm()}>
                                    <BootstrapInput label={'背景颜色'} name={'background'} />
                                </Form>
                            );
                        }
                    }

                </Formik>
            </div>
        </AttributeTabs>
    );
}
const MiniAppHeader = (props: any) => {
    const {data, isPreview, ...rest} = props;
    if (data.basic.hide) {
        return <></>;
    }

    return (
        <div className={'title'} {...rest} style={{...data.style}}>
            <span className={'arrow'}>
                <ArrowLeft/>
            </span>
            {!data.basic.logo &&
                <p className={'tit'} style={{...data.basic, fontWeight: data.basic.fontWeight ? 'bold' : 'normal'}}>
                    <span>{data.basic.text}</span>
                </p>
            }
            {data.basic.logo &&
                <FigureImage src={resolveUrl(data.basic.logo)} style={{height: '100%', display: 'inline-block'}}  />
            }
            <img alt="" src={xcx}/>
        </div>
    );
};

export default function register() {
    registerControl(MINI_APP_HEADER, true, "顶部导航栏", MiniAppHeader, AttributeView, defaultAppHeaderData);
}

