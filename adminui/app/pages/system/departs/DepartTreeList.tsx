import {Card} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {useFetcher} from "@remix-run/react";
import CheckboxTree from 'react-checkbox-tree';
import {defaultTreeIcons, findTree, showToastSuccess, tree2List} from "~/utils/utils";
import themeConfig from "../../../../themeConfig";
//@ts-ignore
import _ from 'lodash';


const translateTreeToNode = (treeNode: any) => {
    return {
        value: treeNode.id,
        label: treeNode.departName,
        children: treeNode.children?.map(translateTreeToNode) || null,
    };
}

const DepartTreeList = (props: any) => {
    const {departments, setSelectedDepart} = props;
    const [treeData, setTreeData] = useState<any>([]);
    const [checked, setChecked] = useState<any[]>([]);
    const [expanded, setExpanded] = useState<any[]>([]);
    const searchFetcher = useFetcher();

    useEffect(()=>{
        let nodes = departments.map(translateTreeToNode);
        setTreeData(nodes);
        setSelectedDepart(departments[0]);
        setChecked([departments[0].id]);
        setExpanded(departments.map((x:any)=>x.id));
    }, []);


    return (
        <Card>
            <Card.Header>
                <Card.Title>所有部门</Card.Title>
            </Card.Header>
            <Card.Body>
                <CheckboxTree
                    nodes={treeData}
                    checked={checked}
                    expanded={expanded}
                    showExpandAll={true}
                    onCheck={(checked, node)=> {
                        setChecked([node.value]);
                        const department = findTree(departments, 'id', node.value);
                        if(department) {
                            setSelectedDepart(department);
                        }
                    }}
                    onExpand={expanded1 => setExpanded(expanded1)}
                    iconsClass={'fa6'}
                    noCascade={true}
                    icons={defaultTreeIcons}
                />
            </Card.Body>
        </Card>
    );
}


export default DepartTreeList;