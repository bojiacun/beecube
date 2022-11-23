import {Modal, Form, FormGroup, FormLabel, Button, Col, Row} from "react-bootstrap";
import {Field, useFormik} from "formik";
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


const checkHandlers:any = {};

const PermissionEdit = (props: any) => {
    const {model, onHide} = props;
    const [positionListShow, setPositionListShow] = useState<boolean>(false);
    const [departmentSelectorShow, setDepartmentSelectorShow] = useState<boolean>(false);
    const [positionOptions, setPositionOptions] = useState<any[]>([]);
    const [departmentOptions, setDepartmentOptions] = useState<any[]>([]);
    const [postValue, setPostValue] = useState<any[]>([]);
    const [departmentValue, setDepartmentValue] = useState<any[]>([]);
    const [allRoles, setAllRoles] = useState<any[]>([]);
    const [allTenants, setAllTenants] = useState<any[]>([]);
    const [posting, setPosting] = useState<boolean>(false);
    const userNameCheckFetcher = useFetcher();
    const emailNameCheckFetcher = useFetcher();
    const phoneNameCheckFetcher = useFetcher();
    const postFetcher = useFetcher();
    const roleFetcher = useFetcher();
    const userRoleFetcher = useFetcher();
    const userDepartmentFetcher = useFetcher();
    const tenantFetcher = useFetcher();



    const PermissionSchema = Yup.object().shape({
        dictCode: Yup.string().required(),
        dictName: Yup.string().required()
    });

    const userSchema = Yup.object().shape({
        username: Yup.string().required().test('username-check', 'not avialiable', (value)=>{
            return new Promise((resolve, reject)=>{
                checkHandlers.username = resolve;
                if(model.id) {
                    userNameCheckFetcher.load(`/system/duplicate/check?tableName=sys_user&fieldName=username&fieldVal=${value}&dataId=${model.id}`);
                }
                else {
                    userNameCheckFetcher.load(`/system/duplicate/check?tableName=sys_user&fieldName=username&fieldVal=${value}`);
                }
            });
        }),
        realname: Yup.string().required(),
        phone: Yup.string().test('phone-check', 'not avialiable', (value)=>{
            return new Promise((resolve, reject)=>{
                checkHandlers.phone = resolve;
                if(model.id) {
                    phoneNameCheckFetcher.load(`/system/duplicate/check?tableName=sys_user&fieldName=phone&fieldVal=${value}&dataId=${model.id}`);
                }
                else {
                    phoneNameCheckFetcher.load(`/system/duplicate/check?tableName=sys_user&fieldName=phone&fieldVal=${value}`);
                }
            });
        }),
        email: Yup.string().test('email-check', 'not avialiable', (value)=>{
            return new Promise((resolve, reject)=>{
                checkHandlers.email = resolve;
                if(model.id) {
                    emailNameCheckFetcher.load(`/system/duplicate/check?tableName=sys_user&fieldName=email&fieldVal=${value}&dataId=${model.id}`);
                }
                else {
                    emailNameCheckFetcher.load(`/system/duplicate/check?tableName=sys_user&fieldName=email&fieldVal=${value}`);
                }
            });
        }),
    });
    const formik = useFormik({
        initialValues: {
            id: '',
            username: '',
            realname: '',
            workNo: '',
            phone: '',
            telephone: '',
            post: '',
            departIds: '',
            userIdentity: 1,
            activitiSync: 1,
            relTenantIds: ''
        },
        validationSchema: userSchema,
        onSubmit: (values:any) => {
            setPosting(true);
            console.log(values);
            if(values.id) {
                postFetcher.submit(values, {method: 'post', action: '/system/users/edit'});
            }
            else {
                postFetcher.submit(values, {method: 'post', action: '/system/users/add'});
            }
        }
    });
    useEffect(()=>{
        if(model) {
            roleFetcher.load('/system/roles/all');
            tenantFetcher.load('/system/tenants');
            if(model.id) {
                userRoleFetcher.load(`/system/users/${model.id}/roles`);
                userDepartmentFetcher.load(`/system/users/${model.id}/departments`);
                setPosting(false);
                const newModel:any = {...model, selectedroles: '', selecteddeparts: ''};
                formik.setValues(newModel);
                const posts = newModel.post.split(',');
                const postTexts = newModel.post_dictText.split(',');
                const postValueOptions:any[] = [];
                posts.forEach((v:any,i:number)=>{
                    postValueOptions.push({value: v, label: postTexts[i]});
                });
                setPostValue(postValueOptions);
            }
        }
    }, [model]);

    useEffect(()=>{
        if(userNameCheckFetcher.type === 'done' && userNameCheckFetcher.data) {
            checkHandlers.username(userNameCheckFetcher.data.success);
        }
    }, [userNameCheckFetcher.state]);
    useEffect(()=>{
        if(emailNameCheckFetcher.type === 'done' && emailNameCheckFetcher.data) {
            checkHandlers.email(emailNameCheckFetcher.data.success);
        }
    }, [emailNameCheckFetcher.state]);
    useEffect(()=>{
        if(phoneNameCheckFetcher.type === 'done' && phoneNameCheckFetcher.data) {
            checkHandlers.phone(phoneNameCheckFetcher.data.success);
        }
    }, [phoneNameCheckFetcher.state]);


    useEffect(()=>{
        if(userRoleFetcher.type === 'done' && userRoleFetcher.data) {
            //获取用户角色列表
            formik.setFieldValue('selectedroles', userRoleFetcher.data.join(','));
        }
    }, [userRoleFetcher.state]);

    useEffect(()=>{
        if(userDepartmentFetcher.type === 'done' && userDepartmentFetcher.data) {
            //获取用户角色列表
            formik.setFieldValue('selecteddeparts', userDepartmentFetcher.data.map((item:any)=>item.value).join(','));
            setDepartmentValue(userDepartmentFetcher.data.map((item:any)=>({label: item.title, value: item.value})));
        }
    }, [userDepartmentFetcher.state]);


    useEffect(()=>{
        if(postFetcher.type === 'done' && postFetcher.data) {
            setPosting(false);
            handleSaveResult(postFetcher.data);
            if(postFetcher.data.success) {
                onHide();
            }
        }
    }, [postFetcher.state]);


    useEffect(()=>{
        if(roleFetcher.type === 'done' && roleFetcher.data) {
            setAllRoles(roleFetcher.data);
        }
    }, [roleFetcher.state]);
    useEffect(()=>{
        if(tenantFetcher.type === 'done' && tenantFetcher.data) {
            setAllTenants(tenantFetcher.data);
        }
    }, [tenantFetcher.state]);




    const handleOnPositionSelect = (rows:any) => {
        let newOptions = rows.map((x:any)=>({label: x.name, value:x.code, key: x.id}));
        setPositionOptions(_.uniqBy([...positionOptions, ...newOptions], 'key'));

        let data = {name: 'post', value: newOptions.map((item:any)=>item.value).join(',')};
        let e = {currentTarget: data};
        formik.handleChange(e);
        setPostValue(newOptions);
    }
    const handleOnPositionSelectChanged = (currentValue:any) => {
        let data = {name: 'post', value: currentValue.map((item:any)=>item.value).join(',')};
        let e = {currentTarget: data};
        formik.handleChange(e);
        setPostValue(currentValue);
    }
    const handleOnDepartmentSelect = (rows:any) => {
        let newOptions = rows.map((x:any)=>({label: x.label, value:x.value, key: x.value}));
        setDepartmentOptions(_.uniqBy([...departmentOptions, ...newOptions], 'key'));
        const newValue = newOptions.map((item:any)=>item.value).join(',');
        formik.setFieldValue('selecteddeparts', newValue);
        setDepartmentValue(newOptions);
        setDepartmentSelectorShow(false);
    }
    const handleOnDepartmentSelectChanged = (currentValue:any) => {
        const newValue = currentValue.map((item:any)=>item.value).join(',');
        formik.setFieldValue('selecteddeparts', newValue);
        setDepartmentValue(currentValue);
    }
    if(!model) return <></>

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
                    <Modal.Title id={'edit-user-model'}>{model?.id ? '编辑' : '新建'}用户</Modal.Title>
                </Modal.Header>
                {model &&
                    <Form method={'post'} onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                        <Modal.Body style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                            <BootstrapInput label={'用户账号'} formik={formik} readOnly={model?.id} name={'username'} />
                            <BootstrapInput label={'用户姓名'} formik={formik} name={'realname'} />
                            <BootstrapInput label={'工号'} formik={formik} name={'workNo'} />
                            <FormGroup>
                                <FormLabel htmlFor={'post'}>职务</FormLabel>
                                <Row>
                                    <Col sm={10}>
                                        <ReactSelectThemed
                                            id={'post'}
                                            name={'post'}
                                            styles={{control: (provided:any)=>{
                                                if(formik.touched.post && formik.errors.post) {
                                                    provided.borderColor = '#ea5455';
                                                }
                                                return provided;
                                            }}}
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
                                        <Button onClick={()=>setPositionListShow(true)}>选择</Button>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <BootstrapSelect
                                name={'selectedroles'}
                                label={'角色'}
                                options={allRoles.map((item:any)=>({label: item.roleName, value: item.id}))}
                                placeholder={'选择角色'}
                                isClearable={true}
                                isSearchable={false}
                                isMulti={true}
                                formik={formik}
                            />
                            <FormGroup>
                                <FormLabel htmlFor={'selecteddeparts'}>所属部门</FormLabel>
                                <Row>
                                    <Col sm={10}>
                                        <ReactSelectThemed
                                            id={'selecteddeparts'}
                                            name={'selecteddeparts'}
                                            components={{DropdownIndicator: emptyDropdownIndicator, IndicatorSeparator: emptyIndicatorSeparator}}
                                            placeholder={'选择所属部门'}
                                            isClearable={true}
                                            isSearchable={false}
                                            isMulti={true}
                                            openMenuOnClick={false}
                                            options={departmentOptions}
                                            onChange={handleOnDepartmentSelectChanged}
                                            value={departmentValue}
                                        />
                                    </Col>
                                    <Col sm={2}>
                                        <Button onClick={()=>setDepartmentSelectorShow(true)}>选择</Button>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <BootstrapSelect
                                name={'departIds'}
                                label={'负责部门'}
                                options={departmentValue}
                                placeholder={'选择负责部门'}
                                isClearable={true}
                                isSearchable={false}
                                isMulti={true}
                                formik={formik}
                            />
                            <BootstrapSelect
                                name={'relTenantIds'}
                                label={'租户'}
                                options={allTenants.map((item:any)=>({label: item.name, value: item.id.toString()}))}
                                placeholder={'选择租户'}
                                isClearable={true}
                                isSearchable={false}
                                isMulti={true}
                                formik={formik}
                            />
                            <FormGroup>
                                <FormLabel htmlFor={'userIdentity'}>身份</FormLabel>
                                <Row>
                                    <Col>
                                        <Form.Check inline value={1} onChange={formik.handleChange} checked={formik.values.userIdentity == 1} name={'userIdentity'} label={'普通用户'} id={'userIdentity-1'} type={'radio'} />
                                        <Form.Check inline value={2} onChange={formik.handleChange} checked={formik.values.userIdentity == 2} name={'userIdentity'} label={'上级'} id={'userIdentity-2'} type={'radio'} />
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <FormLabel htmlFor={'avatar'}>头像</FormLabel>
                                <FileBrowserInput name={'avatar'} type={1} multi={false} formik={formik} />
                            </FormGroup>
                            <FormGroup>
                                <FormLabel htmlFor={'birthday'}>生日</FormLabel>
                                <DateTimePicker inputName={'birthday'} formik={formik} />
                            </FormGroup>
                            <BootstrapSelect
                                name={'sex'}
                                label={'性别'}
                                options={[{label: '男', value: '1'},{label: '女', value: '2'}]}
                                placeholder={'选择性别'}
                                isClearable={false}
                                isSearchable={false}
                                isMulti={false}
                                formik={formik}
                            />
                            <BootstrapInput label={'邮箱'} formik={formik} name={'email'} />
                            <BootstrapInput label={'手机号'} formik={formik} name={'phone'} />
                            <BootstrapInput label={'座机号'} formik={formik} name={'telephone'} />
                            <FormGroup>
                                <FormLabel htmlFor={'activitiSync'}>工作流引擎</FormLabel>
                                <Row>
                                    <Col>
                                        <Form.Check inline value={1} onChange={formik.handleChange} checked={formik.values.activitiSync == 1} name={'activitiSync'} label={'同步'} id={'activitiSync-1'} type={'radio'} />
                                        <Form.Check inline value={2} onChange={formik.handleChange} checked={formik.values.activitiSync == 2} name={'activitiSync'} label={'不同步'} id={'activitiSync-2'} type={'radio'} />
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant={'primary'}
                                disabled={posting}
                                type={'submit'}
                            >
                                保存
                            </Button>
                        </Modal.Footer>
                    </Form>
                }
            </Modal>
            <PositionListSelector show={positionListShow} setPositionListShow={setPositionListShow} onSelect={handleOnPositionSelect} />
            <DepartmentTreeSelector show={departmentSelectorShow} setShow={setDepartmentSelectorShow} onSelect={handleOnDepartmentSelect} />
        </>
    );
}

export default PermissionEdit;