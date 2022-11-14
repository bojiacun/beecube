import {Modal} from "react-bootstrap";
import Tree from "rc-tree";
import {useEffect, useState} from "react";
import {useFetcher} from "@remix-run/react";


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
            <Tree
                treeData={treeData}
            />
        </Modal>
    );
}


export default TreePermissionList;