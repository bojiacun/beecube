import {FormControl, FormGroup, FormLabel} from "react-bootstrap";
import {FC} from "react";
import classNames from "classnames";
import {useFormikContext} from "formik";
import {useTranslation} from "react-i18next";
import DateTimePicker, {DateTimePickerProps} from "~/components/date-time-picker/DateTimePicker";

export interface BootstrapDateTimeProps extends Partial<DateTimePickerProps>{
    label: string;
    name: string;
}

const BootstrapDateTime : FC<BootstrapDateTimeProps> = (props) => {
    let {label, name, placeholder = '', className, ...rest} = props;
    const formik = useFormikContext<any>();
    const {t} = useTranslation();

    if(placeholder === '') {
        placeholder = label;
    }

    return (
        <FormGroup>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <DateTimePicker
                inputName={name}
                placeholder={placeholder}
                className={classNames(className,(!!formik.errors[name]) ? 'is-invalid':'')}
                {...rest}
            />
            {formik.errors[name]&&<FormControl.Feedback type={'invalid'} style={{display: 'block'}}>{t(formik.errors[name]!.toString())}</FormControl.Feedback>}
        </FormGroup>
    );
}

export default BootstrapDateTime;