import {Button, DropdownButton, Dropdown, FormLabel, FormGroup, Row, Col, Badge, FormControl} from "react-bootstrap";
import {Plus, Trash, X} from "react-feather";
import {useState} from "react";
import _ from 'lodash';
import {useFormikContext} from "formik";


const PredicatePath = (props:any) => {
    const {item, onRemove} = props;
    const [paths, setPaths] = useState<string[]>([]);
    const [showInput, setShowInput] = useState<boolean>(false);

    const handleAdd = () => {
        setShowInput(true);
    }
    const handleOnBlur = (e:any) => {
        setShowInput(false);
        setPaths(_.uniq([...paths, e.target.value]));
    }
    const handleRemove = (p:string) => {
        setPaths(paths.filter(x=>x!=p));
    }

    return (
        <fieldset title={'Path'}>
            <legend className={'text-center'}>Path <Trash size={16} onClick={()=>onRemove(item)} className={'cursor-pointer'} /></legend>
            <Row>
                {paths.map(p=>{
                    return (
                        <Col sm={2} key={p}><Badge variant={'light'}>{p} <X size={12} className={'cursor-pointer'} onClick={()=>handleRemove(p)} /> </Badge></Col>
                    );
                })}
                {showInput && <Col sm={3}><FormControl onBlur={handleOnBlur} size={'sm'} /></Col>}
                <Col sm={4}>
                    <Button size={'sm'} variant={'light'} onClick={handleAdd}><Plus size={12} />新建Path</Button>
                </Col>
            </Row>
        </fieldset>
    );
}

const GatewayPredicateEditor = (props:any) => {
    let {label, name, className, ...rest} = props;
    const formik = useFormikContext();

    const [predicates, setPredicates] = useState<any[]>([]);
    const [index, setIndex] = useState<number>(0);

    const handleOnSelect = (e:any) => {
        switch (e) {
            case 'Path':
                setPredicates([...predicates, {name: 'Path', args: {}, index: index}]);
                setIndex(index+1);
                break;
        }
        formik.setFieldValue(name, JSON.stringify(predicates));
    }
    const handleRemove = (item:any) => {
        _.remove(predicates, {index:item.index});
        setPredicates([...predicates]);
    }
    const renderPredicate = (item:any) => {
        switch (item.name) {
            case 'Path':
                return <PredicatePath key={item.name+item.index} onRemove={handleRemove} item={item} />
        }
        return <></>;
    }
    return (
        <FormGroup>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <div className={'m-1'}>
                {predicates.map((p) => {
                    return renderPredicate(p);
                })}
            </div>
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