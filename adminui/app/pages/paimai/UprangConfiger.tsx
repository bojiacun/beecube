import {Button, Modal} from "react-bootstrap";
import {FC, useState} from "react";
import {useFormikContext} from "formik";

export interface UprangeConfigerProps {
    name: string;
    label: string;
}

const UprangConfiger: FC<UprangeConfigerProps> = (props) => {
    const {name, label} = props;
    const [show, setShow] = useState<boolean>(false);
    const formik = useFormikContext<any>();

    return (
        <>
            <Button onClick={() => setShow(true)}>{label}</Button>
            <Modal
                show={show}
                onHide={() => setShow(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>拍品加价配置</Modal.Title>
                </Modal.Header>
            </Modal>
        </>
    );
}

export default UprangConfiger;