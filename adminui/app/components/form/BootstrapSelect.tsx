import {FormGroup, FormLabel} from "react-bootstrap";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import {FC, useState} from "react";
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
    const [selectValue, setSelectValue] = useState<any>();
    let {label, name, placeholder = '', options, isSearchable = false, isClearable = false, isMulti = false, formik} = props;
    if (placeholder === '') {
        placeholder = label;
    }
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