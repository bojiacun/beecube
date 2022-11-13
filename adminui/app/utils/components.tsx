import {CSSProperties, useEffect, useState} from "react";
import ClipLoader from 'react-spinners/ClipLoader';


//自动关闭loading
export const withPageLoading = (Component:any) => {
    return function(props:any) {
        return (
            <>
                <Component {...props} />
            </>
        );
    }
}