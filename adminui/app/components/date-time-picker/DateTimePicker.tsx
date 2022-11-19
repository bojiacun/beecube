import DatePicker from "react-datepicker";
import React, {FC, useEffect, useState} from "react";
import {FormControl} from "react-bootstrap";
import {FormikProps} from "formik";
import moment from "moment";
import classNames from "classnames";


export interface DateTimePickerProps {
    showTime?: boolean;
    minDate?: any;
    maxDate?: any;
    inputName: string;
    placeholder?: string;
    formik: FormikProps<any>;
}

const BootstrapFormControlInput = React.forwardRef(({value, onClick, inputName, inputPlaceHolder, formik}:any, ref:any)=>{
    const handleOnChange = (e:any) => {
        formik.handleChange(e);
    }
    useEffect(()=> {
        formik.handleChange({currentTarget: {name: inputName, value: value}});
    }, [value])

    return <FormControl
        name={inputName}
        autoComplete={'off'}
        className={classNames((!!formik.touched[inputName] && !!formik.errors[inputName]) ? 'is-invalid':'')}
        onClick={onClick}
        value={value}
        ref={ref}
        onChange={handleOnChange}
        placeholder={inputPlaceHolder}
    />
});

const DateTimePicker: FC<DateTimePickerProps> = (props) => {
    const {showTime = false, minDate = null, maxDate = null, inputName, placeholder = '选择时间', formik} = props;
    const [selectedDate, setSelectedDate] = useState<any>();

    useEffect(()=>{
        if(formik.values[inputName]) {
            setSelectedDate(moment(formik.values[inputName], showTime ? ['yyyy-MM-dd HH:mm', 'yyyy/MM/dd HH:mm'] : ['yyyy-MM-dd', 'yyyy/MM/dd'], 'en', false).toDate());
        }
    }, [formik.values[inputName]]);

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
            customInput={<BootstrapFormControlInput inputName={inputName} placeholder={placeholder} inputPlaceHolder={placeholder} formik={formik} />}
            showTimeSelect={showTime}
        />
    );
}


export default DateTimePicker;