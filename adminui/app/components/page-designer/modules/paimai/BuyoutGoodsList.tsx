import {AttributeTabs, registerModule} from "../../component"
import image from 'assets/designer/s4_2.png';
import biaoqian from 'assets/designer/biaoqian.png';
import React, {useEffect, useState} from "react";
import BoxSettings, {DEFAULT_BOX_STYLES} from "../BoxSettings";
import {getPagedGoods, getShopClasses} from "./service";
import {resolveUrl} from "~/utils/utils";
import {Form, Formik} from "formik";
import BootstrapInput from "~/components/form/BootstrapInput";
import BootstrapSwitch from "~/components/form/BootstrapSwitch";


export const BUYOUT_GOODS_LIST_MODULE = "BUYOUT_GOODS_LIST_MODULE";

export const defaultData = {
    basic: {
        itemBorderRadius: 15,
        count: 4,
        showClass: 0
    },
    style: {
        ...DEFAULT_BOX_STYLES,
        background: 'transparent',
    }
};

const BuyoutGoodsListModuleAttribute = (props: any) => {
    const {onUpdate, data} = props;
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
                                    <BootstrapSwitch label={'显示分类'} name={'showClass'} />
                                    <BootstrapInput label={'数据条数'} name={'count'}/>
                                    <BootstrapInput label={'边框圆角'} name={'itemBorderRadius'}/>
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

const BuyoutGoodsListModule = (props: any) => {
    const {index, data, isPreview, ...rest} = props;
    const [goodsList, setGoodsList] = useState<any[]>([]);
    let _data = {...defaultData, ...data};
    useEffect(() => {
        getPagedGoods(2, '', _data.basic.count).then(res => {
            setGoodsList(res.data.records);
        });
    }, [data.basic.count]);

    return (
        <div {...rest} style={_data.style}>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
                {goodsList.slice(0, _data.basic.count).map((item: any) => {
                    let itemWidth = 'calc((100% - ' + 10 + 'px) / 2)';
                    return (
                        <div key={item.id} style={{
                            width: itemWidth,
                            background: 'white',
                            padding: 10,
                            marginBottom: 10,
                            borderRadius: parseInt(_data.basic.itemBorderRadius),
                            position: 'relative'
                        }}>
                            <div style={{paddingTop: '100%', width: '100%', position: 'relative'}}>
                                <img src={resolveUrl(item.images.split(',')[0])} alt={item.name} style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    display: 'block',
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    zIndex: 99
                                }}/>
                            </div>
                            <h6 style={{whiteSpace: 'nowrap', overflow: 'hidden', marginBottom: 0, lineHeight: 2}}>{item.title}</h6>
                            <div style={{fontSize: 12, display: 'flex'}}></div>
                            <div style={{color: 'gray', fontSize: 12, marginTop: 3}}>{}</div>
                        </div>
                    );
                })}
            </div>


        </div>
    );
}


export default function (module = '') {
    if (module === 'paimai') {
        registerModule(BUYOUT_GOODS_LIST_MODULE, "一口价列表", image, '拍卖模块', BuyoutGoodsListModule, BuyoutGoodsListModuleAttribute, defaultData);
    }
}