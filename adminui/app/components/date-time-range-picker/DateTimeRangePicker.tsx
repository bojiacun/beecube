import DatePicker from "react-datepicker";
import React, {FC, useState} from "react";
import {FormControl} from "react-bootstrap";


export interface DateTimePickerProps {
    showTime?: boolean;
    minDate?: any;
    maxDate?: any;
    inputName: string;
    placeholder?: string;
    onChange?: Function;
}

const BootstrapFormControlInput = React.forwardRef(({value, onClick, inputName, placeholder}:any, ref:any)=>{
    const handleOnChange = (e:any) => {
    }
    return <FormControl
        name={inputName}
        autoComplete={'off'}
        onClick={onClick}
        value={value}
        ref={ref}
        onChange={handleOnChange}
        placeholder={placeholder}
    />
});

const DateTimeRangePicker: FC<DateTimePickerProps> = (props) => {
    const {showTime = false, minDate = null, maxDate = null, inputName, placeholder = '选择要查询的时间段', onChange} = props;
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const handleOnDateChange = (date:any) => {
        setDateRange(date);
        typeof onChange === 'function' && onChange(date);
    }
    return (
        <DatePicker
            isClearable={true}
            startDate={startDate}
            endDate={endDate}
            minDate={minDate}
            maxDate={maxDate}
            onChange={handleOnDateChange}
            dateFormat={showTime ? 'yyyy/MM/dd HH:mm' : 'yyyy/MM/dd'}
            customInput={<BootstrapFormControlInput inputName={inputName} placeholder={placeholder} />}
            showTimeSelect={showTime}
            selectsRange={true}
        />
    );
}


export default DateTimeRangePicker;