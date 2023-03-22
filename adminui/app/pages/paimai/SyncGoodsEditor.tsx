import {Modal, FormGroup, FormLabel, Button, Col, Row} from "react-bootstrap";
import {Form, Formik} from "formik";
import {handleSaveResult} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import * as Yup from "yup";
import {useEffect, useRef, useState} from "react";
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


const SyncGoodsEditor = (props: any) => {
    const {model, onHide, selectedPerformance} = props;
    const [goodsClassOptions, setGoodsClassOptions] = useState<any[]>([]);
    const goodsClassFetcher = useFetcher();
    const settingsFetcher = useFetcher();
    const postFetcher = useFetcher();
    const formikRef = useRef<any>();


    const GoodsSchema = Yup.object().shape({
        title: Yup.string().required('必填字段'),
        startPrice: Yup.number().required('必填字段'),
        uprange: Yup.string().required('必填字段'),
        images: Yup.string().required('必填字段'),
        classId: Yup.number().required('必填字段'),
        commission: Yup.number().integer().default(0),
        delayTime: Yup.number().integer().default(0),
        sortNum: Yup.number().integer().default(0),
    });

    const handleOnSubmit = (values: any) => {
        values.type = 1;
        values.performanceId = selectedPerformance.id;
        if (values.id) {
            postFetcher.submit(values, {method: 'post', action: '/paimai/goods/edit'});
        } else {
            postFetcher.submit(values, {method: 'post', action: '/paimai/goods/add'});
        }
    }
    useEffect(() => {
        if (model) {
            goodsClassFetcher.load('/paimai/goods/classes/all');
            settingsFetcher.load('/paimai/goods/settings');
        }
    }, [model]);

    //拍品分类
    useEffect(() => {
        if (goodsClassFetcher.type === 'done' && goodsClassFetcher.data) {
            setGoodsClassOptions(goodsClassFetcher.data.map((item: any) => ({label: item.name, value: item.id})));
        }
    }, [goodsClassFetcher.state]);
    useEffect(() => {
        if (settingsFetcher.type === 'done' && settingsFetcher.data) {
            if(!model?.id) {
                settingsFetcher.data?.forEach((s: any) => {
                    formikRef.current.setFieldValue(s.descKey, s.descValue);
                });
            }
        }
    }, [settingsFetcher.state]);

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

    const newModel = {status: 0, type: 1,  sortNum: 0, images: '', ...model};

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
                <Formik innerRef={formikRef} initialValues={newModel} validationSchema={GoodsSchema}
                        onSubmit={handleOnSubmit}>
                    {(formik)=>{
                        return (
                            <Form method={'post'}>
                                <Modal.Body style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                                    <BootstrapSelect name={'classId'} label={'分类'} options={goodsClassOptions}/>
                                    <BootstrapInput label={'标题'} name={'title'}/>
                                    <BootstrapInput label={'副标题'} name={'subTitle'}/>
                                    <FormGroup>
                                        <FormLabel htmlFor={'images'}>拍品图片</FormLabel>
                                        <FileBrowserInput name={'images'} type={1} multi={true}/>
                                    </FormGroup>
                                    <BootstrapInput label={'起拍价'} name={'startPrice'}/>
                                    <BootstrapInput label={'预估价'} name={'evaluatePrice'} />
                                    <BootstrapInput label={'保底价'} name={'minPrice'} />
                                    <BootstrapInput label={'保证金'} name={'deposit'} placeholder={'保证金（元）'}/>
                                    <BootstrapInput label={'佣金'} name={'commission'} placeholder={'佣金百分比'}/>
                                    <BootstrapInput label={'延时周期'} name={'delayTime'} placeholder={'延时周期（分钟）'}/>
                                    <BootstrapInput label={'标签'} name={'tags'} placeholder={'自定义标签，用户搜索，用英文逗号分割每个标签，例如公益拍,保证金1:5'}/>
                                    <BootstrapInput label={'标的号'} name={'sortNum'} style={{maxWidth: 200}} type={'number'} />
                                    <FormGroup>
                                        <FormLabel htmlFor={'uprange'}>加价配置</FormLabel>
                                        <Row>
                                            <Col sm={12}>
                                                <UprangConfiger  label={'点击配置'} name={'uprange'} />
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                    <FormGroup>
                                        <FormLabel htmlFor={'fields'}>其他字段</FormLabel>
                                        <Row>
                                            <Col sm={12}>
                                                <DescListConfiger label={'点击配置'} name={'fields'} />
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                    <FormGroup>
                                        <FormLabel htmlFor={'description'}>拍品描述</FormLabel>
                                        <TinymceEditor name={'description'}/>
                                    </FormGroup>
                                    <FormGroup>
                                        <FormLabel htmlFor={'descFlow'}>拍品流程</FormLabel>
                                        <TinymceEditor name={'descFlow'}/>
                                    </FormGroup>
                                    <FormGroup>
                                        <FormLabel htmlFor={'descDelivery'}>物流运输</FormLabel>
                                        <TinymceEditor name={'descDelivery'}/>
                                    </FormGroup>
                                    <FormGroup>
                                        <FormLabel htmlFor={'descNotice'}>注意事项</FormLabel>
                                        <TinymceEditor name={'descNotice'}/>
                                    </FormGroup>
                                    <FormGroup>
                                        <FormLabel htmlFor={'descRead'}>拍卖须知</FormLabel>
                                        <TinymceEditor name={'descRead'}/>
                                    </FormGroup>
                                    <FormGroup>
                                        <FormLabel htmlFor={'descDeposit'}>保证金说明</FormLabel>
                                        <TinymceEditor name={'descDeposit'}/>
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

export default SyncGoodsEditor;