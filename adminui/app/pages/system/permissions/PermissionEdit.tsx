import {Modal, FormGroup, FormLabel, Button, Col, Row} from "react-bootstrap";
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


const checkHandlers: any = {};

const menuTypeOptions = [
    {label: '一级菜单', value: '0'},
    {label: '子菜单', value: '1'},
    {label: '按钮权限', value: '2'},
];

const PermissionEdit = (props: any) => {
    const {model, onHide} = props;
    const postFetcher = useFetcher();


    const PermissionSchema = Yup.object().shape({
        name: Yup.string().required(),
        url: Yup.string().required()
    });

    const handleOnSubmit = (values:any)=>{
        console.log(values);
        // if (values.id) {
        //     postFetcher.submit(values, {method: 'post', action: '/system/users/edit'});
        // } else {
        //     postFetcher.submit(values, {method: 'post', action: '/system/users/add'});
        // }
    }






    useEffect(() => {
        if (postFetcher.type === 'done' && postFetcher.data) {
            handleSaveResult(postFetcher.data);
            if (postFetcher.data.success) {
                onHide();
            }
        }
    }, [postFetcher.state]);



    if (!model) return <></>

    return (
        <>
            <Modal
                show={!!model}
                onHide={onHide}
                backdrop={'static'}
                aria-labelledby={'edit-modal'}
            >
                <Modal.Header closeButton>
                    <Modal.Title id={'edit-user-model'}>{model?.id ? '编辑' : '新建'}菜单</Modal.Title>
                </Modal.Header>
                {model &&
                    <Formik initialValues={{menuType: 0, ...model}} validationSchema={PermissionSchema} onSubmit={handleOnSubmit}>
                        {({isSubmitting})=>{
                            return (
                                <Form method={'post'}>
                                    <Modal.Body style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                                        <BootstrapRadioGroup options={menuTypeOptions} name={'menuType'} label={'菜单类型'}/>
                                        <BootstrapInput label={'菜单名称'} name={'name'}/>
                                        <BootstrapInput label={'访问路径'} name={'url'}/>
                                        <BootstrapInput label={'访问图标'} name={'icon'}/>
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
        </>
    );
}

export default PermissionEdit;