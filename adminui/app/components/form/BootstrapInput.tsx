import {FormControl, FormGroup, FormLabel} from "react-bootstrap";
import {FC} from "react";
import classNames from "classnames";
import {FormikProps} from "formik";

export interface BootstrapInputProps extends Partial<any>{
    label: string;
    name: string;
    placeholder?: string;
    formik: FormikProps<any>;
}

const BootstrapInput: FC<BootstrapInputProps> = (props) => {
    let {label, name, formik, placeholder = '', className, ...rest} = props;

    if(placeholder === '') {
        placeholder = label;
    }

    return (
        <FormGroup>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <FormControl
                id={name}
                className={classNames(className,!!formik.errors[name] ? 'is-invalid':'')}
                placeholder={placeholder}
                {...formik.getFieldProps(name)}
                {...rest}
            />
        </FormGroup>
    );
}

export default BootstrapInput;