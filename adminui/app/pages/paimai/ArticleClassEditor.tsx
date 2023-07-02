import {Modal, Button} from "react-bootstrap";
import {Form, Formik} from "formik";
import {handleSaveResult} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import * as Yup from "yup";
import {useEffect, useRef} from "react";
//@ts-ignore
import _ from 'lodash';
import BootstrapInput from "~/components/form/BootstrapInput";
import BootstrapRadioGroup from "~/components/form/BootstrapRadioGroup";

const ArticleClassSchema = Yup.object().shape({
    name: Yup.string().required('必填字段'),
    sortNum: Yup.number().integer().default(0),
});

const ArticleClassEditor = (props: any) => {
    const {model, onHide} = props;
    const postFetcher = useFetcher();
    const formikRef = useRef<any>();


    const handleOnSubmit = (values: any) => {
        if (values.id) {
            postFetcher.submit(values, {method: 'post', action: '/paimai/articles/classes/edit'});
        } else {
            postFetcher.submit(values, {method: 'post', action: '/paimai/articles/classes/add'});
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
                    <Modal.Title id={'edit-user-model'}>{model?.id ? '编辑' : '新建'}文章分类</Modal.Title>
                </Modal.Header>
                {model &&
                    <Formik innerRef={formikRef} initialValues={{status: 1, sortNum: 0, ...model}}
                            validationSchema={ArticleClassSchema} onSubmit={handleOnSubmit}>
                        {(formik) => {
                            return (
                                <Form method={'post'}>
                                    <Modal.Body style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                                        <BootstrapInput label={'分类名称'} name={'name'}/>
                                        <BootstrapRadioGroup options={[{label: '图文类', value: '1'}, {
                                            label: '视频类',
                                            value: '2'
                                        }, {label: '服务指南', value: '3'}, {label: '帮助中心', value: '4'}]} name={'type'} label={'文章模块'}/>
                                        <BootstrapInput label={'排序'} name={'sortNum'} style={{maxWidth: 200}}
                                                        type={'number'}/>
                                        <BootstrapRadioGroup
                                            options={[{label: '不显示', value: '0'}, {label: '显示', value: '1'}]}
                                            name={'status'} label={'状态'}/>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button
                                            variant={'primary'}
                                            disabled={formik.isSubmitting}
                                            type={'submit'}
                                        >
                                            保存
                                        </Button>
                                    </Modal.Footer>
                                </Form>
                            );
                        }}
                    </Formik>
                }
            </Modal>
        </>
    );
}

export default ArticleClassEditor;