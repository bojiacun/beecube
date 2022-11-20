import {FormGroup, FormLabel} from "react-bootstrap";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import {FC, useEffect, useState} from "react";
import {FormikProps} from "formik";
import _ from "lodash";

export interface BootstrapSelectProps extends Partial<any> {
    name: string;
    label: string;
    placeholder?: string;
    options: { label: string, value: string }[];
    isClearable?: boolean;
    isSearchable?: boolean;
    isMulti?: boolean;
    formik: FormikProps<any>;
}

const BootstrapSelect: FC<BootstrapSelectProps> = (props) => {
    let {label, name, placeholder = '', options, isSearchable = false, isClearable = false, isMulti = false, formik} = props;
    const [selectValue, setSelectValue] = useState<any>(formik.values[name]);
    if (placeholder === '') {
        placeholder = label;
    }

    useEffect(()=>{
        if(formik.values[name]) {
            const values = formik.values[name];
            let valueOptions = options.filter((o: any) => {
                return _.indexOf(values, o.value) > -1;
            });
            console.log(values, valueOptions);
            setSelectValue(valueOptions);
        }
    }, [formik.values[name]]);



    const handleOnChanged = (currentValue: any) => {
        let data = {name: name, value: _.isArray(currentValue) ? currentValue.map((item: any) => item.value).join(','): currentValue};
        let e = {currentTarget: data};
        formik.handleChange(e);
        setSelectValue(currentValue);
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
                value={selectValue}
                onChange={handleOnChanged}
            />
        </FormGroup>
    );
}

export default BootstrapSelect;