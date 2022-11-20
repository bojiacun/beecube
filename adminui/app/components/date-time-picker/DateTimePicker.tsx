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

const BootstrapFormControlInput = React.forwardRef(({value, inputName, onClick, inputPlaceHolder, formik}:any, ref:any)=>{
    return <FormControl
        name={inputName}
        autoComplete={'off'}
        className={classNames((!!formik.touched[inputName] && !!formik.errors[inputName]) ? 'is-invalid':'')}
        value={value}
        ref={ref}
        placeholder={inputPlaceHolder}
        onClick={onClick}
    />
});

const DateTimePicker: FC<DateTimePickerProps> = (props) => {
    const {showTime = false, minDate = null, maxDate = null, inputName, placeholder = '选择时间', formik} = props;
    const [selectedDate, setSelectedDate] = useState<any>();
    const formatter = showTime ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd';

    useEffect(()=>{
        if(formik.values[inputName]) {
            setSelectedDate(moment(formik.values[inputName]).toDate());
        }
        else {
            setSelectedDate(null);
        }
    }, [formik.values[inputName]]);

    const handleOnDateChange = (date:any) => {
        if(date) {
            const dateValue =  moment(date).format('YYYY-MM-DD');
            formik.setFieldValue(inputName, dateValue);
        }
        else {
            formik.setFieldValue(inputName, null);
        }
    }
    return (
        <DatePicker
            isClearable={true}
            selected={selectedDate}
            minDate={minDate}
            maxDate={maxDate}
            onChange={handleOnDateChange}
            dateFormat={formatter}
            customInput={<BootstrapFormControlInput inputName={inputName} placeholder={placeholder} inputPlaceHolder={placeholder} formik={formik} />}
            showTimeSelect={showTime}
        />
    );
}


export default DateTimePicker;