import {CSSProperties, useEffect, useState} from "react";
import ClipLoader from 'react-spinners/ClipLoader';
import {useOutletContext} from "react-router";


//自动关闭loading
export const withPageLoading = (Component:any) => {
    return function(props:any) {
        console.log('with page loading props is', useOutletContext(), props);
        useEffect(() => {
            // stopPageLoading();
        }, []);
        return (
            <>
                <Component {...props} />
            </>
        );
    }
}