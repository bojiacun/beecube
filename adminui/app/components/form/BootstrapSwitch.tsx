import {FC} from "react";
import {Form, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import {useFormikContext} from "formik";
import {useTranslation} from "react-i18next";

export interface BootstrapSwitchProps extends Partial<any>{
    label: string;
    name: string;
    valueType?: number;
}

const BootstrapSwitch: FC<BootstrapSwitchProps> = (props) => {
    let {label, name, className, valueType = 1, ...rest} = props;
    const formik = useFormikContext<any>();
    const {t} = useTranslation();

    const handleOnChange = (e:any) => {
        if(valueType == 1) {
            formik.setFieldValue(name, e.target.checked? 1:0);
        }
        else {
            formik.setFieldValue(name, !!e.target.checked);
        }
    }

    return (
        <FormGroup>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <Form.Switch id={name} name={name} checked={formik.values[name]} onChange={handleOnChange} {...rest} />
        </FormGroup>
    );
}

export default BootstrapSwitch;