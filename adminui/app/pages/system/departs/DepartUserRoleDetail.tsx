import {Button, Card, Tab, Table, Tabs} from "react-bootstrap";
import {Form, Formik} from "formik";
import {useContext, useEffect, useRef, useState} from "react";
import BootstrapInput from "~/components/form/BootstrapInput";
import BootstrapSelect from "~/components/form/BootstrapSelect";
import {defaultTreeIcons, findTree, handleSaveResult} from "~/utils/utils";
import BootstrapRadioGroup from "~/components/form/BootstrapRadioGroup";
import {Save} from "react-feather";
import CheckboxTree from "react-checkbox-tree";
import {useFetcher} from "@remix-run/react";
import * as Yup from "yup";
import DepartUserList from "~/pages/system/departs/DepartUserList";

const OrgTypes = [{label: '公司', value: '1'}, {label: '部门', value: '2'}, {label: '岗位', value: '3'}];

const DepartBasicInfo = (props: any) => {
    const {model, departments} = props;
    const [parentDepart, setParentDepart] = useState<any>();

    useEffect(() => {
        if (model.parentId) {
            let parentDepart = findTree(departments, 'id', model.parentId);
            setParentDepart(parentDepart);
        } else {
            setParentDepart(null);
        }
    }, [model]);



    return (
        <Table bordered>
            <tbody>
            <tr>
                <td style={{backgroundColor: '#fafafa'}} width={150}>机构名称</td>
                <td>{model.departName}</td>
            </tr>
            {parentDepart && <tr>
                <td style={{backgroundColor: '#fafafa'}}>上级部门</td>
                <td>{parentDepart.departName}</td>
            </tr>
            }
            <tr>
                <td style={{backgroundColor: '#fafafa'}}>机构编码</td>
                <td>{model.orgCode}</td>
            </tr>
            <tr>
                <td style={{backgroundColor: '#fafafa'}}>机构类型</td>
                <td>{OrgTypes[model.orgType-1].label}</td>
            </tr>
            <tr>
                <td style={{backgroundColor: '#fafafa'}}>排序</td>
                <td>{model.departOrder}</td>
            </tr>
            <tr>
                <td style={{backgroundColor: '#fafafa'}}>手机号</td>
                <td>{model.mobile}</td>
            </tr>
            <tr>
                <td style={{backgroundColor: '#fafafa'}}>地址</td>
                <td>{model.address}</td>
            </tr>
            <tr>
                <td style={{backgroundColor: '#fafafa'}}>备注</td>
                <td>{model.memo}</td>
            </tr>
            </tbody>
        </Table>
    );
}
const translateTreeToNode = (treeNode: any) => {
    return {
        value: treeNode.id,
        label: treeNode.name,
        children: treeNode.children?.map(translateTreeToNode) || null,
    };
}


const DepartUserRoleDetail = (props: any) => {
    const {selectedDepart, departments, ...rest} = props;
    return (
        <Card>
            <Card.Body>
                <Tabs as={'ul'} defaultActiveKey={'basic-info'}>
                    <Tab title={'基本信息'} as={'li'} eventKey={'basic-info'}>
                        <DepartBasicInfo model={selectedDepart} departments={departments} {...rest} />
                    </Tab>
                    <Tab title={'用户信息'} as={'li'} eventKey={'user-list'}>
                        <DepartUserList model={selectedDepart} departments={departments} />
                    </Tab>
                </Tabs>
            </Card.Body>
        </Card>
    );
}

export default DepartUserRoleDetail;