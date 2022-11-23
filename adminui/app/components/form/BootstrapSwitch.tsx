import {FC} from "react";
import {Form, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import {useFormikContext} from "formik";
import {useTranslation} from "react-i18next";

export interface BootstrapSwitchProps extends Partial<any>{
    label: string;
    name: string;
}

const BootstrapSwitch: FC<BootstrapSwitchProps> = (props) => {
    let {label, name, className, ...rest} = props;
    const formik = useFormikContext<any>();
    const {t} = useTranslation();

    const toggleChange = () => {
        if(formik.values[name]) {
            formik.setFieldValue(name, false);
        }
        else {
            formik.setFieldValue(name, true);
        }
    }

    return (
        <FormGroup>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <Form.Switch name={name} checked={formik.values[name]} onClick={toggleChange} {...rest} />
        </FormGroup>
    );
}

export default BootstrapSwitch;