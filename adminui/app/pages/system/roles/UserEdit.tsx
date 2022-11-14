import {Modal} from "react-bootstrap";


const UserEdit = (props:any) => {
    const {model, setEditModel} = props;
    return (
        <Modal
            show={!!model}
            onHide={() => setEditModel(null)}
            centered
            backdrop={'static'}
            aria-labelledby={'edit-modal'}
        >

        </Modal>
    );
}

export default UserEdit;