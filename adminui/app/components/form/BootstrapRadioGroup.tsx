import {FC} from "react";
import {Col, Form, FormGroup, FormLabel, Row} from "react-bootstrap";
import {useFormikContext} from "formik";
import {useTranslation} from "react-i18next";

export interface BootstrapRadioGroupProps extends Partial<any> {
    options: {label: string, value: string}[];
    name: string;
    label: string;
}

const BootstrapRadioGroup: FC<BootstrapRadioGroupProps> = (props) => {
    const {name, options, label} = props;
    const formik = useFormikContext<any>();
    const {t} = useTranslation();

    return (
        <FormGroup className={'mb-1'}>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <Row>
                <Col>
                    {options.map(item=>{
                        return (
                            <Form.Check
                                key={name +'-'+item.value}
                                inline
                                value={item.value.toString()}
                                onChange={formik.handleChange}
                                checked={formik.values[name]==item.value.toString()}
                                name={name}
                                label={item.label}
                                id={`${name}-${item.value}`}
                                type={'radio'}
                            />
                        );
                    })}
                </Col>
            </Row>
            {formik.errors[name]&&<Form.Control.Feedback type={'invalid'}>{t(formik.errors[name]!.toString())}</Form.Control.Feedback>}
        </FormGroup>
    );
}

export default BootstrapRadioGroup;