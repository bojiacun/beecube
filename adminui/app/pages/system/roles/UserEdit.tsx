import {Modal, Form, FormGroup, FormLabel, Button, Col, Row} from "react-bootstrap";
import {Field, useFormik} from "formik";
import {EditFormHelper, emptyDropdownIndicator, emptyIndicatorSeparator} from "~/utils/utils";
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

const userSchema = Yup.object().shape({
    username: Yup.string().required(),
    realname: Yup.string().required(),
});

const UserEdit = (props: any) => {
    const {model, setEditModel} = props;
    const [positionListShow, setPositionListShow] = useState<boolean>(false);
    const [departmentSelectorShow, setDepartmentSelectorShow] = useState<boolean>(false);
    const [positionOptions, setPositionOptions] = useState<any[]>([]);
    const [departmentOptions, setDepartmentOptions] = useState<any[]>([]);
    const [postValue, setPostValue] = useState<any[]>([]);
    const [departmentValue, setDepartmentValue] = useState<any[]>([]);
    const [allRoles, setAllRoles] = useState<any[]>([]);
    const [allTenants, setAllTenants] = useState<any[]>([]);
    const editFetcher = useFetcher();
    const roleFetcher = useFetcher();
    const tenantFetcher = useFetcher();


    useEffect(()=>{
        roleFetcher.load('/system/roles/all');
        tenantFetcher.load('/system/tenants');
    }, []);

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

    useEffect(() => {
        if (model?.id) {
            formik.setValues(model);
            if(_.isEmpty(model.post)) {
                setPostValue([]);
            }
        }
    }, [model]);


    const formik = useFormik({
        initialValues: {
            username: '',
            realname: '',
            workNo: '',
            phone: '',
            telephone: '',
            post: '',
            departIds: '',
            userIdentity: 1
        },
        validationSchema: userSchema,
        onSubmit: values => {
            console.log(values);
        }
    });
    const handleOnPositionSelect = (rows:any) => {
        let newOptions = rows.map((x:any)=>({label: x.name, value:x.id, key: x.id}));
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
        setPositionOptions(_.uniqBy([...departmentOptions, ...newOptions], 'key'));

        let data = {name: 'departIds', value: newOptions.map((item:any)=>item.value).join(',')};
        let e = {currentTarget: data};
        formik.handleChange(e);
        setDepartmentValue(newOptions);
        setDepartmentSelectorShow(false);
    }
    const handleOnDepartmentSelectChanged = (currentValue:any) => {
        let data = {name: 'departIds', value: currentValue.map((item:any)=>item.value).join(',')};
        let e = {currentTarget: data};
        formik.handleChange(e);
        setDepartmentValue(currentValue);
    }
    if(!model) return <></>


    return (
        <>
            <Modal
                show={!!model}
                onHide={() => setEditModel(null)}
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

                            {EditFormHelper.normalInput({
                                    label: '用户账号',
                                    placeholder: '用户账号',
                                    className: !!formik.errors.username ? 'is-invalid' : '',
                                    readOnly: model?.id,
                                    ...formik.getFieldProps('username')
                                }
                            )}
                            {EditFormHelper.normalInput({
                                    label: '用户姓名',
                                    ...formik.getFieldProps('realname'),
                                    placeholder: '用户姓名',
                                    className: !!formik.errors.realname ? 'is-invalid' : '',
                                }
                            )}
                            {EditFormHelper.normalInput({
                                    label: '工号',
                                    ...formik.getFieldProps('workNo'),
                                    placeholder: '工号',
                                    className: !!formik.errors.workNo ? 'is-invalid' : ''
                                }
                            )}
                            {EditFormHelper.normalInput({
                                    label: '手机号',
                                    ...formik.getFieldProps('phone'),
                                    placeholder: '手机号',
                                    className: !!formik.errors.phone ? 'is-invalid' : ''
                                }
                            )}
                            {EditFormHelper.normalInput({
                                    label: '座机号',
                                    ...formik.getFieldProps('telephone'),
                                    placeholder: '座机号',
                                }
                            )}
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
                            <FormGroup>
                                <FormLabel htmlFor={'selectedroles'}>角色</FormLabel>
                                <ReactSelectThemed
                                    id={'selectedroles'}
                                    name={'selectedroles'}
                                    placeholder={'选择角色'}
                                    isClearable={true}
                                    isSearchable={false}
                                    isMulti={true}
                                    options={allRoles.map((item:any)=>({label: item.roleName, value: item.id}))}
                                />
                            </FormGroup>
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
                            <FormGroup>
                                <FormLabel htmlFor={'relTenantIds'}>租户</FormLabel>
                                <ReactSelectThemed
                                    id={'relTenantIds'}
                                    name={'relTenantIds'}
                                    placeholder={'选择租户'}
                                    isClearable={true}
                                    isSearchable={false}
                                    isMulti={true}
                                    options={allTenants.map((item:any)=>({label: item.name, value: item.id}))}
                                />
                            </FormGroup>
                            <FormGroup>
                                <FormLabel htmlFor={'userIdentity'}>身份</FormLabel>
                                <Row>
                                    <Col>
                                        <Form.Check inline value={1} checked={formik.values.userIdentity == 1} name={'userIdentity'} label={'普通用户'} id={'userIdentity-1'} type={'radio'} />
                                        <Form.Check inline value={2} checked={formik.values.userIdentity == 2} name={'userIdentity'} label={'上级'} id={'userIdentity-2'} type={'radio'} />
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <FormLabel htmlFor={'departIds'}>负责部门</FormLabel>
                                <ReactSelectThemed
                                    id={'departIds'}
                                    name={'departIds'}
                                    placeholder={'选择所属部门'}
                                    isClearable={true}
                                    isSearchable={false}
                                    isMulti={true}
                                    options={departmentValue}
                                />
                            </FormGroup>
                        </Modal.Body>
                        <Modal.Footer>
                            <AwesomeButton
                                key={'submit'}
                                type={'primary'}
                                containerProps={{type: 'submit'}}
                                disabled={editFetcher.state === 'submitting'}
                            >
                                保存
                            </AwesomeButton>
                        </Modal.Footer>
                    </Form>
                }
            </Modal>
            <PositionListSelector show={positionListShow} setPositionListShow={setPositionListShow} onSelect={handleOnPositionSelect} />
            <DepartmentTreeSelector show={departmentSelectorShow} setShow={setDepartmentSelectorShow} onSelect={handleOnDepartmentSelect} />
        </>
    );
}

export default UserEdit;