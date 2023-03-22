import {FormControl, FormGroup, FormLabel} from "react-bootstrap";
import {FC} from "react";
import classNames from "classnames";
import {useFormikContext} from "formik";
import {useTranslation} from "react-i18next";

export interface BootstrapInputProps extends Partial<any>{
    label: string;
    name: string;
    placeholder?: string;
}

const BootstrapInput: FC<BootstrapInputProps> = (props) => {
    let {label, name, placeholder = '', className, ...rest} = props;
    const formik = useFormikContext<any>();
    const {t} = useTranslation();

    if(placeholder === '') {
        placeholder = label;
    }


    return (
        <FormGroup>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <FormControl
                id={name}
                className={classNames(className,(!!formik.errors[name]) ? 'is-invalid':'')}
                placeholder={placeholder}
                {...formik.getFieldProps(name)}
                {...rest}
            />

            {formik.errors[name]&&<FormControl.Feedback type={'invalid'}>{t(formik.errors[name]!.toString())}</FormControl.Feedback>}
        </FormGroup>
    );
}

export default BootstrapInput;