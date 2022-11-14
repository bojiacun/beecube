import {useContext, useEffect} from "react";
import themeContext from 'themeConfig';


//自动关闭loading
export const withPageLoading = (Component:any) => {
    return function(props:any) {
        const {startPageLoading, stopPageLoading} = useContext(themeContext);

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