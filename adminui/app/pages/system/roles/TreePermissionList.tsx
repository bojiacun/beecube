import {Modal} from "react-bootstrap";
import {useEffect, useState} from "react";
import {useFetcher} from "@remix-run/react";
import {ChevronDown, ChevronRight} from "react-feather";
import CheckboxTree from 'react-checkbox-tree';

const nodes = [{
    value: 'mars',
    label: 'Mars',
    children: [
        { value: 'phobos', label: 'Phobos' },
        { value: 'deimos', label: 'Deimos' },
    ],
}];
const TreePermissionList = (props:any) => {
    const {model, setAuthModel} = props;
    const [treeData, setTreeData] = useState<any>();
    const searchFetcher = useFetcher();

    useEffect(()=>{
        if(model) {
            searchFetcher.load('/system/roles/tree');
        }
    }, [model]);

    useEffect(()=>{
        if(searchFetcher.type === 'done' && searchFetcher.data) {
            setTreeData(searchFetcher.data.treeList);
        }
    }, [searchFetcher.state]);


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
            <CheckboxTree
                nodes={nodes}
            />
        </Modal>
    );
}


export default TreePermissionList;