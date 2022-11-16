import {Modal} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {useFetcher} from "@remix-run/react";
import CheckboxTree from 'react-checkbox-tree';
import {AwesomeButton} from "react-awesome-button";
import {defaultTreeIcons, showToastSuccess} from "~/utils/utils";
import themeConfig from "../../../../themeConfig";


const translateTreeToNode = (treeNode: any) => {
    return {
        value: treeNode.id,
        label: treeNode.departName,
        children: treeNode.children?.map(translateTreeToNode) || null,
    };
}

const DepartmentTreeSelector = (props: any) => {
    const {show, setShow, onSelect} = props;
    const {startPageLoading, stopPageLoading} = useContext(themeConfig);
    const [treeData, setTreeData] = useState<any>([]);
    const [checked, setChecked] = useState<any[]>([]);
    const [expanded, setExpanded] = useState<any[]>([]);
    const searchFetcher = useFetcher();

    useEffect(() => {
        if(show) {
            setChecked([]);
            startPageLoading();
            searchFetcher.load('/system/departments?primaryKey=key');
        }
    }, [show]);

    useEffect(() => {
        if (searchFetcher.type === 'done' && searchFetcher.data) {
            stopPageLoading();
            let nodes = searchFetcher.data.map(translateTreeToNode);
            setTreeData(nodes);
        }
    }, [searchFetcher.state]);

    const handleOnSave = () => {
        onSelect(checked);
    }

    return (
        <Modal
            show={show}
            onHide={() => setShow(false)}
            backdrop={'static'}
            aria-labelledby={'department-tree-selector'}
        >
            <Modal.Header closeButton>
                <Modal.Title id={'role-tree-permission'}>部门选择</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{overflowY: 'auto', maxHeight: 400}}>
                <CheckboxTree
                    nodes={treeData}
                    checked={checked}
                    expanded={expanded}
                    onCheck={checked1 => setChecked(checked1)}
                    onExpand={expanded1 => setExpanded(expanded1)}
                    iconsClass={'fa6'}
                    noCascade={true}
                    icons={defaultTreeIcons}
                />
            </Modal.Body>
            <Modal.Footer>
                <AwesomeButton
                    key={'submit'}
                    type={'primary'}
                    containerProps={{type: 'submit'}}
                    onPress={handleOnSave}
                >
                    保存
                </AwesomeButton>
            </Modal.Footer>
        </Modal>
    );
}


export default DepartmentTreeSelector;