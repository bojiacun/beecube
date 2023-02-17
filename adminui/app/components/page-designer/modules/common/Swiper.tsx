import { AttributeTabs, registerModule } from "../../component"
import image from 'assets/designer/swiper.png';
import React, { useEffect, useRef } from "react";
import { resolveUrl } from "~/utils/utils";
import BoxSettings, { DEFAULT_BOX_STYLES } from "../BoxSettings";
import Swiper, { SwipeRef } from 'react-tiga-swiper';
import FallbackImage from "~/components/fallback-image";
import {Form, Formik} from "formik";
import BootstrapSwitch from "~/components/form/BootstrapSwitch";
import {FormGroup, FormLabel} from "react-bootstrap";
import FileBrowserInput from "~/components/filebrowser/form";
import BootstrapLinkSelector from "~/components/form/BootstrapLinkSelector";
import BootstrapInput from "~/components/form/BootstrapInput";
import BootstrapRadioGroup from "~/components/form/BootstrapRadioGroup";


export const SWIPER_MODULE = "SWIPER_MODULE";
export const defaultData = {
    basic: {
        height: '350px',
        images: [
            { image: '', url: '', text: '轮播图1' },
            { image: '', url: '', text: '轮播图2' },
        ],
        mode: 'aspectFit',
    },
    style: {
        ...DEFAULT_BOX_STYLES,
    }
};

const SwiperModuleAttribute = (props: any) => {
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
                                    <BootstrapInput label={'高度'} name={'height'} />
                                    <BootstrapRadioGroup options={[
                                        {label: 'aspectFit', value: 'aspectFit'},
                                        {label: 'aspectFill', value: 'aspectFill'},
                                        {label: 'scaleToFill', value: 'scaleToFill'},
                                        {label: 'widthFix', value: 'widthFix'},
                                        {label: 'heightFix', value: 'heightFix'},
                                    ]} name={'mode'} label={'布局方式'} />
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

const SwiperModule = (props: any) => {
    const { index, data, isPreview, ...rest } = props;
    let _data = { ...defaultData, ...data };
    const swiperRef = useRef<SwipeRef>(null);

    return (
        <div {...rest} style={_data.style}>
            <Swiper ref={swiperRef}>
                {_data.basic.images.map((item: any) => {
                    return <FallbackImage key={item.image+isPreview} src={resolveUrl(item.image)} style={{ width: '100%', objectFit: 'cover' }} width={'100%'} />;
                })}
            </Swiper>
        </div>
    );
}



export default function () {
    registerModule(SWIPER_MODULE, "轮播图", image, '公共模块', SwiperModule, SwiperModuleAttribute, defaultData);
}