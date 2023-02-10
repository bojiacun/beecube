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


const GoodsEditor = (props: any) => {
    const {model, onHide, selectedRole} = props;
    const [goodsClassOptions, setGoodsClassOptions] = useState<any[]>([]);
    const [uprangConfigerShow, setUprangConfigerShow] = useState<boolean>(false);

    const goodsClassFetcher = useFetcher();
    const postFetcher = useFetcher();
    const formikRef = useRef<any>();


    const GoodsSchema = Yup.object().shape({
        title: Yup.string().required('必填字段'),
        type: Yup.number().required('必填字段'),
        startPrice: Yup.number().required('必填字段'),
        uprange: Yup.string().required('必填字段'),
        endTime: Yup.string().required('必填字段'),
        images: Yup.string().required('必填字段'),
    });

    const handleOnSubmit = (values: any) => {
        if (values.id) {
            postFetcher.submit(values, {method: 'post', action: '/system/users/edit'});
        } else {
            values.selectedroles = selectedRole?.id;
            postFetcher.submit(values, {method: 'post', action: '/system/users/add'});
        }
    }
    useEffect(() => {
        if (model) {
            goodsClassFetcher.load('/paimai/goods/classes/all');
        }
    }, [model]);

    //拍品分类
    useEffect(() => {
        if (goodsClassFetcher.type === 'done' && goodsClassFetcher.data) {
            setGoodsClassOptions(goodsClassFetcher.data.map((item: any) => ({label: item.name, value: item.id})));
        }
    }, [goodsClassFetcher.state]);


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
                    <Modal.Title id={'edit-user-model'}>{model?.id ? '编辑' : '新建'}拍品</Modal.Title>
                </Modal.Header>
                <Formik innerRef={formikRef} initialValues={{status: 0, type: 1, endTime: '', images: '', ...model}} validationSchema={GoodsSchema}
                        onSubmit={handleOnSubmit}>
                    <Form method={'post'}>
                        <Modal.Body style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                            <BootstrapSelect name={'class_id'} label={'分类'} options={goodsClassOptions}/>
                            <BootstrapInput label={'标题'} name={'title'}/>
                            <BootstrapInput label={'副标题'} name={'subTitle'}/>
                            <FormGroup>
                                <FormLabel htmlFor={'images'}>拍品图片</FormLabel>
                                <FileBrowserInput name={'images'} type={1} multi={true}/>
                            </FormGroup>

                            <BootstrapDateTime label={'结束时间'} name={'endTime'} showTime={true}/>
                            <BootstrapInput label={'起拍价'} name={'startPrice'}/>
                            <BootstrapInput label={'保证金'} name={'deposit'} placeholder={'保证金（元）'}/>
                            <BootstrapInput label={'延时周期'} name={'delayTime'} placeholder={'延时周期（分钟）'}/>
                            <BootstrapRadioGroup options={[{label: '普通拍品', value: '1'}, {label: '一口价', value: '2'}]} name={'type'}
                                                 label={'拍品类型'}/>

                            <FormGroup>
                                <FormLabel htmlFor={'uprange'}>加价配置</FormLabel>
                                <Row>
                                    <Col sm={12}>
                                        <UprangConfiger  label={'点击配置'} name={'uprange'} />
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <FormLabel htmlFor={'desc_flow'}>拍品流程</FormLabel>
                                <TinymceEditor name={'desc_flow'}/>
                            </FormGroup>
                            <FormGroup>
                                <FormLabel htmlFor={'desc_delivery'}>物流运输</FormLabel>
                                <TinymceEditor name={'desc_delivery'}/>
                            </FormGroup>
                            <FormGroup>
                                <FormLabel htmlFor={'desc_notice'}>注意事项</FormLabel>
                                <TinymceEditor name={'desc_notice'}/>
                            </FormGroup>
                            <FormGroup>
                                <FormLabel htmlFor={'desc_read'}>拍卖须知</FormLabel>
                                <TinymceEditor name={'desc_read'}/>
                            </FormGroup>
                            <FormGroup>
                                <FormLabel htmlFor={'desc_deposit'}>保证金说明</FormLabel>
                                <TinymceEditor name={'desc_deposit'}/>
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
                </Formik>
            </Modal>
        </>
    );
}

export default GoodsEditor;