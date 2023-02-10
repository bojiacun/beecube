import {Button, Modal, Row, Col, FormControl, Alert} from "react-bootstrap";
import {FC, useEffect, useState} from "react";
import {useFormikContext} from "formik";
import {PlusCircle} from "react-feather";
import {useTranslation} from "react-i18next";
import classNames from "classnames";

export interface UprangeConfigerProps {
    name: string;
    label: string;
}

const UprangConfiger: FC<UprangeConfigerProps> = (props) => {
    const {name, label} = props;
    const [list, setList] = useState<any[]>([]);
    const [show, setShow] = useState<boolean>(false);
    const formik = useFormikContext<any>();
    const {t} = useTranslation();

    useEffect(()=>{
        let initValue = formik.values[name];
        if(initValue) {
            setList(JSON.parse(initValue) || []);
        }
    }, []);

    const handleOnAdd = () => {
        list.push({min: 0, max: 0, price: 0});
        setList([...list]);
    }

    const handleOnSubmit = () => {
        formik.setFieldValue(name, JSON.stringify(list));
        setShow(false);
    }

    const hanldeOnItemChange = (e:any, item:any, key:string) => {
        item[key] = e.target.value;
        setList([...list]);
    }

    return (
        <>
            <Button onClick={() => setShow(true)} className={classNames((!!formik.errors[name]) ? 'is-invalid':'')}>{list.length > 0 ? '已配置':label}</Button>
            {formik.errors[name]&&<FormControl.Feedback type={'invalid'}>{t(formik.errors[name]!.toString())}</FormControl.Feedback>}
            <Modal
                show={show}
                onHide={() => setShow(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>拍品加价配置</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant={'warning'}>区间要连贯，例如0-20区间加价10元，21-30区间加价20元</Alert>
                    <Row className={'mb-1'}>
                        <Col md={4}>区间（左）</Col>
                        <Col md={4}>区间（右）</Col>
                        <Col md={4}>加价</Col>
                    </Row>
                    {list.map((item,index)=>{
                        return (
                            <Row className={'mb-1'} key={'range-'+index}>
                                <Col md={4}><FormControl value={item.min} onChange={e => hanldeOnItemChange(e, item, 'min')} /></Col>
                                <Col md={4}><FormControl value={item.max} onChange={e => hanldeOnItemChange(e, item, 'max')} /></Col>
                                <Col md={4}><FormControl value={item.price} onChange={e => hanldeOnItemChange(e, item, 'price')} /></Col>
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

export default UprangConfiger;