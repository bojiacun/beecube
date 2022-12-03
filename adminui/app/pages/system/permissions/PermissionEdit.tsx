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
import MenuTreeSelector from "~/pages/system/permissions/MenuTreeSelector";
import BootstrapSwitch from "~/components/form/BootstrapSwitch";


const checkHandlers: any = {};

const menuTypeOptions = [
    {label: '一级菜单', value: '0'},
    {label: '子菜单', value: '1'},
    {label: '按钮权限', value: '2'},
];

function findRecyle(items:any[], key:string, value:any):any{
    let result = null;
    for(let i = 0; i < items.length;i++){
        let item = items[i];
        if(item[key] == value) {
            result = item;
            break;
        }
        else if(item.children) {
            result = findRecyle(item.children, key, value);
            if(result != null) {
                break;
            }
        }
    }
    return result;
}

const PermissionEdit = (props: any) => {
    const {model, onHide, menus} = props;
    const [parentOptions, setParentOptions] = useState<any[]>([]);
    const [menuSelectorShow, setMenuSelectorShow] = useState<boolean>(false);
    const [parentValue, setParentValue] = useState<any>();
    const postFetcher = useFetcher();
    const formikRef = useRef<any>();
    const nameCheckFetcher = useFetcher();

    useEffect(() => {
        if (model) {
            if (model.parentId) {
                const menu:any = findRecyle(menus, 'id', model.parentId);
                if(menu != null) {
                    const opt = {label: menu.name, value: menu.id, key: menu.id};
                    setParentOptions([opt]);
                    setParentValue(opt);
                }
            }
        }
    }, [model]);
    const permissionSchemaShape:any = {name: Yup.string().required('必填字段')};

    if(model.menuType < 2 ) {
        permissionSchemaShape.url = Yup.string().required('必填字段').test('name-duplicate', 'not avialiable', (value)=>{
            return new Promise((resolve, reject) => {
                checkHandlers.url = resolve;
                if (model.id) {
                    nameCheckFetcher.load(`/system/permissions/check?id=${model.id}&url=${value}&alwaysShow=${model.alwaysShow}`);
                } else {
                    nameCheckFetcher.load(`/system/permissions/check?url=${value}&alwaysShow=true`);
                }
            });
        });
    }

    const PermissionSchema = Yup.object().shape(permissionSchemaShape);

    useEffect(() => {
        if (nameCheckFetcher.type === 'done' && nameCheckFetcher.data) {
            checkHandlers.url(nameCheckFetcher.data.success);
        }
    }, [nameCheckFetcher.state]);
    const handleOnParentMenuSelected = (rows: any) => {
        let newOptions = rows.map((x: any) => ({label: x.label, value: x.value, key: x.value}));
        setParentOptions(_.uniqBy([...parentOptions, ...newOptions], 'key'));
        const newValue = newOptions.map((item: any) => item.value).join(',');
        formikRef.current!.setFieldValue('parentId', newValue);
        setParentValue(newOptions);
        setMenuSelectorShow(false);
    }
    const handleOnParentSelectChanged = (currentValue: any) => {
        setParentValue(currentValue);
        formikRef.current!.setFieldValue('parentId', currentValue);
    }

    const handleOnSubmit = (values:any)=>{
        console.log(values);
        if (values.id) {
            postFetcher.submit(values, {method: 'post', action: '/system/permissions/edit'});
        } else {
            postFetcher.submit(values, {method: 'post', action: '/system/permissions/add'});
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
                    <Formik innerRef={formikRef} initialValues={{menuType: 0, status: 1, ...model}} validationSchema={PermissionSchema} onSubmit={handleOnSubmit}>
                        {({isSubmitting,values,errors})=>{
                            return (
                                <Form method={'post'}>
                                    <Modal.Body style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                                        <BootstrapRadioGroup disabled={model.id} options={menuTypeOptions} name={'menuType'} label={'菜单类型'}/>
                                        <BootstrapInput label={values.menuType < 2 ? '菜单名称': '按钮权限'} name={'name'} />
                                        {values.menuType > 0 &&
                                        <FormGroup>
                                            <FormLabel htmlFor={'selecteddeparts'}>上级菜单</FormLabel>
                                            <Row>
                                                <Col sm={8}>
                                                    <ReactSelectThemed
                                                        id={'parentId'}
                                                        name={'parentId'}
                                                        styles={{
                                                            control: (provided: any) => {
                                                                if (errors.parentId) {
                                                                    provided.borderColor = '#ea5455';
                                                                }
                                                                return provided;
                                                            }
                                                        }}
                                                        components={{DropdownIndicator: emptyDropdownIndicator, IndicatorSeparator: emptyIndicatorSeparator}}
                                                        placeholder={'选择上级菜单'}
                                                        isClearable={true}
                                                        isSearchable={false}
                                                        isMulti={false}
                                                        openMenuOnClick={false}
                                                        options={parentOptions}
                                                        onChange={handleOnParentSelectChanged}
                                                        value={parentValue}
                                                    />
                                                </Col>
                                                <Col sm={4}>
                                                    <Button onClick={() => setMenuSelectorShow(true)}>选择</Button>
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                        }
                                        {values.menuType == 2 && <BootstrapInput label={'授权标识'} name={'perms'} />}
                                        {values.menuType == 2 && <BootstrapRadioGroup options={[{label: '可见/可访问', value: '1'},{label: '可编辑', value: '2'}]} name={'permsType'} label={'授权策略'}/>}
                                        {values.menuType < 2 && <BootstrapInput label={'访问路径'} name={'url'} />}
                                        {values.menuType < 2 && <BootstrapInput label={'数据标识'} name={'component'} />}
                                        {values.menuType < 2 && <BootstrapInput label={'访问图标'} name={'icon'} />}
                                        {values.menuType < 2 && <BootstrapInput label={'排序'} name={'sortNo'} style={{maxWidth: 200}} type={'number'} />}
                                        {values.menuType < 2 && <BootstrapSwitch label={'是否路由菜单'} name={'route'} />}
                                        {values.menuType < 2 && <BootstrapSwitch label={'隐藏路由'} name={'hidden'} />}
                                        {values.menuType < 2 && <BootstrapSwitch label={'外部链接'} name={'internalOrExternal'} valueType={2} />}
                                        <BootstrapRadioGroup options={[{label: '有效', value: '1'},{label: '无效', value: '0'}]} name={'status'} label={'状态'}/>
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
            <MenuTreeSelector show={menuSelectorShow} setShow={setMenuSelectorShow} onSelect={handleOnParentMenuSelected} />
        </>
    );
}

export default PermissionEdit;