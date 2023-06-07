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
import BootstrapLinkSelector from "~/components/form/BootstrapLinkSelector";


const SmtEditor = (props: any) => {
    const {model, onHide} = props;
    const postFetcher = useFetcher();
    const formikRef = useRef<any>();
    const [links, setLinks] = useState<any[]>([]);
    const searchFetcher = useFetcher();


    useEffect(()=>{
        searchFetcher.load("/app/links");
    }, []);
    const schema = Yup.object().shape({
        title: Yup.string().required('必填字段'),
        templateId: Yup.string().required('必填字段'),
        vars: Yup.string().required('必填字段'),
        url: Yup.string().required('必填字段'),
    });

    const handleOnSubmit = (values: any) => {
        if (values.id) {
            postFetcher.submit(values, {method: 'post', action: '/paimai/smts/edit'});
        } else {
            postFetcher.submit(values, {method: 'post', action: '/paimai/smts/add'});
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
                    <Modal.Title id={'edit-user-model'}>{model?.id ? '编辑' : '新建'}短信模板</Modal.Title>
                </Modal.Header>
                <Formik innerRef={formikRef} initialValues={newModel} validationSchema={schema}
                        onSubmit={handleOnSubmit}>
                    {(formik)=>{
                        return (
                            <Form method={'post'}>
                                <Modal.Body style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                                    <BootstrapInput label={'模板标题'} name={'title'} />
                                    <BootstrapInput label={'短信模板ID'} name={'templateId'} />
                                    <BootstrapInput label={'变量替换'} name={'vars'} placeholder={'形式如{id}:{id};{xxx}:{xxx}，前面的变量为模板消息中的变量，后面的变量为系统可用变量，系统可用变量有:会员名称：{memberName}'} />
                                    <BootstrapLinkSelector links={links} label={'链接地址'} name={'url'} />
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

export default SmtEditor;