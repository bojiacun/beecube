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
import BootstrapRadioGroup from "~/components/form/BootstrapRadioGroup";


const checkHandlers:any = {};

const menuTypeOptions = [
    {label: '一级菜单', value: '0'},
    {label: '子菜单', value: '1'},
    {label: '按钮权限', value: '2'},
];

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
                    <Modal.Title id={'edit-user-model'}>{model?.id ? '编辑' : '新建'}菜单</Modal.Title>
                </Modal.Header>
                {model &&
                    <Form method={'post'} onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                        <Modal.Body style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                            <BootstrapRadioGroup options={menuTypeOptions} name={'menuType'} label={'菜单类型'} />
                            <BootstrapInput label={'菜单名称'} formik={formik} name={'name'} />
                            <BootstrapInput label={'访问路径'} formik={formik} name={'url'} />
                            <BootstrapInput label={'访问图标'} formik={formik} name={'icon'} />
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
        </>
    );
}

export default PermissionEdit;