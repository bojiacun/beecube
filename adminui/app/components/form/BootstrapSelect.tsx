import {FormGroup, FormLabel, Form} from "react-bootstrap";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import {FC, useEffect, useState} from "react";
import {useFormikContext} from "formik";
import _ from "lodash";
import {useTranslation} from "react-i18next";

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
    let {label, name, placeholder = '', options, isSearchable = false, isClearable = false, isMulti = false, onSelectChanged, ...rest} = props;
    const [value, setValue] = useState<any>();
    const {t} = useTranslation();
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
        onSelectChanged && onSelectChanged(newValue);
    }

    return (
        <FormGroup>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <ReactSelectThemed
                id={name}
                name={name}
                styles={{
                    control: (provided: any) => {
                        if (formik.errors[name]) {
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
                {...rest}
            />
            {formik.errors[name]&&<Form.Control.Feedback type={'invalid'}>{t(formik.errors[name]!.toString())}</Form.Control.Feedback>}
        </FormGroup>
    );
}

export default BootstrapSelect;