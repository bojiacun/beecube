import {Button, DropdownButton, Dropdown, FormLabel, FormGroup, Row, Col, Badge, FormControl, Form} from "react-bootstrap";
import {Plus, Trash, X} from "react-feather";
import {useState} from "react";
import _ from 'lodash';
import {useFormikContext} from "formik";

const PredicateQuery = (props: any) => {
    const {item, onRemove, onUpdate} = props;

    const handleNameChanged = (e: any) => {
        item.args.param = e.target.value;
        onUpdate();
    }
    const handleValueChanged = (e: any) => {
        item.args.regexp = e.target.value;
        onUpdate();
    }

    return (
        <fieldset title={'Path'}>
            <legend className={'text-center'}>Query <Trash size={16} onClick={() => onRemove(item)} className={'cursor-pointer'}/></legend>
            <Form inline>
                <FormGroup className={'mb-1'}>
                    <FormLabel htmlFor={'name'} style={{width: 120}}>Header名称</FormLabel>
                    <FormControl name={'name'} onChange={handleNameChanged} value={item.args.param}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel htmlFor={'value'} style={{width: 120}}>参数值</FormLabel>
                    <FormControl name={'value'} onChange={handleValueChanged} value={item.args.regexp}/>
                </FormGroup>
            </Form>
        </fieldset>
    );
}
const PredicateCookie = (props: any) => {
    const {item, onRemove, onUpdate} = props;

    const handleNameChanged = (e: any) => {
        item.args.name = e.target.value;
        onUpdate();
    }
    const handleValueChanged = (e: any) => {
        item.args.regexp = e.target.value;
        onUpdate();
    }

    return (
        <fieldset title={'Path'}>
            <legend className={'text-center'}>Header <Trash size={16} onClick={() => onRemove(item)} className={'cursor-pointer'}/></legend>
            <Form inline>
                <FormGroup className={'mb-1'}>
                    <FormLabel htmlFor={'name'} style={{width: 120}}>名称</FormLabel>
                    <FormControl name={'name'} onChange={handleNameChanged} value={item.args.name}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel htmlFor={'value'} style={{width: 120}}>参数值</FormLabel>
                    <FormControl name={'value'} onChange={handleValueChanged} value={item.args.regexp}/>
                </FormGroup>
            </Form>
        </fieldset>
    );
}
const PredicateHeader = (props: any) => {
    const {item, onRemove, onUpdate} = props;

    const handleNameChanged = (e: any) => {
        item.args.header = e.target.value;
        onUpdate();
    }
    const handleValueChanged = (e: any) => {
        item.args.regexp = e.target.value;
        onUpdate();
    }

    return (
        <fieldset title={'Path'}>
            <legend className={'text-center'}>Header <Trash size={16} onClick={() => onRemove(item)} className={'cursor-pointer'}/></legend>
            <Form inline>
                <FormGroup className={'mb-1'}>
                    <FormLabel htmlFor={'name'} style={{width: 120}}>Header名称</FormLabel>
                    <FormControl name={'name'} onChange={handleNameChanged} value={item.args.header}/>
                </FormGroup>
                <FormGroup>
                    <FormLabel htmlFor={'value'} style={{width: 120}}>参数值</FormLabel>
                    <FormControl name={'value'} onChange={handleValueChanged} value={item.args.regexp}/>
                </FormGroup>
            </Form>
        </fieldset>
    );
}

