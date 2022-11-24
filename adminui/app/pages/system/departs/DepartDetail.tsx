import {Button, Card, Tab, Tabs} from "react-bootstrap";
import {Form, Formik} from "formik";
import {useContext, useEffect, useRef, useState} from "react";
import BootstrapInput from "~/components/form/BootstrapInput";
import BootstrapSelect from "~/components/form/BootstrapSelect";
import {defaultTreeIcons, findTree} from "~/utils/utils";
import BootstrapRadioGroup from "~/components/form/BootstrapRadioGroup";
import {Save} from "react-feather";
import CheckboxTree from "react-checkbox-tree";
import themeConfig from "../../../../themeConfig";
import {useFetcher} from "@remix-run/react";

const DepartBasicInfo = (props: any) => {
    const {model, departments} = props;
    const [parentDepartOptions, setParentDepartOptions] = useState<any[]>([]);
    const formikRef = useRef<any>();

    useEffect(() => {
        formikRef.current!.setValues(model);
        if (model.parentId) {
            let parentDepart = findTree(departments, 'id', model.parentId);
            if (parentDepart) {
                setParentDepartOptions([{label: parentDepart.departName, value: parentDepart.id}]);
            } else {
                setParentDepartOptions([]);
            }
        } else {
            setParentDepartOptions([]);
        }
    }, [model]);


    const handleOnSubmit = (values: any) => {
        console.log(values);
    }

    return (
        <Formik innerRef={formikRef} initialValues={model} onSubmit={handleOnSubmit}>
            <Form>
                <BootstrapInput label={'机构名称'} name={'departName'}/>
                {parentDepartOptions.length > 0 &&
                    <BootstrapSelect label={'上级部门'} name={'parentId'} options={parentDepartOptions} isDisabled={true}
                                     value={parentDepartOptions[0]}/>}
                <BootstrapInput label={'机构编码'} name={'orgCode'} disabled={true}/>
                <BootstrapRadioGroup options={[{label: '公司', value: '1'}, {label: '部门', value: '2'}, {label: '岗位', value: '3'}]}
                                     name={'orgType'}
                                     label={'机构类型'}/>
                <BootstrapInput label={'排序'} name={'departOrder'} style={{maxWidth: 200}} type={'number'}/>
                <BootstrapInput label={'电话'} name={'mobile'}/>
                <BootstrapInput label={'传真'} name={'fax'}/>
                <BootstrapInput label={'地址'} name={'address'}/>
                <BootstrapInput label={'备注'} name={'memo'} rows={3} as={'textarea'}/>
                <Card.Footer className={'mt-2 text-right pb-0'}>
                    <Button type={'submit'}><Save size={14} style={{marginRight: 5}}/>保存</Button>
                </Card.Footer>
            </Form>
        </Formik>
    );
}
const translateTreeToNode = (treeNode: any) => {
    return {
        value: treeNode.id,
        label: treeNode.name,
        children: treeNode.children?.map(translateTreeToNode) || null,
    };
}
const DepartPermissionTree = (props: any) => {
    const {departments, model} = props;
    const [treeData, setTreeData] = useState<any>([]);
    const [checked, setChecked] = useState<any[]>([]);
    const [expanded, setExpanded] = useState<any[]>([]);
    const searchFetcher = useFetcher();

    useEffect(() => {
        searchFetcher.load('/system/permissions');
    }, []);


    useEffect(() => {
        if (searchFetcher.type === 'done' && searchFetcher.data) {
            let nodes = searchFetcher.data.map(translateTreeToNode);
            setTreeData(nodes);
        }
    }, [searchFetcher.state]);

    return (
        <>
            <CheckboxTree
                nodes={treeData}
                checked={checked}
                expanded={expanded}
                showExpandAll={true}
                onCheck={(checked, node) => {
                    setChecked([node.value]);
                }}
                onExpand={expanded1 => setExpanded(expanded1)}
                iconsClass={'fa6'}
                noCascade={true}
                icons={defaultTreeIcons}
            />
            <Card.Footer className={'mt-2 text-right pb-0'}>
                <Button type={'submit'}><Save size={14} style={{marginRight: 5}}/>保存</Button>
            </Card.Footer>
        </>
    );
}

const DepartDetail = (props: any) => {
    const {selectedDepart, departments} = props;
    return (
        <Card>
            <Card.Body>
                <Tabs as={'ul'} defaultActiveKey={'basic-info'}>
                    <Tab title={'基本信息'} as={'li'} eventKey={'basic-info'}>
                        <DepartBasicInfo model={selectedDepart} departments={departments}/>
                    </Tab>
                    <Tab title={'部门权限'} as={'li'} eventKey={'depart-permission'}>
                        <DepartPermissionTree model={selectedDepart} departments={departments}/>
                    </Tab>
                </Tabs>
            </Card.Body>
        </Card>
    );
}

export default DepartDetail;