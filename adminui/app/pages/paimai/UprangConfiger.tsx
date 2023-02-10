import {Modal} from "react-bootstrap";
import {FC} from "react";

export interface UprangeConfigerProps {
    show: boolean;
    onHide: ()=>void;
}

const UprangConfiger: FC<UprangeConfigerProps> = (props) => {
    const {show, onHide} = props;
    return (
        <Modal
            show={show}
            onHide={onHide}
        >
            <Modal.Header closeButton>
                <Modal.Title>拍品加价配置</Modal.Title>
            </Modal.Header>
        </Modal>
    );
}

export default UprangConfiger;