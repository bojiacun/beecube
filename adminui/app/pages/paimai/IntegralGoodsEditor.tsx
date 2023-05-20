import {Button, Col, FormGroup, FormLabel, Modal, Row} from "react-bootstrap";
import {Form, Formik} from "formik";
import {FetcherState, getFetcherState, handleSaveResult} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import * as Yup from "yup";
import {useEffect, useRef, useState} from "react";
//@ts-ignore
import _ from 'lodash';
import FileBrowserInput from "~/components/filebrowser/form";
import BootstrapInput from "~/components/form/BootstrapInput";
import BootstrapSelect from "~/components/form/BootstrapSelect";
import BootstrapRadioGroup from "~/components/form/BootstrapRadioGroup";
import TinymceEditor from "~/components/tinymce-editor";


const CLASS_LIST = '/paimai/integral/classes/all';
const ADD_URL = '/paimai/integral/goods/add';
const EDIT_URL = '/paimai/integral/goods/edit';

const GoodsSchema = Yup.object().shape({
    title: Yup.string().required('必填字段'),
    integral: Yup.number().required('必填字段'),
    images: Yup.string().required('必填字段'),
    classId: Yup.number().required('必填字段'),
});

const IntegralGoodsEditor = (props: any) => {
    const {model, onHide} = props;
    const [goodsClassOptions, setGoodsClassOptions] = useState<any[]>([]);
    const goodsClassFetcher = useFetcher();
    const postFetcher = useFetcher();
    const formikRef = useRef<any>();

    const handleOnSubmit = (values: any) => {
        values.type = 1;
        if (values.id) {
            postFetcher.submit(values, {method: 'post', action: EDIT_URL});
        } else {
            postFetcher.submit(values, {method: 'post', action: ADD_URL});
        }
    }
    useEffect(() => {
        if (model) {
            goodsClassFetcher.load(CLASS_LIST);
        }
    }, [model]);

    //拍品分类
    useEffect(() => {
        if (getFetcherState(goodsClassFetcher) === FetcherState.DONE) {
            setGoodsClassOptions(goodsClassFetcher.data.map((item: any) => ({label: item.name, value: item.id})));
        }
    }, [goodsClassFetcher.state]);


    useEffect(() => {
        if (getFetcherState(postFetcher) === FetcherState.DONE) {
            formikRef.current!.setSubmitting(false);
            handleSaveResult(postFetcher.data);
            if (postFetcher.data.success) {
                onHide(postFetcher.data.result);
            }
        }
    }, [postFetcher.state]);


    if (!model) return <></>

    const newModel = {status: 1,  images: '', ...model};

    return (
        <>
            <Modal
                show={!!model}
                onHide={onHide}
                size={'lg'}
                backdrop={'static'}
                aria-labelledby={'edit-modal'}
            >
                <Modal.Header closeButton>
                    <Modal.Title id={'edit-user-model'}>{model?.id ? '编辑' : '新建'}积分商品</Modal.Title>
                </Modal.Header>
                <Formik innerRef={formikRef} initialValues={newModel} validationSchema={GoodsSchema}
                        onSubmit={handleOnSubmit}>
                    {(formik)=>{
                        return (
                            <Form method={'post'}>
                                <Modal.Body style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                                    <BootstrapSelect name={'classId'} label={'分类'} options={goodsClassOptions}/>
                                    <BootstrapInput label={'标题'} name={'title'}/>
                                    <BootstrapInput label={'副标题'} name={'subTitle'}/>
                                    <BootstrapInput label={'规格'} name={'spec'}/>
                                    <FormGroup className={'mb-1'}>
                                        <FormLabel htmlFor={'homeCover'}>首页封面</FormLabel>
                                        <FileBrowserInput name={'homeCover'} type={1} multi={true}/>
                                    </FormGroup>
                                    <FormGroup className={'mb-1'}>
                                        <FormLabel htmlFor={'listCover'}>列表封面</FormLabel>
                                        <FileBrowserInput name={'listCover'} type={1} multi={true}/>
                                    </FormGroup>
                                    <FormGroup className={'mb-1'}>
                                        <FormLabel htmlFor={'images'}>轮播图</FormLabel>
                                        <FileBrowserInput name={'images'} type={1} multi={true}/>
                                    </FormGroup>

                                    <BootstrapInput label={'积分'} name={'integral'} placeholder={'保证金（元）'}/>
                                    <BootstrapInput label={'标签'} name={'tags'} placeholder={'自定义标签，用户搜索，用英文逗号分割每个标签，例如公益拍,保证金1:5'}/>
                                    <FormGroup>
                                        <FormLabel htmlFor={'description'}>商品简介</FormLabel>
                                        <TinymceEditor name={'description'}/>
                                    </FormGroup>
                                    <FormGroup>
                                        <FormLabel htmlFor={'detail'}>商品详情</FormLabel>
                                        <TinymceEditor name={'detail'}/>
                                    </FormGroup>
                                    <BootstrapRadioGroup options={[{label: '下架', value: '0'}, {label: '上架', value: '1'}]} name={'status'} label={'状态'}/>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button
                                        variant={'primary'}
                                        disabled={postFetcher.state === 'submitting'}
                                        type={'submit'}
                                    >
                                        保存
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        );
                    }}

                </Formik>
            </Modal>
        </>
    );
}

export default IntegralGoodsEditor;