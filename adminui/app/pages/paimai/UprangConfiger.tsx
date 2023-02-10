import {Button, Modal, Row, Col, FormControl, Alert} from "react-bootstrap";
import {FC, useState} from "react";
import {useFormikContext} from "formik";
import {PlusCircle} from "react-feather";

export interface UprangeConfigerProps {
    name: string;
    label: string;
}

const UprangConfiger: FC<UprangeConfigerProps> = (props) => {
    const {name, label} = props;
    const [list, setList] = useState<any[]>([]);
    const [show, setShow] = useState<boolean>(false);
    const formik = useFormikContext<any>();

    const handleOnAdd = () => {
        list.push({min: 0, max: 0, price: 0});
        setList([...list]);
    }

    return (
        <>
            <Button onClick={() => setShow(true)}>{label}</Button>
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
                    {list.map(item=>{
                        return (
                            <Row className={'mb-1'}>
                                <Col md={4}><FormControl value={item.min} /></Col>
                                <Col md={4}><FormControl value={item.max} /></Col>
                                <Col md={4}><FormControl value={item.price} /></Col>
                            </Row>
                        );
                    })}
                    <Row className={'mt-1'}>
                        <Col style={{textAlign: 'center'}}><Button variant={'light'} onClick={handleOnAdd}> <PlusCircle size={18} className={'mr-1'} />增加一条记录</Button></Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant={'primary'}
                        type={'submit'}
                    >
                        保存
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default UprangConfiger;