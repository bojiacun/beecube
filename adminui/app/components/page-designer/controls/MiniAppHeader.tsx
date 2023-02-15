import React, {useEffect} from "react";
import xcx from "assets/designer/xcx.png";
import {AttributeTabs, presetColors, registerControl} from "../component";
import {ArrowLeft} from "react-feather";
import {Formik, Form} from "formik";
import BootstrapSwitch from "~/components/form/BootstrapSwitch";
import BootstrapInput from "~/components/form/BootstrapInput";

export const MINI_APP_HEADER = "MINI_APP_HEADER";

export const defaultAppHeaderData = {
    basic: {
        text: '页面标题',
        color: 'black',
        fontSize: 14,
        fontWeight: false,
        fontStyle: 'normal',
        hide: false,
    },
    style: {
        background: '#ffffff',
    }
};

const AttributeView: React.FC<any> = (props) => {
    const {onUpdate, data} = props;

    let _data = {...defaultAppHeaderData, ...data};

    useEffect(() => {
        onUpdate({..._data});
    }, []);

    const handleOnSubmit1 = () => {

    }

    return (
        <AttributeTabs tabs={['控件设置', '样式设置']}>
            <div style={{padding: 15}}>
                <Formik initialValues={_data.basic} onSubmit={handleOnSubmit1}>
                    <Form method={'post'}>
                        <BootstrapSwitch label={'隐藏控件'} name={'hide'} />
                        <BootstrapInput label={'页面标题'} name={'text'} />
                    </Form>
                </Formik>
            </div>
            <div style={{padding: 15}}>

            </div>
        </AttributeTabs>
    );
}
const MiniAppHeader = (props: any) => {
    const {data, isPreview, ...rest} = props;
    let _data = {...defaultAppHeaderData, ...data};

    if (_data.basic.hide) {
        return <></>;
    }

    return (
        <div className={'title'} {...rest} style={_data.style}>
            <span className={'arrow'}>
                <ArrowLeft/>
            </span>
            <p className={'tit'} style={_data.basic}><span>{_data.basic.text}</span></p>
            <img alt="" src={xcx}/>
        </div>
    );
};

export default function register() {
    registerControl(MINI_APP_HEADER, true, "顶部导航栏", MiniAppHeader, AttributeView, defaultAppHeaderData);
}