const PredicateHost = (props: any) => {
    const {item, onRemove, onUpdate} = props;
    const [hosts, setHosts] = useState<string[]>([]);
    const [showInput, setShowInput] = useState<boolean>(false);

    const handleAdd = () => {
        setShowInput(true);
    }
    const handleOnBlur = (e: any) => {
        setShowInput(false);
        let newPaths = _.uniq([...hosts, e.target.value]);
        setHosts(newPaths);
        item.args = newPaths;
        onUpdate();
    }
    const handleRemove = (p: string) => {
        let newPaths = hosts.filter(x => x != p);
        setHosts(newPaths);
        item.args = newPaths;
        onUpdate();
    }

    return (
        <fieldset title={'Path'}>
            <legend className={'text-center'}>Host <Trash size={16} onClick={() => onRemove(item)} className={'cursor-pointer'}/></legend>
            <Row>
                {hosts.map(p => {
                    return (
                        <Col sm={2} key={p}><Badge variant={'light'}>{p} <X size={12} className={'cursor-pointer'} onClick={() => handleRemove(p)}/>
                        </Badge></Col>
                    );
                })}
                {showInput && <Col sm={3}><FormControl onBlur={handleOnBlur} size={'sm'}/></Col>}
                <Col sm={4}>
                    <Button size={'sm'} variant={'light'} onClick={handleAdd}><Plus size={12}/>新建Host</Button>
                </Col>
            </Row>
        </fieldset>
    );
}
const PredicateBefore = (props: any) => {
    const {item, onRemove, onUpdate} = props;
    const [befores, setBefores] = useState<string[]>([]);
    const [showInput, setShowInput] = useState<boolean>(false);

    const handleAdd = () => {
        setShowInput(true);
    }
    const handleOnBlur = (e: any) => {
        setShowInput(false);
        let newPaths = _.uniq([...befores, e.target.value]);
        setBefores(newPaths);
        item.args = newPaths;
        onUpdate();
    }
    const handleRemove = (p: string) => {
        let newPaths = befores.filter(x => x != p);
        setBefores(newPaths);
        item.args = newPaths;
        onUpdate();
    }

    return (
        <fieldset title={'After'}>
            <legend className={'text-center'}>Before <Trash size={16} onClick={() => onRemove(item)} className={'cursor-pointer'}/></legend>
            <Row>
                {befores.map(p => {
                    return (
                        <Col sm={2} key={p}><Badge variant={'light'}>{p} <X size={12} className={'cursor-pointer'} onClick={() => handleRemove(p)}/>
                        </Badge></Col>
                    );
                })}
                {showInput && <Col sm={3}><FormControl onBlur={handleOnBlur} size={'sm'}/></Col>}
                <Col sm={4}>
                    <Button size={'sm'} variant={'light'} onClick={handleAdd}><Plus size={12}/>新建Before</Button>
                </Col>
            </Row>
        </fieldset>
    );
}
const PredicateRemoteAddr = (props: any) => {
    const {item, onRemove, onUpdate} = props;
    const [remoteAddrs, setRemoteAddrs] = useState<string[]>([]);
    const [showInput, setShowInput] = useState<boolean>(false);

    const handleAdd = () => {
        setShowInput(true);
    }
    const handleOnBlur = (e: any) => {
        setShowInput(false);
        let newPaths = _.uniq([...remoteAddrs, e.target.value]);
        setRemoteAddrs(newPaths);
        item.args = newPaths;
        onUpdate();
    }
    const handleRemove = (p: string) => {
        let newPaths = remoteAddrs.filter(x => x != p);
        setRemoteAddrs(newPaths);
        item.args = newPaths;
        onUpdate();
    }

    return (
        <fieldset title={'RemoteAddr'}>
            <legend className={'text-center'}>RemoteAddr <Trash size={16} onClick={() => onRemove(item)} className={'cursor-pointer'}/></legend>
            <Row>
                {remoteAddrs.map(p => {
                    return (
                        <Col sm={2} key={p}><Badge variant={'light'}>{p} <X size={12} className={'cursor-pointer'} onClick={() => handleRemove(p)}/>
                        </Badge></Col>
                    );
                })}
                {showInput && <Col sm={3}><FormControl onBlur={handleOnBlur} size={'sm'}/></Col>}
                <Col sm={4}>
                    <Button size={'sm'} variant={'light'} onClick={handleAdd}><Plus size={12}/>新建RemoteAddr</Button>
                </Col>
            </Row>
        </fieldset>
    );
}
const PredicateBetween = (props: any) => {
    const {item, onRemove, onUpdate} = props;
    const [betweens, setBetweens] = useState<string[]>([]);
    const [showInput, setShowInput] = useState<boolean>(false);

    const handleAdd = () => {
        setShowInput(true);
    }
    const handleOnBlur = (e: any) => {
        setShowInput(false);
        let newPaths = _.uniq([...betweens, e.target.value]);
        setBetweens(newPaths);
        item.args = newPaths;
        onUpdate();
    }
    const handleRemove = (p: string) => {
        let newPaths = betweens.filter(x => x != p);
        setBetweens(newPaths);
        item.args = newPaths;
        onUpdate();
    }

    return (
        <fieldset title={'Between'}>
            <legend className={'text-center'}>Between <Trash size={16} onClick={() => onRemove(item)} className={'cursor-pointer'}/></legend>
            <Row>
                {betweens.map(p => {
                    return (
                        <Col sm={2} key={p}><Badge variant={'light'}>{p} <X size={12} className={'cursor-pointer'} onClick={() => handleRemove(p)}/>
                        </Badge></Col>
                    );
                })}
                {showInput && <Col sm={3}><FormControl onBlur={handleOnBlur} size={'sm'}/></Col>}
                <Col sm={4}>
                    <Button size={'sm'} variant={'light'} onClick={handleAdd}><Plus size={12}/>新建Between</Button>
                </Col>
            </Row>
        </fieldset>
    );
}
const PredicateAfter = (props: any) => {
    const {item, onRemove, onUpdate} = props;
    const [afters, setAfters] = useState<string[]>([]);
    const [showInput, setShowInput] = useState<boolean>(false);

    const handleAdd = () => {
        setShowInput(true);
    }
    const handleOnBlur = (e: any) => {
        setShowInput(false);
        let newPaths = _.uniq([...afters, e.target.value]);
        setAfters(newPaths);
        item.args = newPaths;
        onUpdate();
    }
    const handleRemove = (p: string) => {
        let newPaths = afters.filter(x => x != p);
        setAfters(newPaths);
        item.args = newPaths;
        onUpdate();
    }

    return (
        <fieldset title={'After'}>
            <legend className={'text-center'}>After <Trash size={16} onClick={() => onRemove(item)} className={'cursor-pointer'}/></legend>
            <Row>
                {afters.map(p => {
                    return (
                        <Col sm={2} key={p}><Badge variant={'light'}>{p} <X size={12} className={'cursor-pointer'} onClick={() => handleRemove(p)}/>
                        </Badge></Col>
                    );
                })}
                {showInput && <Col sm={3}><FormControl onBlur={handleOnBlur} size={'sm'}/></Col>}
                <Col sm={4}>
                    <Button size={'sm'} variant={'light'} onClick={handleAdd}><Plus size={12}/>新建After</Button>
                </Col>
            </Row>
        </fieldset>
    );
}
const PredicateMethod = (props: any) => {
    const {item, onRemove, onUpdate} = props;
    const [methods, setMethods] = useState<string[]>([]);
    const [showInput, setShowInput] = useState<boolean>(false);

    const handleAdd = () => {
        setShowInput(true);
    }
    const handleOnBlur = (e: any) => {
        setShowInput(false);
        let newPaths = _.uniq([...methods, e.target.value]);
        setMethods(newPaths);
        item.args = newPaths;
        onUpdate();
    }
    const handleRemove = (p: string) => {
        let newPaths = methods.filter(x => x != p);
        setMethods(newPaths);
        item.args = newPaths;
        onUpdate();
    }

    return (
        <fieldset title={'Path'}>
            <legend className={'text-center'}>Method <Trash size={16} onClick={() => onRemove(item)} className={'cursor-pointer'}/></legend>
            <Row>
                {methods.map(p => {
                    return (
                        <Col sm={2} key={p}><Badge variant={'light'}>{p} <X size={12} className={'cursor-pointer'} onClick={() => handleRemove(p)}/>
                        </Badge></Col>
                    );
                })}
                {showInput && <Col sm={3}><FormControl onBlur={handleOnBlur} size={'sm'}/></Col>}
                <Col sm={4}>
                    <Button size={'sm'} variant={'light'} onClick={handleAdd}><Plus size={12}/>新建Method</Button>
                </Col>
            </Row>
        </fieldset>
    );
}

