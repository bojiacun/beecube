import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import {useField} from "formik";
import classNames from "classnames";


const FormikSelect = (props:any) => {
    const {className, ...rest} = props;
    const [field, meta] = useField(rest);
    return (
        <ReactSelectThemed
            className={classNames('form-control', meta.touched && meta.error ? 'is-invalid':'')}
            {...rest}
        />
    );
}

export default FormikSelect;