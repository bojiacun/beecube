import {CSSProperties, useEffect, useState} from "react";
import ClipLoader from 'react-spinners/ClipLoader';
import {useOutletContext} from "react-router";


//自动关闭loading
export const withPageLoading = (Component:any) => {
    return function(props:any) {
        const [startPageLoading, stopPageLoading] = useOutletContext<any>();

        useEffect(() => {
            stopPageLoading();
        }, []);
        return (
            <>
                <Component startPageLoading={startPageLoading} stopPageLoading={stopPageLoading} {...props} />
            </>
        );
    }
}