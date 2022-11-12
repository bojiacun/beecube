import DatePicker from "react-datepicker";
import React, {FC, useState} from "react";
import {FormControl} from "react-bootstrap";


export interface DateTimePickerProps {
    showTime?: boolean;
    minDate?: any;
    maxDate?: any;
    inputName: string;
}

const BootstrapFormControlInput = React.forwardRef(({value, onClick, inputName}:any, ref:any)=>{
    const handleOnChange = (e:any) => {
    }
    return <FormControl
        name={inputName}
        autoComplete={'off'}
        onClick={onClick}
        value={value}
        ref={ref}
        onChange={handleOnChange}
    />
});

const DateTimePicker: FC<DateTimePickerProps> = (props) => {
    const {showTime = false, minDate = null, maxDate = null, inputName} = props;
    const [selectedDate, setSelectedDate] = useState<any>();

    const handleOnDateChange = (date:any) => {
        setSelectedDate(date);
    }
    return (
        <DatePicker
            isClearable={true}
            selected={selectedDate}
            minDate={minDate}
            maxDate={maxDate}
            onChange={handleOnDateChange}
            dateFormat={showTime ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'}
            customInput={<BootstrapFormControlInput inputName={inputName} />}
            showTimeSelect={showTime}
        />
    );
}


export default DateTimePicker;