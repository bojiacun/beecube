import {Modal, FormGroup, FormLabel, Button, Col, Row} from "react-bootstrap";
import {Form, Formik} from "formik";
import {handleSaveResult} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import * as Yup from "yup";
import {useEffect, useRef, useState} from "react";
//@ts-ignore
import _ from 'lodash';
import FileBrowserInput from "~/components/filebrowser/form";
import BootstrapInput from "~/components/form/BootstrapInput";
import BootstrapRadioGroup from "~/components/form/BootstrapRadioGroup";


const formSchema = Yup.object().shape({
});


const AppMemberEdit = (props: any) => {
    const {model, onHide, refreshData} = props;
    const [links, setLinks] = useState<any[]>([]);
    const postFetcher = useFetcher();
    const searchFetcher = useFetcher();
    const formikRef = useRef<any>();


    useEffect(()=>{
        searchFetcher.load("/app/members");
    }, []);

    useEffect(() => {
        if (searchFetcher.type === 'done' && searchFetcher.data) {
            setLinks(searchFetcher.data);
        }
    }, [searchFetcher.state]);

    const handleOnSubmit = (values: any) => {
        if (values.id) {
            postFetcher.submit(values, {method: 'post', action: '/app/members/edit'});
        }
    }

    useEffect(() => {
        if (postFetcher.type === 'done' && postFetcher.data) {
            formikRef.current!.setSubmitting(false);
            handleSaveResult(postFetcher.data);
            if (postFetcher.data.success) {
                onHide();
                refreshData();
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
                centered
                backdrop={'static'}
                aria-labelledby={'edit-modal'}
            >
                <Modal.Header closeButton>
                    <Modal.Title id={'edit-user-model'}>{model?.id ? '编辑' : '新建'}用户信息</Modal.Title>
                </Modal.Header>
                {model &&
                    <Formik innerRef={formikRef} initialValues={{...model}} validationSchema={formSchema} onSubmit={handleOnSubmit}>
                        {(formik)=>{
                            return (
                                <Form method={'post'}>
                                    <Modal.Body style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                                        <BootstrapInput label={'小程序OPENID'} readOnly={model?.id} name={'wxappOpenid'}/>
                                        <BootstrapInput label={'用户名'} readOnly={model?.id} name={'username'}/>
                                        <FormGroup>
                                            <FormLabel htmlFor={'avatar'}>头像</FormLabel>
                                            <FileBrowserInput name={'avatar'} type={1} multi={false} />
                                        </FormGroup>
                                        <BootstrapInput label={'昵称'}  name={'nickname'}/>
                                        <BootstrapInput label={'真实姓名'}  name={'realname'}/>
                                        <BootstrapInput label={'手机号'}  name={'phone'}/>
                                        <BootstrapInput label={'身份证号'}  name={'idCard'}/>
                                        <FormGroup>
                                            <FormLabel htmlFor={'cardFace'}>身份证前照</FormLabel>
                                            <FileBrowserInput name={'cardFace'} type={1} multi={false} />
                                        </FormGroup>
                                        <FormGroup>
                                            <FormLabel htmlFor={'cardBack'}>身份证背照</FormLabel>
                                            <FileBrowserInput name={'cardBack'} type={1} multi={false} />
                                        </FormGroup>
                                        <BootstrapRadioGroup  options={[{label: '是', value: '1'},{label: '否', value: '0'}]} name={'isAgent'} label={'分销商？'} />
                                        <BootstrapRadioGroup  options={[{label: '未认证', value: '0'},{label: '待审核', value: '1'},{label: '已认证', value: '2'}]} name={'authStatus'} label={'认证状态'} />
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

export default AppMemberEdit;