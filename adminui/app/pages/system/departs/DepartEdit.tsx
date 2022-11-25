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



const DepartSchema = Yup.object().shape({
    departName: Yup.string().required('必填字段'),
});

const DepartEdit = (props: any) => {
    const {model, onHide, parentDepart} = props;
    const [parentDepartOptions, setParentDepartOptions] = useState<any[]>([]);
    const postFetcher = useFetcher();
    const formikRef = useRef<any>();

    useEffect(()=>{
        if(parentDepart) {
            let parentDepartOption = {label: parentDepart.departName, value: parentDepart.id};
            setParentDepartOptions([parentDepartOption]);
        }
        else {
            setParentDepartOptions([]);
        }
    }, [parentDepart]);


    const handleOnSubmit = (values: any) => {
        if(parentDepart) {
            values.parentId = parentDepart.id;
        }
        postFetcher.submit(values, {method: 'post', action: '/system/departs/add'});
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
                <Modal.Title id={'edit-user-model'}>{model?.id ? '编辑' : '新建'}部门</Modal.Title>
            </Modal.Header>
            {model &&
                <Formik innerRef={formikRef} initialValues={{status: 1,...model}} validationSchema={DepartSchema}
                        onSubmit={handleOnSubmit}>
                    {({isSubmitting, values, errors}) => {
                        return (
                            <Form method={'post'}>
                                <Modal.Body style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                                    <BootstrapInput label={'机构名称'} name={'departName'}/>
                                    {parentDepartOptions.length > 0 &&
                                        <BootstrapSelect label={'上级部门'} name={'parentId'} options={parentDepartOptions} isDisabled={true}
                                                         value={parentDepartOptions[0]}/>}
                                    <BootstrapInput label={'机构编码'} name={'orgCode'} />
                                    <BootstrapRadioGroup
                                        options={[{label: '公司', value: '1'}, {label: '部门', value: '2'}, {label: '岗位', value: '3'}]}
                                        name={'orgType'}
                                        label={'机构类型'}
                                        idPrefix={'add'}
                                    />
                                    <BootstrapInput label={'排序'} name={'departOrder'} style={{maxWidth: 200}} type={'number'}/>
                                    <BootstrapInput label={'电话'} name={'mobile'}/>
                                    <BootstrapInput label={'传真'} name={'fax'}/>
                                    <BootstrapInput label={'地址'} name={'address'}/>
                                    <BootstrapInput label={'备注'} name={'memo'} rows={3} as={'textarea'}/>
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

export default DepartEdit;