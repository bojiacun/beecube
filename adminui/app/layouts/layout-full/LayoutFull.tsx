import React, {useContext, useEffect} from "react";
import ThemeContext from 'themeConfig';


const LayoutFull: React.FC<any> = (props:any) => {
    const {children} = props;
    const {theme} = useContext(ThemeContext);
    useEffect(()=>{
        const appLoading = document.getElementById('loading-bg')
        if (appLoading) {
            appLoading.style.display = 'none'
        }
    }, []);
    return (
        <>
            {children}
        </>
    );
}

export default LayoutFull;