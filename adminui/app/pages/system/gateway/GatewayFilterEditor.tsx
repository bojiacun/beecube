import {DropdownButton, Dropdown, FormLabel, FormGroup, Form, FormControl, Button} from "react-bootstrap";
import {useEffect, useState} from "react";
import {useFormikContext} from "formik";
import {Trash} from "react-feather";
import _ from "lodash";

const FilterRequestRateLimiter = (props: any) => {
    const {item, onRemove, onUpdate} = props;
    const [optionValues, setOptionValues] = useState<{key:string; value:string, id: number}[]>([]);


    useEffect(()=>{
        if(item.args === null) {
            item.args = [
                {key: 'key-resolver', value: '#{@ipKeyResolver}', id: 1},
                {key: 'redis-rate-limiter.replenishRate', value: '20', id: 2},
                {key: 'redis-rate-limiter.burstCapacity', value: '20', id: 3},
            ];
            onUpdate();
        }
        setOptionValues(item.args);
    }, [item.args]);

    const removeItem = (argsItem: any) => {
        _.remove(optionValues, {id: argsItem.id});
        setOptionValues([...optionValues]);
        item.args = optionValues;
        onUpdate();
    }
    const addItem = () => {
        let newValues = [...optionValues, {key: '', value: '', id: optionValues.length+1}];
        setOptionValues(newValues);
        item.args = newValues;
        onUpdate();
    }

    const onKeyChange = (e:any, item:any) => {
        item.key = e.target.value;
        onUpdate();
    }
    const onValueChange = (e:any, item:any) => {
        item.value = e.target.value;
        onUpdate();
    }

    return (
        <fieldset title={'Path'}>
            <legend className={'text-center'}>RequestRateLimiter <Trash size={16} onClick={() => onRemove(item)} className={'cursor-pointer'}/></legend>
            <Form inline>
                {optionValues.map(item=>{
                    return (
                        <FormGroup key={item.id} className={'mb-1'}>
                            <FormControl name={'key'}  value={item.key} onChange={e=>onKeyChange(e, item)} />
                            <FormControl name={'value'} value={item.value} onChange={e=>onValueChange(e, item)} />
                            <Trash size={16} className={'cursor-pointer'} onClick={()=>removeItem(item)} />
                        </FormGroup>
                    );
                })}
                <Button variant={'light'} onClick={addItem}>添加参数</Button>
            </Form>
        </fieldset>
    );
}

const GatewayFilterEditor = (props:any) => {
    let {label, name, className, ...rest} = props;
    const formik = useFormikContext();
    //@ts-ignore
    const [filters, setFilters] = useState<any[]>(JSON.parse(formik.values[name]||'[]'));
    const [index, setIndex] = useState<number>(0);

    const handleRemove = (item: any) => {
        _.remove(filters, {index: item.index});
        setFilters([...filters]);
        updateFieldValue();
    }
    const updateFieldValue = () => {
        formik.setFieldValue(name, JSON.stringify(filters));
    }
    const handleOnSelect = (e:string) => {
        setFilters([...filters, {name: e, args: null, index: index}]);
        setIndex(index+1);
    }
    const renderFilter = (item: any) => {
        switch (item.name) {
            case 'RequestRateLimiter':
                return <FilterRequestRateLimiter key={item.name + item.index} onUpdate={updateFieldValue} onRemove={handleRemove} item={item}/>
        }
        return <></>;
    }
    return (
        <FormGroup>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <div className={'m-1'}>
                {filters.map((p) => {
                    return renderFilter(p);
                })}
            </div>
            <DropdownButton title={'添加过滤器'} onSelect={handleOnSelect} {...rest}>
                <Dropdown.Item eventKey={'RequestRateLimiter'}>限流过滤器</Dropdown.Item>
            </DropdownButton>
        </FormGroup>
    );
}

export default GatewayFilterEditor;