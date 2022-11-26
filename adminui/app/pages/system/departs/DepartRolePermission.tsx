import {Modal} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {useFetcher} from "@remix-run/react";
import CheckboxTree from 'react-checkbox-tree';
import {AwesomeButton} from "react-awesome-button";
import {defaultTreeIcons, showToastSuccess} from "~/utils/utils";
import themeConfig from "../../../../themeConfig";


const translateTreeToNode = (treeNode:any) => {
    return {
        value: treeNode.value,
        label: treeNode.slotTitle,
        children: treeNode.children?.map(translateTreeToNode) || null,
    };
}

const DepartRolePermission = (props: any) => {
    const {model, setAuthModel, department} = props;
    const {startPageLoading, stopPageLoading} = useContext(themeConfig);
    const [treeData, setTreeData] = useState<any>([]);
    const [checked, setChecked] = useState<any[]>([]);
    const [lastPermissionIds, setLastPermissionIds] = useState<any[]>([]);
    const [expanded, setExpanded] = useState<any[]>([]);
    const searchFetcher = useFetcher();
    const rolePermissionFetcher = useFetcher();
    const savePermissionFetcher = useFetcher();

    useEffect(() => {
        if (model) {
            setChecked([]);
            startPageLoading();
            searchFetcher.load('/system/roles/tree');
            rolePermissionFetcher.load('/system/departs/roles/permissions?departId='+department.id);
        }
    }, [model]);

    useEffect(() => {
        if (searchFetcher.type === 'done' && searchFetcher.data) {
            let nodes = searchFetcher.data.treeList.map(translateTreeToNode);
            setTreeData(nodes);
            rolePermissionFetcher.load('/system/departs/roles/permissions?departId='+department.id);
        }
    }, [searchFetcher.state]);

    useEffect(() => {
        if (rolePermissionFetcher.type === 'done' && rolePermissionFetcher.data) {
            stopPageLoading();
            setLastPermissionIds(rolePermissionFetcher.data);
            setChecked(rolePermissionFetcher.data);
        }
    }, [rolePermissionFetcher.state]);
    useEffect(() => {
        if (savePermissionFetcher.type === 'done' && savePermissionFetcher.data) {
            stopPageLoading();
            showToastSuccess('保存成功');
            setAuthModel(null);
        }
    }, [savePermissionFetcher.state]);

    const handleOnSave = () => {
        startPageLoading();
        let postData = {
            roleId: model.id,
            lastpermissionIds: lastPermissionIds.join(','),
            permissionIds: checked.join(',')
        };
        savePermissionFetcher.submit(postData, {method: 'post', action: '/system/departs/roles/permissions'})
    }

    return (
        <Modal
            show={!!model}
            onHide={() => setAuthModel(null)}
            size={'lg'}
            backdrop={'static'}
            aria-labelledby={'edit-modal'}
        >
            <Modal.Header closeButton>
                <Modal.Title id={'role-tree-permission'}>{model?.roleName}授权</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{overflowY: 'auto', maxHeight: 400}}>
                <div className={'mb-1'}>所拥有权限：</div>
                <CheckboxTree
                    nodes={treeData}
                    checked={checked}
                    expanded={expanded}
                    onCheck={checked1 => setChecked(checked1)}
                    onExpand={expanded1 => setExpanded(expanded1)}
                    iconsClass={'fa6'}
                    icons={defaultTreeIcons}
                />
            </Modal.Body>
            <Modal.Footer>
                <AwesomeButton
                    key={'submit'}
                    type={'primary'}
                    containerProps={{type: 'submit'}}
                    onPress={handleOnSave}
                    disabled={savePermissionFetcher.state === 'submitting'}
                >
                    保存
                </AwesomeButton>
            </Modal.Footer>
        </Modal>
    );
}


export default DepartRolePermission;