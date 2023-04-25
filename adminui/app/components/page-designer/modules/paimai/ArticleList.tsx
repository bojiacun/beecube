import {AttributeTabs, registerModule} from "../../component"
import image from 'assets/designer/s4_2.png';
import React, {useEffect, useState} from "react";
import BoxSettings, {DEFAULT_BOX_STYLES} from "../BoxSettings";
import {getPagedArticle} from "./service";
import {resolveUrl} from "~/utils/utils";
import {Form, Formik} from "formik";
import BootstrapInput from "~/components/form/BootstrapInput";
import BootstrapRadioGroup from "~/components/form/BootstrapRadioGroup";


export const ARTICLE_LIST_MODULE = "ARTICLE_LIST_MODULE";

export const defaultData = {
    basic: {
        itemBorderRadius: 15,
        count: 2,
        type: '',
        classId: '',
        itemWidth: '90%',
        itemHeight: 200,
        direction: 'horizontal'
    },
    style: {
        ...DEFAULT_BOX_STYLES,
        background: 'transparent',
    }
};

const ArticleListModuleAttribute = (props: any) => {
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
                                    <BootstrapRadioGroup
                                        options={[{label: '不设置', value: ''},{label: '图文类文章', value: '1'}, {label: '视频类', value: '2'}, {label: '服务指南', value: '3'}]}
                                        name={'type'}
                                        label={'文章类型'}
                                    />
                                    <BootstrapInput label={'所属分类'} name={'classId'}/>
                                    <BootstrapInput label={'数据条数'} name={'count'}/>
                                    <BootstrapInput label={'边框圆角'} name={'itemBorderRadius'}/>
                                    <BootstrapRadioGroup
                                        options={[{label: '横向滚动', value: 'horizontal'},{label: '纵向滚动', value: 'vertical'}]}
                                        name={'direction'}
                                        label={'滚动方向'}
                                    />
                                    <BootstrapInput label={'单项高度'} name={'itemHeight'}/>
                                    <BootstrapInput label={'单项宽度'} name={'itemWidth'}/>
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

const ArticleListModule = (props: any) => {
    const {index, data, isPreview, ...rest} = props;
    const [goodsList, setArticleList] = useState<any[]>([]);
    let _data = {...defaultData, ...data};
    useEffect(() => {
        getPagedArticle(_data.basic.type, _data.basic.classId, _data.basic.count).then(res => {
            setArticleList(res.data.records);
        });
    }, [data.basic.dataSource,data.basic.count]);

    return (
        <div {...rest} style={_data.style}>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
                {goodsList.slice(0, _data.basic.count).map((item: any) => {
                    let itemWidth = '100%';
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
                                <img src={resolveUrl(item.preview)} alt={item.name} style={{
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
        registerModule(ARTICLE_LIST_MODULE, "文章列表", image, '拍卖模块', ArticleListModule, ArticleListModuleAttribute, defaultData);
    }
}