const PredicatePath = (props: any) => {
    const {item, onRemove, onUpdate} = props;
    const [paths, setPaths] = useState<string[]>([]);
    const [showInput, setShowInput] = useState<boolean>(false);

    const handleAdd = () => {
        setShowInput(true);
    }
    const handleOnBlur = (e: any) => {
        setShowInput(false);
        let newPaths = _.uniq([...paths, e.target.value]);
        setPaths(newPaths);
        item.args = newPaths;
        onUpdate();
    }
    const handleRemove = (p: string) => {
        let newPaths = paths.filter(x => x != p);
        setPaths(newPaths);
        item.args = newPaths;
        onUpdate();
    }

    return (
        <fieldset title={'Path'}>
            <legend className={'text-center'}>Path <Trash size={16} onClick={() => onRemove(item)} className={'cursor-pointer'}/></legend>
            <Row>
                {paths.map(p => {
                    return (
                        <Col sm={2} key={p}><Badge variant={'light'}>{p} <X size={12} className={'cursor-pointer'} onClick={() => handleRemove(p)}/>
                        </Badge></Col>
                    );
                })}
                {showInput && <Col sm={3}><FormControl onBlur={handleOnBlur} size={'sm'}/></Col>}
                <Col sm={4}>
                    <Button size={'sm'} variant={'light'} onClick={handleAdd}><Plus size={12}/>新建Path</Button>
                </Col>
            </Row>
        </fieldset>
    );
}

