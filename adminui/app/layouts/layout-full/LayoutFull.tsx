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
        <div className={theme.layout.contentWidth == 'boxed' ? 'container p-0':''} style={{height: '100%', overflow: 'auto'}}>
            {children}
        </div>
    );
}

export default LayoutFull;