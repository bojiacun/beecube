import DatePicker from "react-datepicker";
import React, {FC, useEffect, useState} from "react";
import {FormControl} from "react-bootstrap";


export interface DateTimePickerProps {
    showTime?: boolean;
    minDate?: any;
    maxDate?: any;
    inputName: string;
    placeholder?: string;
    onChange?: Function;
}

const BootstrapFormControlInput = React.forwardRef(({value, onClick, inputName, inputPlaceHolder, onInputChange}:any, ref:any)=>{
    const handleOnChange = (e:any) => {
    }
    useEffect(()=> {
        typeof onInputChange === 'function' && onInputChange(value);
    }, [value])
    return <FormControl
        name={inputName}
        autoComplete={'off'}
        onClick={onClick}
        value={value}
        ref={ref}
        onChange={handleOnChange}
        placeholder={inputPlaceHolder}
    />
});

const DateTimePicker: FC<DateTimePickerProps> = (props) => {
    const {showTime = false, minDate = null, maxDate = null, inputName, placeholder = '选择时间', onChange} = props;
    const [selectedDate, setSelectedDate] = useState<any>();

    const handleOnDateChange = (date:any) => {
        setSelectedDate(date);
        typeof onChange === 'function' && onChange(date);
    }
    return (
        <DatePicker
            isClearable={true}
            selected={selectedDate}
            minDate={minDate}
            maxDate={maxDate}
            onChange={handleOnDateChange}
            dateFormat={showTime ? 'yyyy/MM/dd HH:mm' : 'yyyy/MM/dd'}
            customInput={<BootstrapFormControlInput inputName={inputName} placeholder={placeholder} inputPlaceHolder={placeholder} onInputChange={onChange} />}
            showTimeSelect={showTime}
        />
    );
}


export default DateTimePicker;