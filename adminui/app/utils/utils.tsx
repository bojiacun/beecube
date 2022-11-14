
// uint8array转base64
import {MinusSquare, PlusSquare} from "react-feather";
import {toast} from "react-toastify";
import Swal from 'sweetalert2';
import {useCatch} from "@remix-run/react";
import {useOutletContext} from "react-router";
import {useEffect} from "react";
import Error401Page from "~/components/error-page/401";
import Error404Page from "~/components/error-page/404";
import Error500Page from "~/components/error-page/500";
import {FormGroup, FormLabel} from "react-bootstrap";
import {Field} from "formik";
import classNames from "classnames";

export const uint8arrayToBase64 = (value:any) => {
    // 必须定义 binary 二进制
    return Buffer.from(value, 'binary').toString('base64');
}

export const base64ToUint8array = (value:any) => {
    value = Buffer.from(value, 'base64').toString('binary');
    let len = value.length;
    let outputArray = new Uint8Array(len);
    for (let i = 0; i < len; ++i) {
        outputArray[i] = value.charCodeAt(i);
    }
    return outputArray;
}
// 判断是否json
export const isJson = function(_str:any){
    if (typeof _str === 'string') {
        try {
            JSON.parse(_str);
            return true;
        } catch(e) {}
    }
    return false;
}

// base64加密
export const base64Encode = (value:any) => {
    if (typeof value === 'undefined') {
        return null;
    }
    return new Buffer(JSON.stringify(value), 'binary').toString('base64');
}

// base64解密
export const base64Decode = (value:any) => {
    value = new Buffer(value, 'base64').toString('binary');
    if (isJson(value)) {
        value = JSON.parse(value);
    }
    return value;
}

export const DefaultListSearchParams:any = {
    pageNo: 1,
    pageSize: 10,
    column: 'createTime',
    order: 'desc',
}

export const PageSizeOptions = [
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '50', label: '50' },
    { value: '100', label: '100' }
]
export const headerSortingClasses = (column: any, sortOrder: any) => (
    sortOrder === 'asc' ? 'sorting-asc' : 'sorting-desc'
);
export const emptySortFunc = () => 0;

export const defaultSelectRowConfig:any = {
    mode: 'checkbox',
    clickToSelect: true
}

export const defaultTableExpandRow = {
    expandHeaderColumnRenderer: () => {
        return <></>
    },
    expandColumnRenderer: ({expanded}: {expanded: boolean}) => {
        if(expanded) {
            return <MinusSquare size={16} />
        }
        return <PlusSquare size={16} />
    },
    showExpandColumn: true,
    expandByColumnOnly: true,
}

export function showToastSuccess(message: string) {
    toast.success(message, {
        position: "top-center",
        autoClose: 800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
    });
}

export function showToastError(message: string) {
    toast.error(message, {
        position: "top-center",
        autoClose: 800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
    });
}

export function showDeleteAlert(deleteCallback: Function, message: string = '您确定要删除本条数据吗', title='确认删除吗?', confirmText='确认删除！') {
    Swal.fire({
        title: title,
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#ccc',
        confirmButtonText: confirmText,
        cancelButtonText: '取消',
        backdrop: false,
    }).then((result) => {
        if (result.isConfirmed) {
            deleteCallback();
        }
    })
}


export function defaultRouteCatchBoundary() {
    const caught = useCatch();
    const [startPageLoading, stopPageLoading] = useOutletContext<any>();
    useEffect(()=>{
        stopPageLoading();
    }, []);

    if (caught.status === 401) {
        return <Error401Page/>
    } else if (caught.status === 404) {
        return <Error404Page/>
    }
    return <Error500Page/>
}

export function defaultRouteErrorBoundary() {
    const [startPageLoading, stopPageLoading] = useOutletContext<any>();
    useEffect(()=>{
        stopPageLoading();
    }, []);
    return <Error500Page/>;
}

export interface EditFormHelperInputProps {
    label: string;
    fieldName: string;
    placeholder?: string;
    readOnly?: boolean;
    className?: string;
}

export const EditFormHelper = {
    normalInput: (options: EditFormHelperInputProps)=>{
        const {label, fieldName, placeholder = '', readOnly = false, className = ''} = options;
        return (
            <FormGroup>
                <FormLabel htmlFor={fieldName}>{label}</FormLabel>
                <Field className={classNames('form-control', className)} id={fieldName}
                       name={fieldName} placeholder={placeholder} readOnly={readOnly}/>
            </FormGroup>
        );
    }
}