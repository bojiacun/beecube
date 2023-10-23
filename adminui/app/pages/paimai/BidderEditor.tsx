import {Button, FormGroup, FormLabel, Modal} from "react-bootstrap";
import {Form, Formik} from "formik";
import {FetcherState, getFetcherState, handleSaveResult} from "~/utils/utils";
import {useFetcher, useFetchers} from "@remix-run/react";
import * as Yup from "yup";
import {useEffect, useRef, useState} from "react";
//@ts-ignore
import _ from 'lodash';
import BootstrapInput from "~/components/form/BootstrapInput";
import BootstrapRadioGroup from "~/components/form/BootstrapRadioGroup";
import BootstrapTextarea from "~/components/form/BootstrapTextarea";


const BidderEditor = (props: any) => {
    const {model, onHide} = props;
    const postFetcher = useFetcher();
    const formikRef = useRef<any>();

    const schema = Yup.object().shape({
        realName: Yup.string().required('必填字段'),
        phone: Yup.string().required('必填字段'),
    });

    const handleOnSubmit = (values: any) => {
        if (values.id) {
            postFetcher.submit(values, {method: 'post', action: '/paimai/bidders/edit'});
        } else {
            postFetcher.submit(values, {method: 'post', action: '/paimai/bidders/add'});
        }
    }

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

    const newModel = {...model};

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
                    <Modal.Title id={'edit-user-model'}>{model?.id ? '编辑' : '新建'}竞买人</Modal.Title>
                </Modal.Header>
                <Formik innerRef={formikRef} initialValues={newModel} validationSchema={schema}
                        onSubmit={handleOnSubmit}>
                    {(formik)=>{
                        return (
                            <Form method={'post'}>
                                <Modal.Body style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                                    <BootstrapInput label={'竞买人姓名'} name={'realName'} />
                                    <BootstrapInput label={'手机号'} name={'phone'} />
                                    <BootstrapInput label={'直播间ID'} name={'roomId'} />
                                    <BootstrapInput label={'专场ID'} name={'performanceId'} />
                                    <BootstrapInput label={'独立拍品ID'} name={'goodsId'} />
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

export default BidderEditor;