import {useEffect} from "react";
import {stopPageLoading} from "~/layouts/utils";



//自动关闭loading
export const withAutoLoading = (Component:any) => {
    return function(props:any) {
        useEffect(()=>{
            stopPageLoading();
        }, []);
        return <Component {...props} />
    }
}