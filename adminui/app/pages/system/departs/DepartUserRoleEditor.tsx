import {Modal} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {useFetcher} from "@remix-run/react";
import CheckboxTree from 'react-checkbox-tree';
import {AwesomeButton} from "react-awesome-button";
import {defaultTreeIcons, showToastSuccess} from "~/utils/utils";
import themeConfig from "../../../../themeConfig";


const translateTreeToNode = (treeNode:any) => {
    return {
        value: treeNode.id,
        label: treeNode.roleName,
        children: treeNode.children?.map(translateTreeToNode) || null,
    };
}

const DepartUserRoleEditor = (props: any) => {
    const {model, setAuthModel, department} = props;
    const {startPageLoading, stopPageLoading} = useContext(themeConfig);
    const [treeData, setTreeData] = useState<any>([]);
    const [checked, setChecked] = useState<any[]>([]);
    const [lastPermissionIds, setLastPermissionIds] = useState<any[]>([]);
    const [expanded, setExpanded] = useState<any[]>([]);
    const rolePermissionFetcher = useFetcher();
    const userRolesFetcher = useFetcher();
    const savePermissionFetcher = useFetcher();

    useEffect(() => {
        if (model) {
            setChecked([]);
            startPageLoading();
            rolePermissionFetcher.load(`/system/departs/roles/all?departId=${department.id}&userId=${model.id}`);
        }
    }, [model]);

    useEffect(() => {
        if (rolePermissionFetcher.type === 'done' && rolePermissionFetcher.data) {
            if(rolePermissionFetcher.data) {
                let nodes = rolePermissionFetcher.data.map(translateTreeToNode);
                setTreeData(nodes);
            }
            userRolesFetcher.load(`/system/departs/roles/users?departId=${department.id}&userId=${model.id}`);
        }
    }, [rolePermissionFetcher.state]);

    useEffect(()=>{
        stopPageLoading();
        if (userRolesFetcher.type === 'done' && userRolesFetcher.data) {
            setLastPermissionIds(userRolesFetcher.data);
            setChecked(userRolesFetcher.data);
        }
    }, [userRolesFetcher.state]);


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
            userId: model.id,
            oldRoleId: lastPermissionIds.join(','),
            newRoleId: checked.join(',')
        };
        savePermissionFetcher.submit(postData, {method: 'post', action: '/system/departs/roles/users/add'})
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
                <Modal.Title id={'role-tree-permission'}>{model?.username}的部门角色</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{overflowY: 'auto', maxHeight: 400}}>
                <div className={'mb-1'}>所属于角色：</div>
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


export default DepartUserRoleEditor;