import {Button, Modal} from "react-bootstrap";
import {Form, Formik} from "formik";
import {FetcherState, getFetcherState, handleSaveResult} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import * as Yup from "yup";
import {useEffect, useRef} from "react";
//@ts-ignore
import _ from 'lodash';
import BootstrapInput from "~/components/form/BootstrapInput";


const FapiaoDeliveryConfirmEditor = (props: any) => {
    const {model, onHide} = props;
    const postFetcher = useFetcher();
    const formikRef = useRef<any>();


    const GoodsSchema = Yup.object().shape({
        deliveryNo: Yup.string().required('快递单号'),
        deliveryCode: Yup.string().required('快递代码'),
    });

    const handleOnSubmit = (values: any) => {
        values.id = model.id;
        postFetcher.submit(values, {method: 'put', action: '/paimai/fapiaos/resolve?id='+model.id+'&status=2'});
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
                centered
                backdrop={'static'}
                aria-labelledby={'edit-modal'}
            >
                <Modal.Header closeButton>
                    <Modal.Title id={'edit-user-model'}>确认开票并邮寄</Modal.Title>
                </Modal.Header>
                <Formik innerRef={formikRef} initialValues={{}}  validationSchema={GoodsSchema}
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

export default FapiaoDeliveryConfirmEditor;