import {Button, Col, FormGroup, FormLabel, Modal, Row} from "react-bootstrap";
import {Form, Formik} from "formik";
import {emptyDropdownIndicator, emptyIndicatorSeparator, FetcherState, getFetcherState, handleSaveResult} from "~/utils/utils";
import {useFetcher, useFetchers} from "@remix-run/react";
import * as Yup from "yup";
import {useEffect, useRef, useState} from "react";
//@ts-ignore
import _ from 'lodash';
import BootstrapInput from "~/components/form/BootstrapInput";
import BootstrapRadioGroup from "~/components/form/BootstrapRadioGroup";
import BootstrapTextarea from "~/components/form/BootstrapTextarea";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";


const CouponEditor = (props: any) => {
    const {model, onHide} = props;
    const [ruleMemberOptions, setRuleMemberOptions] = useState<{ label: string, value: any }[]>([]);
    const [ruleGoodsOptions, setRuleGoodsOptions] = useState<{ label: string, value: any }[]>([]);
    const [memberOptions, setMemberOptions] = useState<any[]>([]);
    const [memberIds, setMemberIds] = useState<string[]>();
    const [memberSelectorShow, setMemberSelectorShow] = useState<boolean>(false);
    const postFetcher = useFetcher();
    const dictFetcher1 = useFetcher();
    const dictFetcher2 = useFetcher();
    const formikRef = useRef<any>();


    useEffect(() => {
        dictFetcher1.load('/system/dicts?dictCode=paimai_coupon_rule_member');
        dictFetcher2.load('/system/dicts?dictCode=paimai_coupon_rule_goods');
    }, []);
    useEffect(() => {
        if (getFetcherState(dictFetcher1) === FetcherState.DONE) {
            setRuleMemberOptions(dictFetcher1.data.map((item: any) => ({value: item.value, label: item.text})));
        }
    }, [dictFetcher1.state]);
    useEffect(() => {
        if (getFetcherState(dictFetcher2) === FetcherState.DONE) {
            setRuleGoodsOptions(dictFetcher2.data.map((item: any) => ({value: item.value, label: item.text})));
        }
    }, [dictFetcher2.state]);

    const GoodsSchema = Yup.object().shape({
        title: Yup.string().required('必填字段'),
        ruleMember: Yup.number().integer().required('必填字段'),
        ruleGoods: Yup.number().integer().required('必填字段'),
        startDays: Yup.number().integer().required('必填字段'),
        endDays: Yup.number().integer().required('必填字段'),
        perCount: Yup.number().integer().required('必填字段'),
        maxCount: Yup.number().integer().required('必填字段'),
        amount: Yup.number().required('必填字段'),
        minPrice: Yup.number().required('必填字段'),
    });

    useEffect(() => {
        if (getFetcherState(postFetcher) === FetcherState.DONE) {
            formikRef.current!.setSubmitting(false);
            handleSaveResult(postFetcher.data);
            if (postFetcher.data.success) {
                onHide(postFetcher.data.result);
            }
        }
    }, [postFetcher.state]);

    const handleOnMemberSelectChanged = (currentValue: any) => {
        let data = {name: 'post', value: currentValue.map((item: any) => item.value).join(',')};
        let e = {currentTarget: data};
        formikRef.current!.handleChange(e);
        setMemberIds(currentValue);
    }
    const handleOnSubmit = (values: any) => {
        if (values.id) {
            postFetcher.submit(values, {method: 'post', action: '/paimai/coupons/edit'});
        } else {
            postFetcher.submit(values, {method: 'post', action: '/paimai/coupons/add'});
        }
    }



    if (!model) return <></>

    const newModel = {status: 0, ruleMember: 1, ruleGoods: 1, ...model};

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
                    <Modal.Title id={'edit-user-model'}>{model?.id ? '编辑' : '新建'}优惠券模板</Modal.Title>
                </Modal.Header>
                <Formik innerRef={formikRef} initialValues={newModel} validationSchema={GoodsSchema}
                        onSubmit={handleOnSubmit}>
                    {(formik) => {
                        return (
                            <Form method={'post'}>
                                <Modal.Body style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                                    <BootstrapInput label={'标题'} name={'title'}/>
                                    <BootstrapTextarea label={'描述信息'} name={'description'}/>
                                    <BootstrapInput label={'最低消费'} name={'minPrice'}/>
                                    <BootstrapInput label={'面额'} name={'amount'}/>
                                    <BootstrapInput label={'生效时间'} name={'startDays'} placeholder={'领取后多少天生效'}/>
                                    <BootstrapInput label={'失效时长'} name={'endDays'} placeholder={'生效后多少天失效'}/>
                                    <BootstrapInput label={'最大数量'} name={'maxCount'} placeholder={'最大发放数量'}/>
                                    <BootstrapInput label={'每人限领'} name={'perCount'} placeholder={'每人限制领取多少张'}/>
                                    <BootstrapRadioGroup options={ruleMemberOptions} name={'ruleMember'} label={'适用人群'}/>
                                    {formik.values.ruleMember == 2 &&
                                        <FormGroup className={'mb-1'}>
                                            <FormLabel htmlFor={'ruleMemberIds'}>选择用户</FormLabel>
                                            <Row>
                                                <Col sm={10}>
                                                    <ReactSelectThemed
                                                        id={'ruleMemberIds'}
                                                        name={'ruleMemberIds'}
                                                        components={{DropdownIndicator: emptyDropdownIndicator, IndicatorSeparator: emptyIndicatorSeparator}}
                                                        placeholder={'选择会员'}
                                                        isClearable={true}
                                                        isSearchable={false}
                                                        isMulti={true}
                                                        openMenuOnClick={false}
                                                        options={memberOptions}
                                                        onChange={handleOnMemberSelectChanged}
                                                        value={memberIds}
                                                    />
                                                </Col>
                                                <Col sm={2}>
                                                    <Button onClick={() => setMemberSelectorShow(true)}>选择</Button>
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                    }
                                    <BootstrapRadioGroup options={ruleGoodsOptions} name={'ruleGoods'} label={'适用商品'}/>
                                    {formik.values.ruleGoods == 1 &&
                                        <BootstrapInput label={'商品分类ID'} name={'ruleGoodsClassId'} placeholder={'此分类下的所有商品可用'}/>
                                    }
                                    {formik.values.ruleGoods == 2 &&
                                        <BootstrapInput label={'商品ID'} name={'ruleGoodsId'} placeholder={'此商品可用'}/>
                                    }
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

export default CouponEditor;