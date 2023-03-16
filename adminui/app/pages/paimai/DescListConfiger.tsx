import {Button, Modal, Row, Col, FormControl, Alert} from "react-bootstrap";
import {FC, useEffect, useState} from "react";
import {useFormikContext} from "formik";
import {PlusCircle} from "react-feather";
import {useTranslation} from "react-i18next";
import classNames from "classnames";

export interface DescListConfigerProps {
    name: string;
    label: string;
}

const DescListConfiger : FC<DescListConfigerProps> = (props) => {
    const {name, label} = props;
    const [list, setList] = useState<any[]>([]);
    const [show, setShow] = useState<boolean>(false);
    const formik = useFormikContext<any>();
    const {t} = useTranslation();

    useEffect(()=>{
        let initValue = formik.values[name];
        console.log(initValue);
        if(initValue) {
            setList(JSON.parse(initValue) || []);
        }
    }, []);

    const handleOnAdd = () => {
        list.push({key: '', value: ''});
        setList([...list]);
    }

    const handleOnSubmit = () => {
        formik.setFieldValue(name, JSON.stringify(list));
        setShow(false);
    }

    const handleOnItemChange = (e:any, item:any, key:string) => {
        item[key] = e.target.value;
        setList([...list]);
    }

    return (
        <>
            <Button onClick={() => setShow(true)} variant={'light'} className={classNames((!!formik.errors[name]) ? 'is-invalid':'')}>{list.length > 0 ? '已配置':label}</Button>
            {formik.errors[name]&&<FormControl.Feedback type={'invalid'}>{t(formik.errors[name]!.toString())}</FormControl.Feedback>}
            <Modal
                show={show}
                onHide={() => setShow(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>拍品字段描述</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant={'warning'}>字段描述，可添加多个，例如：颜色=蓝色</Alert>
                    <Row className={'mb-1'}>
                        <Col md={4}>标题</Col>
                        <Col md={8}>内容</Col>
                    </Row>
                    {list.map((item,index)=>{
                        return (
                            <Row className={'mb-1'} key={'range-'+index}>
                                <Col md={4}><FormControl value={item.key} onChange={e => handleOnItemChange(e, item, 'key')} /></Col>
                                <Col md={8}><FormControl value={item.value} onChange={e => handleOnItemChange(e, item, 'value')} /></Col>
                            </Row>
                        );
                    })}
                    <Row className={'mt-1'}>
                        <Col style={{textAlign: 'center'}}><Button variant={'light'} onClick={handleOnAdd}> <PlusCircle size={18} className={'mr-1'} />增加一条记录</Button></Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={'primary'} onClick={handleOnSubmit}>
                        保存
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default DescListConfiger;