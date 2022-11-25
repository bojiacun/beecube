import {DropdownButton, Dropdown, FormLabel, FormGroup} from "react-bootstrap";


const GatewayPredicateEditor = (props:any) => {
    let {label, name, className, ...rest} = props;

    const handleOnSelect = (e:any) => {
        console.log(e);
    }
    return (
        <FormGroup>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <DropdownButton title={'添加路由条件'} onSelect={handleOnSelect} {...rest}>
                <Dropdown.Item eventKey={'Path'}>Path</Dropdown.Item>
                <Dropdown.Item eventKey={'Header'}>Header</Dropdown.Item>
                <Dropdown.Item eventKey={'Query'}>Query</Dropdown.Item>
                <Dropdown.Item eventKey={'Method'}>Method</Dropdown.Item>
                <Dropdown.Item eventKey={'Host'}>Host</Dropdown.Item>
                <Dropdown.Item eventKey={'Cookie'}>Cookie</Dropdown.Item>
                <Dropdown.Item eventKey={'After'}>After</Dropdown.Item>
                <Dropdown.Item eventKey={'Before'}>Before</Dropdown.Item>
                <Dropdown.Item eventKey={'Between'}>Between</Dropdown.Item>
                <Dropdown.Item eventKey={'RemoteAddr'}>RemoteAddr</Dropdown.Item>
            </DropdownButton>
        </FormGroup>
    );
}

export default GatewayPredicateEditor;