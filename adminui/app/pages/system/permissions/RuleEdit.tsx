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



const RuleSchema = Yup.object().shape({
    ruleName: Yup.string().required('必填字段'),
    ruleValue: Yup.string().required('必填字段'),
    ruleConditions: Yup.string().required('必填字段'),
});

const RuleEdit = (props: any) => {
    const {model, onHide, selectedPermission} = props;
    const postFetcher = useFetcher();
    const formikRef = useRef<any>();



    const handleOnSubmit = (values: any) => {
        if (values.id) {
            postFetcher.submit(values, {method: 'post', action: '/system/permissions/rules/edit'});
        } else {
            postFetcher.submit(values, {method: 'post', action: '/system/permissions/rules/add'});
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
                <Modal.Title id={'edit-user-model'}>{model?.id ? '编辑' : '新建'}菜单</Modal.Title>
            </Modal.Header>
            {model &&
                <Formik innerRef={formikRef} initialValues={{menuType: 0, status: 1, ...model}} validationSchema={RuleSchema}
                        onSubmit={handleOnSubmit}>
                    {({isSubmitting, values, errors}) => {
                        return (
                            <Form method={'post'}>
                                <Modal.Body style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                                    <FormControl type={'hidden'} name={'ruleId'} value={selectedPermission.id} />
                                    <BootstrapInput label={'规则名称'} name={'ruleName'}/>
                                    {values.ruleConditions != 'USE_SQL_RULES' && <BootstrapInput label={'规则字段'} name={'ruleColumn'}/>}
                                    <BootstrapSelect name={'ruleConditions'} label={'条件规则'} options={[
                                        {label: '大于', value: '>'},
                                        {label: '小于', value: '<'},
                                        {label: '不等于', value: '<>'},
                                        {label: '等于', value: '='},
                                        {label: '大于等于', value: '>='},
                                        {label: '小于等于', value: '<='},
                                        {label: '左模糊', value: 'LEFT_LIKE'},
                                        {label: '左模糊', value: 'RIGHT_LIKE'},
                                        {label: '模糊', value: 'LIKE'},
                                        {label: '包含', value: 'IN'},
                                        {label: '自定义SQL', value: 'USE_SQL_RULES'},
                                    ]}/>
                                    <BootstrapInput label={'规则值'} name={'ruleValue'}/>
                                    <BootstrapRadioGroup options={[{label: '有效', value: '1'}, {label: '无效', value: '0'}]} name={'status'}
                                                         label={'状态'}/>
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

export default RuleEdit;