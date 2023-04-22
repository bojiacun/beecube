import {Modal, FormGroup, FormLabel, Button, Col, Row} from "react-bootstrap";
import {Form, Formik} from "formik";
import {emptyDropdownIndicator, emptyIndicatorSeparator, handleSaveResult, showToastError} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import * as Yup from "yup";
import {useEffect, useRef, useState} from "react";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import PositionListSelector from "~/pages/system/roles/PositionListSelector";
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

const AppEdit = (props: any) => {
    const {model, onHide} = props;
    const [modules, setModules] = useState<any[]>([]);
    const postFetcher = useFetcher();
    const modulesFetcher = useFetcher();
    const formikRef = useRef<any>();


    const appSchema = Yup.object().shape({
        name: Yup.string().required('必填字段'),
        moduleId: Yup.string().required('必要字段')
    });

    const handleOnSubmit = (values: any) => {
        if (values.id) {
            postFetcher.submit(values, {method: 'post', action: '/app/edit'});
        } else {
            postFetcher.submit(values, {method: 'post', action: '/app/add'});
        }
    }
    useEffect(() => {
        if (model) {
            modulesFetcher.load('/app/modules/all');
        }
    }, [model]);


    useEffect(() => {
        if (postFetcher.type === 'done' && postFetcher.data) {
            formikRef.current!.setSubmitting(false);
            handleSaveResult(postFetcher.data);
            if (postFetcher.data.success) {
                onHide();
            }
        }
    }, [postFetcher.state]);

    useEffect(() => {
        if (modulesFetcher.type === 'done' && modulesFetcher.data) {
            setModules(modulesFetcher.data);
        }
    }, [modulesFetcher.state]);



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
                    <Modal.Title id={'edit-user-model'}>{model?.id ? '编辑' : '新建'}应用</Modal.Title>
                </Modal.Header>
                {model &&
                    <Formik innerRef={formikRef} initialValues={{selectedroles: '', selecteddeparts: '', ...model}} validationSchema={appSchema} onSubmit={handleOnSubmit}>
                        {(formik)=>{
                            return (
                                <Form method={'post'}>
                                    <Modal.Body style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                                        <BootstrapInput label={'应用名称'} readOnly={model?.id} name={'name'}/>
                                        <FormGroup>
                                            <FormLabel htmlFor={'logo'}>LOGO</FormLabel>
                                            <FileBrowserInput name={'logo'} type={1} multi={false} />
                                        </FormGroup>
                                        <BootstrapSelect
                                            name={'moduleId'}
                                            label={'绑定模块'}
                                            options={modules.map((item: any) => ({label: item.name, value: item.id.toString()}))}
                                            placeholder={'选择模块'}
                                            isClearable={false}
                                            isSearchable={false}
                                            isMulti={false}
                                            isDisabled={model?.id}
                                        />
                                        <FormGroup>
                                            <FormLabel htmlFor={'endTime'}>过期日期</FormLabel>
                                            <DateTimePicker inputName={'endTime'} />
                                        </FormGroup>
                                        <BootstrapInput label={'最大直播用户'}  name={'maxRoomUserCount'} />
                                        <BootstrapInput label={'备注'} name={'description'} rows={3} as={'textarea'} />
                                        <BootstrapRadioGroup  options={[{label: '正常', value: '1'},{label: '禁用', value: '0'}]} name={'status'} label={'状态'} />
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

export default AppEdit;