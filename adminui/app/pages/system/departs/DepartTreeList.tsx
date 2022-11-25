import {Button, Card, Col, Form, FormControl, FormGroup, FormLabel, InputGroup, Row} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {useFetcher} from "@remix-run/react";
import CheckboxTree from 'react-checkbox-tree';
import {defaultTreeIcons, findTree, handleResult, handleSaveResult, PageSizeOptions, showToastSuccess, tree2List} from "~/utils/utils";
import themeConfig from "../../../../themeConfig";
//@ts-ignore
import _ from 'lodash';
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import {Plus, Search, Trash2} from "react-feather";
import DepartEdit from "~/pages/system/departs/DepartEdit";


const translateTreeToNode = (treeNode: any) => {
    return {
        value: treeNode.id,
        label: treeNode.departName,
        children: treeNode.children?.map(translateTreeToNode) || null,
    };
}

const DepartTreeList = (props: any) => {
    const {departments, setSelectedDepart, reloadDepartments} = props;
    const [treeData, setTreeData] = useState<any>([]);
    const [checked, setChecked] = useState<any[]>([]);
    const [expanded, setExpanded] = useState<any[]>([]);
    const [editModel, setEditModel] = useState<any>();
    const [parentDepart, setParentDepart] = useState<any>();
    const deleteFetcher = useFetcher();

    useEffect(() => {
        let nodes = departments.map(translateTreeToNode);
        setTreeData(nodes);
        setSelectedDepart(departments[0]);
        setChecked([departments[0].id]);
        setExpanded(departments.map((x: any) => x.id));
    }, []);


    const handleOnAdd = () => {
        setEditModel({});
    }
    const handleOnAddChild = () => {
        setParentDepart(findTree(departments, 'id', checked[0]));
        setEditModel({});
    }
    const handleOnDelete = () => {
        deleteFetcher.submit({id: checked[0]}, {method: 'delete', action: `/system/departs/delete?id=${checked[0]}`});
    }
    useEffect(() => {
        if (deleteFetcher.type === 'done' && deleteFetcher.data) {
            handleResult(deleteFetcher.data, '删除成功');
            reloadDepartments();
        }
    }, [deleteFetcher.state]);

    return (
        <>
            <Card>
                <Card.Header>
                    <Card.Title>所有部门</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Row className={'mb-1'}>
                        <Col md={6} className={'d-flex align-items-center justify-content-start mb-1 mb-md-0'}>
                            <Button className={'mr-1'} onClick={handleOnAdd}><Plus size={14} style={{marginRight: 5}}/>新增</Button>
                            <Button onClick={handleOnAddChild}><Plus size={14} style={{marginRight: 5}}/>添加下级</Button>
                        </Col>
                        <Col md={6} className={'d-flex align-items-center justify-content-end'}>
                            <Button variant={'danger'} onClick={handleOnDelete} disabled={checked.length == 0} type={'button'}><Trash2 size={14}
                                                                                                                                       style={{marginRight: 5}}/> 删除</Button>
                        </Col>
                    </Row>
                    <CheckboxTree
                        nodes={treeData}
                        checked={checked}
                        expanded={expanded}
                        showExpandAll={true}
                        onCheck={(checked, node) => {
                            setChecked([node.value]);
                            const department = findTree(departments, 'id', node.value);
                            if (department) {
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
            {editModel && <DepartEdit model={editModel} onHide={() => {
                setEditModel(null);
                reloadDepartments();
            }} parentDepart={parentDepart}/>}
        </>
    );
}


export default DepartTreeList;