import {Modal, FormGroup, FormLabel, Button, Col, Row, FormControl} from "react-bootstrap";
import {Field, useFormik, Form, Formik} from "formik";
import {emptyDropdownIndicator, emptyIndicatorSeparator, handleSaveResult, showToastError} from "~/utils/utils";
import {AwesomeButton} from "react-awesome-button";
import {useFetcher} from "@remix-run/react";
import * as Yup from "yup";
import {useEffect, useRef, useState} from "react";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import PositionListSelector from "~/pages/system/roles/PositionListSelector";
import classNames from "classnames";
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
import MenuTreeSelector from "~/pages/system/permissions/MenuTreeSelector";
import BootstrapSwitch from "~/components/form/BootstrapSwitch";



const UserPasswordSchema = Yup.object().shape({
    password: Yup.string().required('必填字段'),
    confirmpassword: Yup.string().required('必填字段').test('password-match', '两次密码输入不一致', (value, context)=>{
        return context.parent.password === value;
    }),
});

const UserPassword = (props: any) => {
    const {model, onHide} = props;
    const postFetcher = useFetcher();
    const formikRef = useRef<any>();



    const handleOnSubmit = (values: any) => {
        if (values.id) {
            postFetcher.submit(values, {method: 'post', action: '/system/users/changepwd'});
        }
    }
    useEffect(() => {
        if (postFetcher.type === 'done' && postFetcher.data) {
            formikRef.current!.setSubmitting(false);
            handleSaveResult(postFetcher.data);
            if (postFetcher.data.success) {
                onHide();
            }
        }
    }, [postFetcher.state]);


    if (!model) return <></>

    return (
        <Modal
            show={!!model}
            onHide={onHide}
            backdrop={'static'}
            aria-labelledby={'edit-modal'}
        >
            <Modal.Header closeButton>
                <Modal.Title id={'edit-user-model'}>修改密码</Modal.Title>
            </Modal.Header>
            {model &&
                <Formik innerRef={formikRef} initialValues={model} validationSchema={UserPasswordSchema}
                        onSubmit={handleOnSubmit}>
                    {({isSubmitting, values, errors}) => {
                        return (
                            <Form method={'post'}>
                                <Modal.Body style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                                    <BootstrapInput type={'text'} disabled label={'用户账号'} name={'username'} />
                                    <BootstrapInput type={'password'} label={'新密码'} name={'password'} />
                                    <BootstrapInput type={'password'} label={'确认密码'} name={'confirmpassword'} />
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button
                                        variant={'primary'}
                                        disabled={isSubmitting}
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
    );
}

export default UserPassword;