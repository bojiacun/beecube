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



const DepartRoleSchema = Yup.object().shape({
    roleName: Yup.string().required('必填字段'),
    roleCode: Yup.string().required('必填字段'),
});

const DepartRoleEdit = (props: any) => {
    const {model, onHide} = props;
    const postFetcher = useFetcher();
    const formikRef = useRef<any>();

    const handleOnSubmit = (values: any) => {
        if(model.id) {
            postFetcher.submit(values, {method: 'put', action: '/system/departs/roles/edit'});
        }
        else {
            postFetcher.submit(values, {method: 'post', action: '/system/departs/roles/add'});
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
            aria-labelledby={'add-depart-modal'}
        >
            <Modal.Header closeButton>
                <Modal.Title id={'edit-user-model'}>{model?.id ? '编辑' : '新建'}部门角色</Modal.Title>
            </Modal.Header>
            {model &&
                <Formik innerRef={formikRef} initialValues={{status: 1,...model}} validationSchema={DepartRoleSchema}
                        onSubmit={handleOnSubmit}>
                    {({isSubmitting, values, errors}) => {
                        return (
                            <Form method={'post'}>
                                <Modal.Body style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                                    <BootstrapInput label={'部门角色名称'} name={'roleName'}/>
                                    <BootstrapInput label={'部门角色编码'} name={'roleCode'} />
                                    <BootstrapInput label={'备注'} name={'description'} rows={3} as={'textarea'}/>
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

export default DepartRoleEdit;