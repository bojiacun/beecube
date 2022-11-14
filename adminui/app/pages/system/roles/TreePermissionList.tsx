import {Modal} from "react-bootstrap";
import {useEffect, useState} from "react";
import {useFetcher} from "@remix-run/react";
import {ChevronDown, ChevronRight} from "react-feather";
import CheckboxTree from 'react-checkbox-tree';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckSquare} from '@fortawesome/free-regular-svg-icons';

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
                icons={{
                    check: <FontAwesomeIcon className="rct-icon rct-icon-check" icon={faCheckSquare} />,
                    uncheck: <FontAwesomeIcon className="rct-icon rct-icon-uncheck" icon={['fas', 'square']} />,
                    halfCheck: <FontAwesomeIcon className="rct-icon rct-icon-half-check" icon="check-square" />,
                    expandClose: <FontAwesomeIcon className="rct-icon rct-icon-half-check" icon={faCheckSquare} />,
                    expandOpen: <FontAwesomeIcon className="rct-icon rct-icon-expand-open" icon="chevron-down" />,
                    expandAll: <FontAwesomeIcon className="rct-icon rct-icon-expand-all" icon="plus-square" />,
                    collapseAll: <FontAwesomeIcon className="rct-icon rct-icon-collapse-all" icon="minus-square" />,
                    parentClose: <FontAwesomeIcon className="rct-icon rct-icon-parent-close" icon="folder" />,
                    parentOpen: <FontAwesomeIcon className="rct-icon rct-icon-parent-open" icon="folder-open" />,
                    leaf: <FontAwesomeIcon className="rct-icon rct-icon-leaf-close" icon="file" />
                }}
            />
        </Modal>
    );
}


export default TreePermissionList;