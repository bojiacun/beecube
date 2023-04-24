import {Modal, FormGroup, FormLabel, Button, Col, Row, FormControl, FormText} from "react-bootstrap";
import {Form, Formik} from "formik";
import {emptyDropdownIndicator, emptyIndicatorSeparator, handleSaveResult, showToastError} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import * as Yup from "yup";
import {useEffect, useRef, useState} from "react";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import PositionListSelector from "~/pages/system/roles/PositionListSelector";
//@ts-ignore
import _ from 'lodash';
import FileBrowserInput from "~/components/filebrowser/form";
import BootstrapInput from "~/components/form/BootstrapInput";
import BootstrapRadioGroup from "~/components/form/BootstrapRadioGroup";
import BootstrapDateTime from "~/components/form/BootstrapDateTime";
import UprangConfiger from "~/pages/paimai/UprangConfiger";


const PerformanceEditor = (props: any) => {
    const {model, onHide, type} = props;
    const postFetcher = useFetcher();
    const formikRef = useRef<any>();

    let GoodsSchema;

    if(type == 2) {
        GoodsSchema = Yup.object().shape({
            title: Yup.string().required('必填字段'),
            deposit: Yup.number().required('必填字段'),
            preview: Yup.string().required('必填字段'),
            startTime: Yup.string().required('必填字段'),
            sortNum: Yup.number().integer().default(0),
        });
    }
    else {
        GoodsSchema = Yup.object().shape({
            title: Yup.string().required('必填字段'),
            startTime: Yup.string().required('必填字段'),
            deposit: Yup.number().required('必填字段'),
            endTime: Yup.string().required('必填字段'),
            preview: Yup.string().required('必填字段'),
            sortNum: Yup.number().integer().default(0),
        });
    }



    const handleOnSubmit = (values: any) => {
        values.type = type;
        if (values.id) {
            postFetcher.submit(values, {method: 'post', action: '/paimai/performances/edit'});
        } else {
            postFetcher.submit(values, {method: 'post', action: '/paimai/performances/add'});
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

    const newModel = {status: 0, type: 1, sortNum: 0, endTime: '', images: '', ...model};
    let titleText;
    switch (type) {
        case 1:
            titleText = '限时拍';
            break;
        case 2:
            titleText = '同步拍';
            break;
        case 3:
            titleText = '公益拍';
            break;
    }
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
                    <Modal.Title id={'edit-user-model'}>{model?.id ? '编辑' : '新建'}{titleText}专场</Modal.Title>
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
                                    <BootstrapDateTime label={'起拍时间'} name={'startTime'} showTime={true} />
                                    {type != 2 && <BootstrapDateTime label={'结束时间'} name={'endTime'} showTime={true}/>}
                                    <BootstrapInput label={'保证金'} name={'deposit'} placeholder={'保证金（元）'}/>
                                    <FormGroup>
                                        <FormLabel htmlFor={'uprange'}>加价配置</FormLabel>
                                        <Row>
                                            <Col sm={12}>
                                                <UprangConfiger  label={'点击配置'} name={'uprange'} />
                                            </Col>
                                        </Row>
                                        <FormText>专场统一加价配置，每次编辑的时候都会覆盖专场下所有拍品</FormText>
                                    </FormGroup>
                                    <BootstrapInput label={'标签'} name={'tags'} placeholder={'自定义标签，用户搜索，用英文逗号分割每个标签，例如公益拍,保证金1:5'}/>
                                    <BootstrapInput label={'排序'} name={'sortNum'} style={{maxWidth: 200}} type={'number'} />
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

export default PerformanceEditor;