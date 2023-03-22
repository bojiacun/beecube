import {Modal, FormGroup, FormLabel, Button, Col, Row} from "react-bootstrap";
import {Form, Formik} from "formik";
import {emptyDropdownIndicator, emptyIndicatorSeparator, handleSaveResult, showToastError} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import * as Yup from "yup";
import {useEffect, useRef, useState} from "react";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import PositionListSelector from "~/pages/system/roles/PositionListSelector";
//@ts-ignore
import _ from 'lodash';
import DepartmentTreeSelector from "~/pages/system/roles/DepartmentTreeSelector";
import FileBrowserInput from "~/components/filebrowser/form";
import DateTimePicker from "~/components/date-time-picker/DateTimePicker";
import BootstrapInput from "~/components/form/BootstrapInput";
import BootstrapSelect from "~/components/form/BootstrapSelect";
import {API_DUPLICATE_CEHCK} from "~/utils/request.server";
import {usePromise} from "react-use";
import BootstrapRadioGroup from "~/components/form/BootstrapRadioGroup";
import BootstrapDateTime from "~/components/form/BootstrapDateTime";
import TinymceEditor from "~/components/tinymce-editor";
import UprangConfiger from "~/pages/paimai/UprangConfiger";
import DescListConfiger from "~/pages/paimai/DescListConfiger";


const AuctionEditor = (props: any) => {
    const {model, onHide} = props;
    const postFetcher = useFetcher();
    const formikRef = useRef<any>();


    const GoodsSchema = Yup.object().shape({
        title: Yup.string().required('必填字段'),
        address: Yup.string().required('必填字段'),
        timeRange: Yup.string().required('必填字段'),
        preview: Yup.string().required('必填字段'),
        sortNum: Yup.number().integer().default(0),
    });

    const handleOnSubmit = (values: any) => {
        if (values.id) {
            postFetcher.submit(values, {method: 'post', action: '/paimai/auctions/edit'});
        } else {
            postFetcher.submit(values, {method: 'post', action: '/paimai/auctions/add'});
        }
    }

    useEffect(() => {
        if (postFetcher.type === 'done' && postFetcher.data) {
            formikRef.current!.setSubmitting(false);
            handleSaveResult(postFetcher.data);
            if (postFetcher.data.success) {
                onHide(postFetcher.data.result);
            }
        }
    }, [postFetcher.state]);
    if (!model) return <></>

    const newModel = {status: 0, type: 1, endTime: '', images: '', ...model};

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
                    <Modal.Title id={'edit-user-model'}>{model?.id ? '编辑' : '新建'}拍卖会</Modal.Title>
                </Modal.Header>
                <Formik innerRef={formikRef} initialValues={newModel} validationSchema={GoodsSchema}
                        onSubmit={handleOnSubmit}>
                    {(formik)=>{
                        return (
                            <Form method={'post'}>
                                <Modal.Body style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                                    <BootstrapInput label={'标题'} name={'title'}/>
                                    <FormGroup>
                                        <FormLabel htmlFor={'preview'}>预览图片</FormLabel>
                                        <FileBrowserInput name={'preview'} type={1} multi={false}/>
                                    </FormGroup>
                                    <BootstrapInput label={'拍卖地点'} name={'address'} placeholder={'线下拍卖会地点'}/>
                                    <BootstrapInput label={'拍卖时间'} name={'timeRange'} placeholder={'拍卖会拍卖时间范围'}/>


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

export default AuctionEditor;