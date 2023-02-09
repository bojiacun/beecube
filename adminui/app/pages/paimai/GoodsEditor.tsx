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
import BootstrapDateTime from "~/components/form/BootstrapDateTime";


const checkHandlers: any = {};

const GoodsEditor = (props: any) => {
    const {model, onHide, selectedRole} = props;
    const [positionListShow, setPositionListShow] = useState<boolean>(false);
    const [departmentSelectorShow, setDepartmentSelectorShow] = useState<boolean>(false);
    const [positionOptions, setPositionOptions] = useState<any[]>([]);
    const [departmentOptions, setDepartmentOptions] = useState<any[]>([]);
    const [postValue, setPostValue] = useState<any[]>([]);
    const [departmentValue, setDepartmentValue] = useState<any[]>([]);
    const [allRoles, setAllRoles] = useState<any[]>([]);
    const [allTenants, setAllTenants] = useState<any[]>([]);
    const userNameCheckFetcher = useFetcher();
    const emailNameCheckFetcher = useFetcher();
    const phoneNameCheckFetcher = useFetcher();
    const postFetcher = useFetcher();
    const roleFetcher = useFetcher();
    const userRoleFetcher = useFetcher();
    const userDepartmentFetcher = useFetcher();
    const tenantFetcher = useFetcher();
    const formikRef = useRef<any>();


    const GoodsSchema = Yup.object().shape({
        title: Yup.string().required('必填字段'),
        type: Yup.number().required('必填字段'),
        startPrice: Yup.number().required('必填字段'),
        uprange: Yup.string().required('必填字段'),
        endTime: Yup.string().required('必填字段'),
        images: Yup.string().required('必填字段'),
    });

    const handleOnSubmit = (values: any) => {
        console.log(values);
        if (values.id) {
            postFetcher.submit(values, {method: 'post', action: '/system/users/edit'});
        } else {
            values.selectedroles = selectedRole?.id;
            postFetcher.submit(values, {method: 'post', action: '/system/users/add'});
        }
    }
    useEffect(() => {
        if (model) {
            roleFetcher.load('/system/roles/all');
            tenantFetcher.load('/system/tenants/all');
            if (model.id) {
                userRoleFetcher.load(`/system/users/${model.id}/roles`);
                userDepartmentFetcher.load(`/system/users/${model.id}/departments`);
                const newModel: any = {...model, selectedroles: '', selecteddeparts: ''};
                const posts = newModel.post?.split(',');
                const postTexts = newModel.post_dictText?.split(',') || [];
                const postValueOptions: any[] = [];
                if(posts) {
                    posts.forEach((v: any, i: number) => {
                        postValueOptions.push({value: v, label: postTexts[i]??''});
                    });
                }
                setPostValue(postValueOptions);
            }
        }
    }, [model]);

    useEffect(() => {
        if (userNameCheckFetcher.type === 'done' && userNameCheckFetcher.data) {
            checkHandlers.username(userNameCheckFetcher.data.success);
        }
    }, [userNameCheckFetcher.state]);
    useEffect(() => {
        if (emailNameCheckFetcher.type === 'done' && emailNameCheckFetcher.data) {
            checkHandlers.email(emailNameCheckFetcher.data.success);
        }
    }, [emailNameCheckFetcher.state]);
    useEffect(() => {
        if (phoneNameCheckFetcher.type === 'done' && phoneNameCheckFetcher.data) {
            checkHandlers.phone(phoneNameCheckFetcher.data.success);
        }
    }, [phoneNameCheckFetcher.state]);


    useEffect(() => {
        if (userRoleFetcher.type === 'done' && userRoleFetcher.data) {
            //获取用户角色列表
            formikRef.current!.setFieldValue('selectedroles', userRoleFetcher.data.join(','));
        }
    }, [userRoleFetcher.state]);

    useEffect(() => {
        if (userDepartmentFetcher.type === 'done' && userDepartmentFetcher.data) {
            //获取用户角色列表
            formikRef.current!.setFieldValue('selecteddeparts', userDepartmentFetcher.data.map((item: any) => item.value).join(','));
            setDepartmentValue(userDepartmentFetcher.data.map((item: any) => ({label: item.title, value: item.value})));
        }
    }, [userDepartmentFetcher.state]);


    useEffect(() => {
        if (postFetcher.type === 'done' && postFetcher.data) {
            formikRef.current!.setSubmitting(false);
            handleSaveResult(postFetcher.data);
            if (postFetcher.data.success) {
                onHide(postFetcher.data.result);
            }
        }
    }, [postFetcher.state]);


    useEffect(() => {
        if (roleFetcher.type === 'done' && roleFetcher.data) {
            setAllRoles(roleFetcher.data);
        }
    }, [roleFetcher.state]);
    useEffect(() => {
        if (tenantFetcher.type === 'done' && tenantFetcher.data) {
            setAllTenants(tenantFetcher.data);
        }
    }, [tenantFetcher.state]);


    const handleOnPositionSelect = (rows: any) => {
        let newOptions = rows.map((x: any) => ({label: x.name, value: x.code, key: x.id}));
        setPositionOptions(_.uniqBy([...positionOptions, ...newOptions], 'key'));

        let data = {name: 'post', value: newOptions.map((item: any) => item.value).join(',')};
        let e = {currentTarget: data};
        formikRef.current!.handleChange(e);
        setPostValue(newOptions);
    }
    const handleOnPositionSelectChanged = (currentValue: any) => {
        let data = {name: 'post', value: currentValue.map((item: any) => item.value).join(',')};
        let e = {currentTarget: data};
        formikRef.current!.handleChange(e);
        setPostValue(currentValue);
    }
    const handleOnDepartmentSelect = (rows: any) => {
        let newOptions = rows.map((x: any) => ({label: x.label, value: x.value, key: x.value}));
        setDepartmentOptions(_.uniqBy([...departmentOptions, ...newOptions], 'key'));
        const newValue = newOptions.map((item: any) => item.value).join(',');
        formikRef.current!.setFieldValue('selecteddeparts', newValue);
        setDepartmentValue(newOptions);
        setDepartmentSelectorShow(false);
    }
    const handleOnDepartmentSelectChanged = (currentValue: any) => {
        const newValue = currentValue.map((item: any) => item.value).join(',');
        formikRef.current!.setFieldValue('selecteddeparts', newValue);
        setDepartmentValue(currentValue);
    }
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
                    <Modal.Title id={'edit-user-model'}>{model?.id ? '编辑' : '新建'}拍品</Modal.Title>
                </Modal.Header>
                {model &&
                    <Formik innerRef={formikRef} initialValues={{status: 0,type: 1, endTime: '', images: '', ...model}} validationSchema={GoodsSchema} onSubmit={handleOnSubmit}>
                        {(formik)=>{
                            return (
                                <Form method={'post'}>
                                    <Modal.Body style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                                        <BootstrapInput label={'标题'} name={'title'}/>
                                        <BootstrapInput label={'副标题'} name={'subTitle'}/>
                                        <FormGroup>
                                            <FormLabel htmlFor={'images'}>拍品图片</FormLabel>
                                            <FileBrowserInput name={'images'} type={1} multi={true} />
                                        </FormGroup>

                                        <BootstrapDateTime label={'结束时间'} name={'endTime'} showTime={true} />
                                        <BootstrapInput label={'起拍价'} name={'startPrice'} />
                                        <BootstrapInput label={'保证金'} name={'deposit'} placeholder={'保证金（元）'} />
                                        <BootstrapInput label={'延时周期'} name={'delayTime'} placeholder={'延时周期（分钟）'} />
                                        <BootstrapRadioGroup  options={[{label: '普通拍品', value: '1'},{label: '一口价', value: '2'}]} name={'type'} label={'拍品类型'} />

                                        <FormGroup>
                                            <FormLabel htmlFor={'post'}>职务</FormLabel>
                                            <Row>
                                                <Col sm={10}>
                                                    <ReactSelectThemed
                                                        id={'post'}
                                                        name={'post'}

                                                        components={{DropdownIndicator: emptyDropdownIndicator, IndicatorSeparator: emptyIndicatorSeparator}}
                                                        placeholder={'选择职务'}
                                                        isClearable={true}
                                                        isSearchable={false}
                                                        isMulti={true}
                                                        openMenuOnClick={false}
                                                        options={positionOptions}
                                                        onChange={handleOnPositionSelectChanged}
                                                        value={postValue}
                                                    />
                                                </Col>
                                                <Col sm={2}>
                                                    <Button onClick={() => setPositionListShow(true)}>选择</Button>
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                        <BootstrapSelect
                                            name={'selectedroles'}
                                            label={'角色'}
                                            options={allRoles.map((item: any) => ({label: item.roleName, value: item.id}))}
                                            placeholder={'选择角色'}
                                            isClearable={true}
                                            isSearchable={false}
                                            isMulti={true}
                                        />
                                        <BootstrapRadioGroup  options={[{label: '下架', value: '0'},{label: '上架', value: '1'}]} name={'status'} label={'状态'} />
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
            <PositionListSelector show={positionListShow} setPositionListShow={setPositionListShow} onSelect={handleOnPositionSelect}/>
            <DepartmentTreeSelector show={departmentSelectorShow} setShow={setDepartmentSelectorShow} onSelect={handleOnDepartmentSelect}/>
        </>
    );
}

export default GoodsEditor;