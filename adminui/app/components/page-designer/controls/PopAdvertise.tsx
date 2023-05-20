import React, {useEffect, useState} from "react";
import { AttributeTabs, registerControl } from "../component";
import {Plus, XCircle} from "react-feather";
import nopic from 'assets/designer/img.jpg';
import {resolveUrl} from "~/utils/utils";
import {Form, Formik} from "formik";
import BootstrapInput from "~/components/form/BootstrapInput";
import {Button, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import FileBrowserInput from "~/components/filebrowser/form";
import BootstrapSwitch from "~/components/form/BootstrapSwitch";
import BootstrapFormList from "~/components/form/BootstrapFormList";
import BootstrapLinkSelector from "~/components/form/BootstrapLinkSelector";
import Divider from "~/components/divider";
import _ from "lodash";

export const POP_ADVERTISE = "POP_ADVERTISE";

export const defaultData = {
    basic: {
        images: [],
        repeat: true,
        repeatInterval: 24,
    },
    style: {
        opacity: 0.7,
    }
};

const PopAdvertiseAttributeView : React.FC<any> = (props) => {
    const { onUpdate, data, links } = props;
    let _data = { ...defaultData, ...data };
    const [images, setImages] = useState(_data.basic.images||[]);

    const handleOnSubmit1 = (values:any) => {
        _data.basic = values;
        onUpdate({..._data});
    }
    const handleOnSubmit2 = (values:any) => {
        _data.style = values;
        onUpdate({..._data});
    }
    const handleOnAdd = () => {
        let newImages = [...images, {image:'', url: '', sort: images.length+1}];
        setImages(newImages);
        _data.basic.images = newImages;
        onUpdate({...data});
    }
    const deleteImage = (index:number) => {
        let newImages = [...images];
        _.pullAt(newImages, index);
        setImages(newImages);
        _data.basic.images = newImages;
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
                                    <BootstrapSwitch label={'重复显示'} name={'repeat'} />
                                    <BootstrapInput label={'重复间隔'} name={'repeatInterval'} placeholder={'间隔多少个小时再次显示'} />
                                    <BootstrapFormList name={'images'} list={images}>
                                        {(item:any, index:number)=>{
                                            return (<div key={'menu'+index+item.url}>
                                                <FormGroup>
                                                    <FormLabel>广告图{index+1}图片地址  <XCircle onClick={()=>deleteImage(index)} style={{right: -1, position: 'absolute', cursor: 'pointer'}} size={16} /></FormLabel>
                                                    <FileBrowserInput type={1} multi={false} initValue={item.image} onChange={(val:any)=>{
                                                        item.image = val;
                                                        _data.basic.images = images;
                                                        onUpdate({...data});
                                                    }} />
                                                </FormGroup>
                                                <FormGroup>
                                                    <FormLabel>广告图{index+1}链接地址</FormLabel>
                                                    <BootstrapLinkSelector links={links} initValue={item.url} onChange={(val:any)=>{
                                                        item.url = val;
                                                        _data.basic.images = images;
                                                        onUpdate({...data});
                                                    }} />
                                                </FormGroup>
                                                <FormGroup>
                                                    <FormLabel style={{position: 'relative', width: '100%'}}>广告图{index+1}排序值</FormLabel>
                                                    <FormControl value={item.sort} onChange={(e)=>{
                                                        item.sort = e.currentTarget.value;
                                                        _data.basic.images = images;
                                                        onUpdate({...data});
                                                    }} />
                                                </FormGroup>
                                                <Divider />
                                            </div>);
                                        }}
                                    </BootstrapFormList>
                                    <Button onClick={handleOnAdd}><Plus size={14} />增加一个广告图</Button>
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

    let images = _data.basic.images || [];

    return (
        <div {...rest}  style={{width: '100%', height: '100%', top: 0, left: 0, position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: `rgba(0,0,0,${_data.style.opacity})`}}>
            <div style={{width: '50%', position: 'relative', opacity: 1}}>
                <img alt={'pop_advertise'} src={(images.length > 0 && images[0].image) ? resolveUrl(images[0].image) : nopic} style={{width: '100%', display: 'block'}} />
                <div style={{marginTop: 20, textAlign: 'center', color: 'white', fontSize: 24, cursor: 'pointer'}}><XCircle size={14} onPointerDown={closeAdv} /></div>
            </div>
        </div>
    );
};


export default function () {
    registerControl(POP_ADVERTISE, false, "弹窗广告", PopAdvertise, PopAdvertiseAttributeView, defaultData);
}

