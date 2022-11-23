import {FormGroup, FormLabel} from "react-bootstrap";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import {FC, useEffect, useState} from "react";
import {FormikProps, useFormikContext} from "formik";
import _ from "lodash";

export interface BootstrapSelectProps extends Partial<any> {
    name: string;
    label: string;
    placeholder?: string;
    options: { label: string, value: string }[];
    isClearable?: boolean;
    isSearchable?: boolean;
    isMulti?: boolean;
}

const BootstrapSelect: FC<BootstrapSelectProps> = (props) => {
    let {label, name, placeholder = '', options, isSearchable = false, isClearable = false, isMulti = false} = props;
    const [value, setValue] = useState<any>();
    const formik = useFormikContext<any>();
    if (placeholder === '') {
        placeholder = label;
    }

    useEffect(()=>{
        if(formik.values[name] && options) {
            if(isMulti) {
                const values = formik.values[name].split(',');
                let valueOptions:any = [];
                values.forEach((v:any)=>{
                    let option = _.find(options, {value: v.toString()});
                    valueOptions.push(option);
                });
                setValue(valueOptions);
            }
            else {
                const val = formik.values[name];
                let valueOption = _.find(options, {value: val.toString()});
                setValue(valueOption);
            }
        }
        else {
            setValue(null);
        }
    }, [formik.values[name], options]);



    const handleOnChanged = (currentValue: any) => {
        const newValue = isMulti ? currentValue.map((item: any) => item.value).join(','): currentValue.value;
        formik.setFieldValue(name, newValue);
    }

    return (
        <FormGroup>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <ReactSelectThemed
                id={name}
                name={name}
                styles={{
                    control: (provided: any) => {
                        if (formik.touched[name] && formik.errors[name]) {
                            provided.borderColor = '#ea5455';
                        }
                        return provided;
                    }
                }}
                placeholder={placeholder}
                isClearable={isClearable}
                isSearchable={isSearchable}
                isMulti={isMulti}
                options={options}
                value={value}
                onChange={handleOnChanged}
            />
        </FormGroup>
    );
}

export default BootstrapSelect;