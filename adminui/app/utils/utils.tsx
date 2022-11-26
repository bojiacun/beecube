import {MinusSquare, PlusSquare} from "react-feather";
import {toast} from "react-toastify";
import Swal from 'sweetalert2';
import {useCatch} from "@remix-run/react";
import {useOutletContext} from "react-router";
import {useContext, useEffect} from "react";
import Error401Page from "~/components/error-page/401";
import Error404Page from "~/components/error-page/404";
import Error500Page from "~/components/error-page/500";
import {FormControl, FormGroup, FormLabel} from "react-bootstrap";
import {Field} from "formik";
import classNames from "classnames";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import themeContext from 'themeConfig';
import Error403Page from "~/components/error-page/403";

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
    expandColumnRenderer: ({expanded, expandable}: {expanded: boolean, expandable: boolean}) => {
        if(!expandable) return <MinusSquare size={16} />
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
export function handleResult(result: any, successMessage = '执行成功') {
    if(!result.success) {
        showToastError(result.message || '服务器内部错误');
    }
    else {
        showToastSuccess(successMessage);
    }
}
export function handleSaveResult(result: any, successMessage = '保存成功') {
    if(!result.success) {
        showToastError(result.message || '服务器内部错误');
    }
    else {
        showToastSuccess(successMessage);
    }
}

export function defaultRouteCatchBoundary() {
    const caught = useCatch();
    const {stopPageLoading} = useContext(themeContext);

    useEffect(()=>{
        stopPageLoading();
    }, []);

    if (caught.status === 401) {
        return <Error401Page/>
    } else if (caught.status === 404) {
        return <Error404Page/>
    }
    else if(caught.status === 403) {
        return <Error403Page />
    }
    return <Error500Page/>
}

export function defaultRouteErrorBoundary() {
    const {stopPageLoading} = useContext(themeContext);


    useEffect(()=>{
        stopPageLoading();
    }, []);


    return <Error500Page/>;
}



export const defaultTreeIcons = {
    check: <FontAwesomeIcon className="rct-icon rct-icon-check" icon={'check-square'}/>,
    uncheck: <FontAwesomeIcon className="rct-icon rct-icon-uncheck" icon={['far', 'square']}/>,
    halfCheck: <FontAwesomeIcon className="rct-icon rct-icon-half-check" icon="check-square"/>,
    expandClose: <FontAwesomeIcon className="rct-icon rct-icon-half-check" icon={'caret-right'}/>,
    expandOpen: <FontAwesomeIcon className="rct-icon rct-icon-expand-open" icon="caret-down"/>,
    expandAll: <FontAwesomeIcon className="rct-icon rct-icon-expand-all" icon="plus-square"/>,
    collapseAll: <FontAwesomeIcon className="rct-icon rct-icon-collapse-all" icon="minus-square"/>,
    parentClose: <FontAwesomeIcon className="rct-icon rct-icon-parent-close" icon="folder"/>,
    parentOpen: <FontAwesomeIcon className="rct-icon rct-icon-parent-open" icon="folder-open"/>,
    leaf: <FontAwesomeIcon className="rct-icon rct-icon-leaf-close" icon="file"/>
};

export const defaultEmptyTable = () => {
    return <div className={'text-muted'}>暂无数据</div>
}

export const emptyDropdownIndicator = () => {
    return <></>
}
export const emptyIndicatorSeparator= () => {
    return <></>
}

export function tree2List(tree:any[]):any[] {
    let list: any[] = [];

    tree.forEach((t:any)=>{
        list.push(t);
        if(t.children && t.children.length > 0) {
            tree2List(t.children).forEach(c => list.push(c));
        }
    });

    return list;
}
export function resolveUrl(path: string) {
    return path.startsWith('http')? path : '/'+path;
}

export function formData2Json(formData: FormData, stringify = true) {
    let jsonData:any = {};
    formData.forEach((value, key)=>{
        if(value === 'null' || value === 'undefined') {
            jsonData[key] = null;
        }
        else {
            jsonData[key] = value
        }
    });
    if(stringify) {
        return JSON.stringify(jsonData);
    }
    return jsonData;
}

export function findTree(items:any[], key:string, value:any):any{
    let result = null;
    if(!items) return result;
    for(let i = 0; i < items.length;i++){
        let item = items[i];
        if(item[key] == value) {
            result = item;
            break;
        }
        else if(item.children) {
            result = findTree(item.children, key, value);
            if(result != null) {
                break;
            }
        }
    }
    return result;
}