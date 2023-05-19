import {MinusSquare, PlusSquare} from "react-feather";
import {toast} from "react-toastify";
import Swal from 'sweetalert2';
import {Fetcher, isRouteErrorResponse, useRouteError} from "@remix-run/react";
import React, {useContext, useEffect} from "react";
import Error401Page from "~/components/error-page/401";
import Error404Page from "~/components/error-page/404";
import Error500Page from "~/components/error-page/500";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import themeContext from 'themeConfig';
//@ts-ignore
import {Navigation} from "@remix-run/router";

export const uint8arrayToBase64 = (value:any) => {
    // 必须定义 binary 二进e
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

export function showDeleteAlert(deleteCallback: Function, message: string = '您确定要删除本条数据吗', title='确认删除吗?', confirmText='确认！') {
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
}

export function defaultRouteErrorBoundary() {
    const {stopPageLoading} = useContext(themeContext);
    const error = useRouteError();
    useEffect(()=>{
        stopPageLoading();
    }, []);
    if (isRouteErrorResponse(error)) {
        switch (error.status) {
            case 401:
                return <Error401Page />;
            case 404:
                return <Error404Page />;
        }
    }
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
    if(!path) {
        return '';
    }
    return path.startsWith('http') || path.startsWith('/')? path : '/'+path;
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

export function buildPageListFromData(data: any[]) {
    let size = 10;
    let pages = Math.ceil(data.length / size);
    return {
        current: 1,
        total: data.length,
        records: data,
        size: size,
        pages: pages,
    }
}

export function compareVersion(v1:any, v2:any){
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
        v1.push('0')
    }
    while (v2.length < len) {
        v2.push('0')
    }

    for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i])
        const num2 = parseInt(v2[i])

        if (num1 > num2) {
            return 1
        } else if (num1 < num2) {
            return -1
        }
    }

    return 0
}

export function nl2br(str:string) {
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');
}
export enum FetcherState{
    DONE,
    LOADING,
    SUBMITTING,
    RELOADING,
    REDIRECTED,
    LOADER_SUBMITTING,
    UNKNOW
}
export enum NavigationState{
    LOADER_REDIRECTED,
    LOADING,
    SUBMITTING,
    RELOADING,
    REDIRECTED,
    LOADER_SUBMITTING,
    UNKNOW
}
export function getFetcherState(fetcher: Fetcher): FetcherState {
    let isDone =
        fetcher.state === "idle" && fetcher.data != null;

    if(isDone) return FetcherState.DONE;
    // fetcher.type === "actionSubmission"
    let isActionSubmission = fetcher.state === "submitting";
    if(isActionSubmission) return FetcherState.SUBMITTING;

    // fetcher.type === "actionReload"
    let isActionReload =
        fetcher.state === "loading" &&
        fetcher.formMethod != null &&
        // @ts-ignore
        fetcher.formMethod != "GET" &&
        // If we returned data, we must be reloading
        fetcher.data != null;

    if(isActionReload) return FetcherState.RELOADING;
    // fetcher.type === "actionRedirect"
    let isActionRedirect =
        fetcher.state === "loading" &&
        fetcher.formMethod != null &&
        // @ts-ignore
        fetcher.formMethod != 'GET' &&
        // If we have no data we must have redirected
        fetcher.data == null;
    if(isActionRedirect) return FetcherState.REDIRECTED;

    // fetcher.type === "loaderSubmission"
    let isLoaderSubmission =
        fetcher.state === "loading" &&
        // @ts-ignore
        fetcher.formMethod === "GET";
    if(isLoaderSubmission) return FetcherState.LOADER_SUBMITTING;

    // fetcher.type === "normalLoad"
    let isNormalLoad =
        fetcher.state === "loading" &&
        fetcher.formMethod == null;
    if(isNormalLoad) return FetcherState.LOADING;

    return FetcherState.UNKNOW;
}
export function getNavigationState(navigation: Navigation): NavigationState{
    // transition.type === "actionSubmission"
    let isActionSubmission =
        navigation.state === "submitting";

    if(isActionSubmission) return NavigationState.SUBMITTING;

    // transition.type === "actionReload"
    let isActionReload =
        navigation.state === "loading" &&
        navigation.formMethod != null &&
        navigation.formMethod != "get" &&
        // We had a submission navigation and are loading the submitted location
        navigation.formAction === navigation.pathname;

    if(isActionReload) return NavigationState.RELOADING;

    // transition.type === "actionRedirect"
    let isActionRedirect =
        navigation.state === "loading" &&
        navigation.formMethod != null &&
        navigation.formMethod != "get" &&
        // We had a submission navigation and are now navigating to different location
        navigation.formAction !== navigation.pathname;

    if(isActionRedirect) return NavigationState.REDIRECTED;

    // transition.type === "loaderSubmission"
    let isLoaderSubmission =
        navigation.state === "loading" &&
        navigation.state.formMethod === "get" &&
        // We had a loader submission and are navigating to the submitted location
        navigation.formAction === navigation.pathname;

    if(isLoaderSubmission) return NavigationState.LOADER_SUBMITTING;

    // transition.type === "loaderSubmissionRedirect"
    let isLoaderSubmissionRedirect =
        navigation.state === "loading" &&
        navigation.state.formMethod === "get" &&
        // We had a loader submission and are navigating to a new location
        navigation.formAction !== navigation.pathname;

    if(isLoaderSubmissionRedirect) return NavigationState.LOADER_REDIRECTED;

    return NavigationState.UNKNOW;
}