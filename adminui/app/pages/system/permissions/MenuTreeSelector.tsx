import {Button, Modal} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {useFetcher} from "@remix-run/react";
import CheckboxTree from 'react-checkbox-tree';
import {defaultTreeIcons, showToastSuccess, tree2List} from "~/utils/utils";
import themeConfig from "../../../../themeConfig";
//@ts-ignore
import _ from 'lodash';


const translateTreeToNode = (treeNode: any) => {
    return {
        value: treeNode.id,
        label: treeNode.name,
        children: treeNode.children?.map(translateTreeToNode) || null,
    };
}

const MenuTreeSelector = (props: any) => {
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
            searchFetcher.load('/system/permissions');
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
        let treeList = tree2List(treeData);
        onSelect(treeList.filter((t:any)=>{
            return _.indexOf(checked, t.value) >= 0;
        }));
    }

    return (
        <Modal
            show={show}
            onHide={() => setShow(false)}
            backdrop={'static'}
            aria-labelledby={'department-tree-selector'}
        >
            <Modal.Header closeButton>
                <Modal.Title id={'role-tree-permission'}>菜单选择</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{overflowY: 'auto', maxHeight: 400}}>
                <CheckboxTree
                    nodes={treeData}
                    checked={checked}
                    expanded={expanded}
                    onCheck={(checked, node)=> {
                        setChecked([node.value]);
                    }}
                    onExpand={expanded1 => setExpanded(expanded1)}
                    iconsClass={'fa6'}
                    noCascade={true}
                    icons={defaultTreeIcons}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button
                    key={'submit'}
                    variant={'primary'}
                    onClick={handleOnSave}
                >
                    确认选择
                </Button>
            </Modal.Footer>
        </Modal>
    );
}


export default MenuTreeSelector;