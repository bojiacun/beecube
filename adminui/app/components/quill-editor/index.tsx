import ReactQuill from "react-quill";
import {FC} from "react";


const QuillEditor:FC<any> = (props) => {
    const {value, onChange} = props;

    return (
        <ReactQuill value={value} onChange={onChange} />
    );
}

export default QuillEditor;
