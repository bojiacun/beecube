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


const OfferConfirmEditor = (props: any) => {
    const {model, onHide} = props;
    const postFetcher = useFetcher();
    const formikRef = useRef<any>();


    const GoodsSchema = Yup.object().shape({
        deliveryNo: Yup.string().required('快递单号'),
        deliveryCode: Yup.string().required('快递代码'),
    });

    const handleOnSubmit = (values: any) => {
        values.id = model.id;
        postFetcher.submit(values, {method: 'put', action: '/paimai/orders/delivery?id='+model.id});
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
                    <Modal.Title id={'edit-user-model'}>确认发货</Modal.Title>
                </Modal.Header>
                <Formik innerRef={formikRef} initialValues={newModel} validationSchema={GoodsSchema}
                        onSubmit={handleOnSubmit}>
                    {(formik)=>{
                        return (
                            <Form method={'post'}>
                                <Modal.Body style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                                    <BootstrapInput label={'快递代码'} name={'deliveryCode'} />
                                    <BootstrapInput label={'快递单号'} name={'deliveryNo'} />
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

export default OfferConfirmEditor;