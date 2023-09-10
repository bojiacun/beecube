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

const FormSchema = Yup.object().shape({
    title: Yup.string().required('必填字段'),
    address: Yup.string().required('必填字段'),
    startTime: Yup.string().required('必填字段'),
    streamLayout: Yup.number().required('必填字段'),
    endTime: Yup.string().required('必填字段'),
    preview: Yup.string().required('必填字段'),
});

const LiveRoomEditor = (props: any) => {
    const {model, onHide} = props;
    const postFetcher = useFetcher();
    const formikRef = useRef<any>();

    const handleOnSubmit = (values: any) => {
        delete values.streams;
        if (values.id) {
            postFetcher.submit(values, {method: 'post', action: '/paimai/live/rooms/edit'});
        } else {
            postFetcher.submit(values, {method: 'post', action: '/paimai/live/rooms/add'});
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

    const newModel = {status: 0, type: 1, endTime: '', images: '', streamLayout: 1, ...model};

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
                    <Modal.Title id={'edit-user-model'}>{model?.id ? '编辑' : '新建'}直播间</Modal.Title>
                </Modal.Header>
                <Formik innerRef={formikRef} initialValues={newModel} validationSchema={FormSchema}
                        onSubmit={handleOnSubmit}>
                    {(formik)=>{
                        return (
                            <Form method={'post'}>
                                <Modal.Body style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                                    <BootstrapInput label={'标题'} name={'title'}/>
                                    <BootstrapInput label={'公告'} name={'notice'} type={'textarea'} />
                                    <FormGroup className={'mb-1'}>
                                        <FormLabel htmlFor={'preview'}>预览图片</FormLabel>
                                        <FileBrowserInput name={'preview'} type={1} multi={false}/>
                                    </FormGroup>
                                    <BootstrapInput label={'保证金'} name={'deposit'} placeholder={'保证金（元）'}/>
                                    <BootstrapInput label={'标签'} name={'tags'} placeholder={'自定义标签，用户搜索，用英文逗号分割每个标签，例如公益拍,保证金1:5'}/>
                                    <BootstrapInput label={'地址'} name={'address'}/>
                                    <BootstrapDateTime label={'开始时间'} name={'startTime'} showTime={true}/>
                                    <BootstrapDateTime label={'结束时间'} name={'endTime'} showTime={true} disabled={model?.id} isClearable={!model?.id} />
                                    <BootstrapInput label={'主播ID'} name={'mainAnchor'} placeholder={'主播的用户ID'}/>
                                    <BootstrapRadioGroup options={[{label: '布局一', value: '1'}, {label: '布局二', value: '2'}, {label: '布局三', value: '3'}]} name={'streamLayout'} label={'布局方式'} />
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

export default LiveRoomEditor;