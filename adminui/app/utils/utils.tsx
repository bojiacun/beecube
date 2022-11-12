
// uint8array转base64
import {MinusSquare, PlusSquare} from "react-feather";

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