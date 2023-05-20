import {Button, Modal} from "react-bootstrap";
import {Form, Formik} from "formik";
import {FetcherState, getFetcherState, handleSaveResult} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import * as Yup from "yup";
import {useEffect, useRef} from "react";
//@ts-ignore
import _ from 'lodash';
import BootstrapInput from "~/components/form/BootstrapInput";

const formSchema = Yup.object().shape({
    moduleId: Yup.string().required('必填字段'),
    moduleName: Yup.string().required('必填字段'),
    menuId: Yup.string().required('必填字段'),
    menuName: Yup.string().required('必填字段'),
});

const ModuleMenuEditor = (props: any) => {
    const {model, onHide} = props;
    const postFetcher = useFetcher();
    const formikRef = useRef<any>();


    const handleOnSubmit = (values: any) => {
        if (values.id) {
            postFetcher.submit(values, {method: 'post', action: '/app/module/menu/edit'});
        } else {
            postFetcher.submit(values, {method: 'post', action: '/app/module/menu/add'});
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
                    <Modal.Title id={'edit-user-model'}>{model?.id ? '编辑' : '新建'}模块权限</Modal.Title>
                </Modal.Header>
                {model &&
                    <Formik innerRef={formikRef} initialValues={{status: 1, sortNum: 0, ...model}}
                            validationSchema={formSchema} onSubmit={handleOnSubmit}>
                        {(formik) => {
                            return (
                                <Form method={'post'}>
                                    <Modal.Body style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                                        <BootstrapInput label={'模块ID'} name={'moduleId'} readOnly={model?.id} />
                                        <BootstrapInput label={'模块名称'} name={'moduleName'} readOnly={model?.id} />
                                        <BootstrapInput label={'菜单ID'} name={'menuId'}/>
                                        <BootstrapInput label={'菜单名称'} name={'menuName'}/>
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

export default ModuleMenuEditor;