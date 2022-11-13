import {CSSProperties, useEffect, useState} from "react";
import ClipLoader from 'react-spinners/ClipLoader';

const loaderCss: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

//自动关闭loading
export const withPageLoading = (Component:any) => {
    return function(props:any) {
        let [loading, setLoading] = useState(true);
        let [color, setColor] = useState("#ffffff");

        const startPageLoading = () => {
            setLoading(true);
        }
        const stopPageLoading = () => {
            setLoading(false);
        }


        return (
            <>
                <ClipLoader
                    color={color}
                    loading={loading}
                    cssOverride={loaderCss}
                    size={150}
                />
                <Component startPageLoading={startPageLoading} stopPageLoading={stopPageLoading} {...props} />
            </>
        );
    }
}