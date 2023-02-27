import { AttributeTabs, registerModule } from "../../component"
import image from 'assets/designer/swiper.png';
import React, {useEffect, useRef, useState} from "react";
import { resolveUrl } from "~/utils/utils";
import BoxSettings, { DEFAULT_BOX_STYLES } from "../BoxSettings";
import Swiper, { SwipeRef } from 'react-tiga-swiper';
import FallbackImage from "~/components/fallback-image";
import {Form, Formik} from "formik";
import BootstrapSwitch from "~/components/form/BootstrapSwitch";
import {Button, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import FileBrowserInput from "~/components/filebrowser/form";
import BootstrapLinkSelector from "~/components/form/BootstrapLinkSelector";
import BootstrapInput from "~/components/form/BootstrapInput";
import BootstrapRadioGroup from "~/components/form/BootstrapRadioGroup";
import BootstrapFormList from "~/components/form/BootstrapFormList";
import Divider from "~/components/divider";
import {Plus, XCircle} from "react-feather";
import _ from "lodash";


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
    const [images, setImages] = useState(_data.basic.images);

    const handleOnSubmit1 = (values:any) => {
        _data.basic = values;
        onUpdate({..._data});
    }
    const handleOnSubmit2 = (values:any) => {
        _data.style = values;
        onUpdate({..._data});
    }
    const handleOnAdd = () => {
        let newImages = [...images, {image:'', url: '', text: '轮播图'+(images.length+1)}];
        setImages(newImages);
        _data.basic.images = newImages;
        onUpdate({...data});
    }
    const deleteMenu = (index:number) => {
        _.remove(images, n => n === index);
        let newMenus = [...images];
        setImages(newMenus);
        _data.basic.images = newMenus;
        onUpdate({...data});
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

                                    <BootstrapFormList name={'images'} list={images}>
                                        {(item:any, index:number)=>{
                                            return (<div key={'menu'+index}>
                                                <FormGroup>
                                                    <FormLabel style={{position: 'relative', width: '100%'}}>轮播图{index+1}名称 <XCircle onClick={()=>deleteMenu(index)} style={{right: 0, position: 'absolute'}} size={16} /></FormLabel>
                                                    <FormControl value={item.text} onChange={(e)=>{
                                                        item.text = e.currentTarget.value;
                                                        _data.basic.images = images;
                                                        onUpdate({...data});
                                                    }} />
                                                </FormGroup>
                                                <FormGroup>
                                                    <FormLabel>轮播图{index+1}图标</FormLabel>
                                                    <FileBrowserInput type={1} multi={false} initValue={item.image} onChange={(val:any)=>{
                                                        item.image = val;
                                                        _data.basic.images = images;
                                                        onUpdate({...data});
                                                    }} />
                                                </FormGroup>
                                                <FormGroup>
                                                    <FormLabel>轮播图{index+1}地址</FormLabel>
                                                    <BootstrapLinkSelector links={links} initValue={item.url} onChange={(val:any)=>{
                                                        item.url = val;
                                                        _data.basic.images = images;
                                                        onUpdate({...data});
                                                    }} />
                                                </FormGroup>
                                                <Divider />
                                            </div>);
                                        }}
                                    </BootstrapFormList>
                                    <Button block onClick={handleOnAdd}><Plus size={14} />增加一个轮播图</Button>
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