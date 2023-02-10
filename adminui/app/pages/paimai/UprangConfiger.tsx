import {Modal} from "react-bootstrap";
import {FC} from "react";

export interface UprangeConfigerProps {
    show: boolean;
    onHide: Function;
}

const UprangConfiger: FC<UprangeConfigerProps> = (props) => {
    const {show, onHide} = props;
    return (
        <Modal
            show={show}
            onHide={onHide}
        >

        </Modal>
    );
}

export default UprangConfiger;