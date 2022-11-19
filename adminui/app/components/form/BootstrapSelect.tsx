import {FormGroup, FormLabel} from "react-bootstrap";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import {FC} from "react";

export interface BootstrapSelectProps extends Partial<any> {
    name: string;
    label: string;
    placeholder?: string;
    options: {label: string, value: string}[];
    isClearable?: boolean;
    isSearchable?: boolean;
    isMulti?: boolean;
}

const BootstrapSelect: FC<BootstrapSelectProps> = (props) => {
    let {label, name, placeholder = '', options, isSearchable = false, isClearable = false, isMulti = false} = props;
    if(placeholder === '') {
        placeholder = label;
    }
    return (
        <FormGroup>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <ReactSelectThemed
                id={name}
                name={name}
                placeholder={placeholder}
                isClearable={isClearable}
                isSearchable={isSearchable}
                isMulti={isMulti}
                options={options}
            />
        </FormGroup>
    );
}

export default BootstrapSelect;