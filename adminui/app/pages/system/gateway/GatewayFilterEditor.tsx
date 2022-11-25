import {DropdownButton, Dropdown, FormLabel, FormGroup} from "react-bootstrap";


const GatewayFilterEditor = (props:any) => {
    let {label, name, className, ...rest} = props;

    const handleOnSelect = (e) => {
        console.log(e);
    }
    return (
        <FormGroup>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <DropdownButton title={'添加过滤器'} onSelect={handleOnSelect} {...rest}>
                <Dropdown.Item eventKey={'RateLimit'}>限流过滤器</Dropdown.Item>
            </DropdownButton>
        </FormGroup>
    );
}

export default GatewayFilterEditor;