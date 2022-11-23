import {FC} from "react";
import {Col, Form, FormGroup, FormLabel, Row} from "react-bootstrap";
import {useFormikContext} from "formik";

export interface BootstrapRadioGroupProps extends Partial<any> {
    options: {label: string, value: string}[];
    name: string;
    label: string;
}

const BootstrapRadioGroup: FC<BootstrapRadioGroupProps> = (props) => {
    const {name, options, label} = props;
    const formik = useFormikContext<any>();

    return (
        <FormGroup>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <Row>
                <Col>
                    {options.map(item=>{
                        return (
                            <Form.Check key={item.value} inline value={item.value} onChange={formik.handleChange} checked={formik.values[name]==item.value} name={name} label={item.label} id={`${item.label}-${item.value}`} type={'radio'} />
                        );
                    })}
                </Col>
            </Row>
            {formik.errors[name]&&<Form.Control.Feedback type={'invalid'}>{formik.errors[name]!.toString()}</Form.Control.Feedback>}
        </FormGroup>
    );
}

export default BootstrapRadioGroup;