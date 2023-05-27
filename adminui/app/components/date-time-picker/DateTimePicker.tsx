import DatePicker from "react-datepicker";
import React, {FC, useEffect, useState} from "react";
import {FormControl} from "react-bootstrap";
import {FormikProps, useFormikContext} from "formik";
import moment from "moment";
import classNames from "classnames";
import {Portal} from "react-overlays";


export interface DateTimePickerProps extends Partial<any>{
    showTime?: boolean;
    minDate?: any;
    maxDate?: any;
    inputName: string;
    placeholder?: string;
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
        onChange={()=>{}}
    />
});

const DateTimePicker: FC<DateTimePickerProps> = (props) => {
    const {showTime = false, minDate = null, maxDate = null, inputName, placeholder = '选择时间', isClearable = true, ...rest} = props;
    const [selectedDate, setSelectedDate] = useState<any>();
    const formatter = showTime ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd';
    const formik = useFormikContext<any>();

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
            const dateValue =  moment(date).format(showTime ? 'YYYY-MM-DD HH:mm:ss':'YYYY-MM-DD');
            formik.setFieldValue(inputName, dateValue);
        }
        else {
            formik.setFieldValue(inputName, null);
        }
    }
    return (
        <DatePicker
            isClearable={isClearable}
            selected={selectedDate}
            minDate={minDate}
            maxDate={maxDate}
            onChange={handleOnDateChange}
            dateFormat={formatter}
            customInput={<BootstrapFormControlInput inputName={inputName} placeholder={placeholder} inputPlaceHolder={placeholder} formik={formik} />}
            showTimeSelect={showTime}
            showTimeInput={true}
            {...rest}
        />
    );
}


export default DateTimePicker;