const GatewayPredicateEditor = (props: any) => {
    let {label, name, className, ...rest} = props;
    const formik = useFormikContext();
    //@ts-ignore
    const [predicates, setPredicates] = useState<any>(JSON.parse(formik.values[name]||'[]'));
    const [index, setIndex] = useState<number>(0);

    const handleOnSelect = (e: any) => {
        setPredicates([...predicates, {name: e, args: {}, index: index}]);
        setIndex(index + 1);
        updateFieldValue();
    }
    const updateFieldValue = () => {
        formik.setFieldValue(name, JSON.stringify(predicates));
    }
    const handleRemove = (item: any) => {
        _.remove(predicates, {index: item.index});
        setPredicates([...predicates]);
        updateFieldValue();
    }
    const renderPredicate = (item: any) => {
        switch (item.name) {
            case 'Path':
                return <PredicatePath key={item.name + item.index} onUpdate={updateFieldValue} onRemove={handleRemove} item={item}/>
            case 'Header':
                return <PredicateHeader key={item.name + item.index} onUpdate={updateFieldValue} onRemove={handleRemove} item={item}/>
            case 'Query':
                return <PredicateQuery key={item.name + item.index} onUpdate={updateFieldValue} onRemove={handleRemove} item={item}/>
            case 'Method':
                return <PredicateMethod key={item.name + item.index} onUpdate={updateFieldValue} onRemove={handleRemove} item={item}/>
            case 'Host':
                return <PredicateHost key={item.name + item.index} onUpdate={updateFieldValue} onRemove={handleRemove} item={item}/>
            case 'Cookie':
                return <PredicateCookie key={item.name + item.index} onUpdate={updateFieldValue} onRemove={handleRemove} item={item}/>
            case 'After':
                return <PredicateAfter key={item.name + item.index} onUpdate={updateFieldValue} onRemove={handleRemove} item={item}/>
            case 'Before':
                return <PredicateBefore key={item.name + item.index} onUpdate={updateFieldValue} onRemove={handleRemove} item={item}/>
            case 'Between':
                return <PredicateBetween key={item.name + item.index} onUpdate={updateFieldValue} onRemove={handleRemove} item={item}/>
            case 'RemoteAddr':
                return <PredicateRemoteAddr key={item.name + item.index} onUpdate={updateFieldValue} onRemove={handleRemove} item={item}/>
        }
        return <></>;
    }
    return (
        <FormGroup>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <div className={'m-1'}>
                {predicates.map((p:any) => {
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