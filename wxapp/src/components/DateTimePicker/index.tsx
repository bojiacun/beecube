import Modal from "../modal/modal";
import React, {FC, useEffect, useRef, useState} from "react";
import {Input, Text} from "@tarojs/components";
import Picker from "./picker";
import {InputProps} from "@tarojs/components/types/Input";

export interface DateTimePickerProps {
    name: string;
    placeholder?: string;
    value?: string;
    disabled?: boolean;
    ref?: any;
    dateTime?: any[];
    onConfirm?: Function;
    format?: string;
}

const DateTimePicker: FC<DateTimePickerProps> = React.forwardRef<InputProps, DateTimePickerProps>((props, ref) => {
    let {
        name,
        placeholder,
        value,
        disabled = false,
        onConfirm,
        dateTime,
        format = "YYYY-MM-DD HH:mm:ss"
    } = props;

    if(!dateTime) {
        dateTime = [
            {mode: 'day', duration: 30, unit: '日', humanity: true, format: 'M月D日'},
            // { mode: 'hour' ,unit: ':00', selected:[8, 12, 16] },

            // { mode: 'hour', unit: ':00', format: 'H:s', selected: [9, 12] },
            {mode: 'hour', unit: '时'},
            // {mode: 'year', unit: '年', start: '2020'},
            // {mode: 'month', unit: '月'},
            // { mode: 'day', duration: 30, unit: '日', humanity: true, format: 'M月D日' },
            // {mode: 'day', start: '21', duration: 30, unit: '日' },
            // { mode: 'hour', unit: ':00', format: 'H:s', selected: [8, 12, 16] },

            {mode: 'minute', fields: 10, unit: '分'},
        ];
    }

    const [visible, setVisible] = useState<boolean>(false);
    const timeInputRef = ref ? ref : useRef<InputProps>();
    useEffect(() => {
        // @ts-ignore
        if (timeInputRef.current) {
            // @ts-ignore
            timeInputRef.current.value = value;
        }
    }, [value]);

    const handleConfirm = (value) => {
        setVisible(false);
        // @ts-ignore
        timeInputRef.current!.value = value;
        typeof onConfirm === 'function' && onConfirm(value);
    }
    const handleCancel = () => {
        setVisible(false);
    }
    return (
        <>
            <Input ref={timeInputRef} onClick={() => !disabled && setVisible(true)} name={name} disabled={true}
                   placeholder={placeholder} style={{textAlign: 'right'}}/>
            <Text className={'cuIcon-right'}/>
            <Modal visible={visible} height={350} onClose={() => setVisible(false)} backgroundColor={'white'}>
                <Picker dateTime={dateTime} mode='format' format={format} onConfirm={handleConfirm} onCancel={handleCancel}/>
            </Modal>
        </>
    );
})

export default DateTimePicker;
