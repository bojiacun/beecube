import {Button, Card, Col, Form, FormControl, FormGroup, FormLabel, InputGroup, Row} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {useFetcher} from "@remix-run/react";
import CheckboxTree from 'react-checkbox-tree';
import {defaultTreeIcons, findTree, PageSizeOptions, showToastSuccess, tree2List} from "~/utils/utils";
import themeConfig from "../../../../themeConfig";
//@ts-ignore
import _ from 'lodash';
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import {Plus, Search, Trash2} from "react-feather";


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


    const handleOnAdd = () => {

    }
    const handleOnAddChild = () => {

    }

    return (
        <Card>
            <Card.Header>
                <Card.Title>所有部门</Card.Title>
            </Card.Header>
            <div className={'m-2'}>
                <Row>
                    <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                        <Button className={'mr-1'} onClick={handleOnAdd}><Plus size={14} style={{marginRight: 5}} />新增</Button>
                        <Button onClick={handleOnAddChild}><Plus size={14} style={{marginRight: 5}} />添加下级</Button>
                    </Col>
                    <Col md={6} className={'d-flex align-items-center justify-content-end'}>
                        <Button variant={'danger'} disabled={checked.length == 0} type={'button'}><Trash2 size={14} style={{marginRight: 5}} /> 删除</Button>
                    </Col>
                </Row>
            </div>
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