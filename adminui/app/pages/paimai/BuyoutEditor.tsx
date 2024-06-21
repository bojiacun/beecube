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
import BootstrapSwitch from "~/components/form/BootstrapSwitch";


//一口价编辑器
const BuyoutEditor = (props: any) => {
    const {model, onHide} = props;
    const [goodsClassOptions, setGoodsClassOptions] = useState<any[]>([]);
    const goodsClassFetcher = useFetcher();
    const postFetcher = useFetcher();
    const formikRef = useRef<any>();


    const GoodsSchema = Yup.object().shape({
        title: Yup.string().required('必填字段'),
        spec: Yup.string().required('必填字段'),
        homeCover: Yup.string().required('必填字段'),
        listCover: Yup.string().required('必填字段'),
        startPrice: Yup.number().required('必填字段'),
        images: Yup.string().required('必填字段'),
        classId: Yup.number().required('必填字段'),
        commission: Yup.number().integer(),
        stock: Yup.number().integer(),
        baseSales: Yup.number().integer().default(1),
        sortNum: Yup.number().integer().default(0),
    });

    const handleOnSubmit = (values: any) => {
        values.type = 2;
        if (values.id) {
            postFetcher.submit(values, {method: 'post', action: '/paimai/goods/edit'});
        } else {
            postFetcher.submit(values, {method: 'post', action: '/paimai/goods/add'});
        }
    }
    useEffect(() => {
        if (model) {
            goodsClassFetcher.load('/paimai/buyout/classes/all');
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

    const newModel = {status: 0, type: 1, sortNum: 0, endTime: '', images: '', ...model};

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
                    <Modal.Title id={'edit-user-model'}>{model?.id ? '编辑' : '新建'}一口价拍品</Modal.Title>
                </Modal.Header>
                <Formik innerRef={formikRef} initialValues={newModel} validationSchema={GoodsSchema}
                        onSubmit={handleOnSubmit}>
                    {(formik)=>{
                        return (
                            <Form method={'post'}>
                                <Modal.Body style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                                    <BootstrapSelect name={'classId'} label={'分类'} options={goodsClassOptions}/>
                                    <BootstrapInput label={'标题'} name={'title'}/>
                                    <BootstrapInput label={'型号'} name={'spec'}/>
                                    <BootstrapInput label={'副标题'} name={'subTitle'}/>
                                    <FormGroup className={'mb-1'}>
                                        <FormLabel htmlFor={'fields'}>其他字段</FormLabel>
                                        <Row>
                                            <Col sm={12}>
                                                <DescListConfiger label={'点击配置'} name={'fields'} />
                                            </Col>
                                        </Row>
                                    </FormGroup>

                                    <BootstrapInput label={'分销佣金'} name={'commission'} placeholder={'分销佣金百分比'}/>
                                    <BootstrapInput label={'积分抵扣比例'} name={'maxIntegralPercent'} placeholder={'积分抵扣比例，50%填50，1%填1'}/>
                                    <BootstrapInput label={'库存'} name={'stock'} placeholder={'库存数量，为0时无法下单'}/>
                                    <BootstrapInput label={'基础销量'} name={'baseSales'} placeholder={'基础销量'}/>
                                    <BootstrapInput label={'标签'} name={'tags'} placeholder={'自定义标签，用户搜索，用英文逗号分割每个标签，例如公益拍,保证金1:5'}/>
                                    <FormGroup className={'mb-1'}>
                                        <FormLabel htmlFor={'homeCover'}>首页封面</FormLabel>
                                        <FileBrowserInput name={'homeCover'} type={1} multi={false} />
                                    </FormGroup>
                                    <FormGroup className={'mb-1'}>
                                        <FormLabel htmlFor={'listCover'}>列表封面</FormLabel>
                                        <FileBrowserInput name={'listCover'} type={1} multi={false} />
                                    </FormGroup>
                                    <FormGroup className={'mb-1'}>
                                        <FormLabel htmlFor={'images'}>拍品图片</FormLabel>
                                        <FileBrowserInput name={'images'} type={1} multi={true}/>
                                    </FormGroup>
                                    <BootstrapInput label={'一口价'} name={'startPrice'}/>
                                    <FormGroup>
                                        <FormLabel htmlFor={'description'}>拍品详情</FormLabel>
                                        <TinymceEditor name={'description'}/>
                                    </FormGroup>
                                    <BootstrapInput label={'排序'} name={'sortNum'} style={{maxWidth: 200}} type={'number'} />
                                    <BootstrapSwitch label={'是否推荐'} name={'recommend'} />
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

export default BuyoutEditor;
