import React, {useContext, useEffect} from "react";
import ThemeContext from 'themeConfig';
import {useLocation} from "react-router";
import ScrollToTop from "~/components/scroll-to-top/ScrollToTop";


const LayoutIframe : React.FC<any> = (props:any) => {
    const {children} = props;
    const {theme} = useContext(ThemeContext);
    const location = useLocation();

    useEffect(()=>{
        const appLoading = document.getElementById('loading-bg')
        if (appLoading) {
            appLoading.style.display = 'none';
            //@ts-ignore
            parent.setCurrentLink(location.pathname);
        }
    }, []);
    return (
        <div className={theme.layout.contentWidth == 'boxed' ? 'container p-0':''} style={{height: '100%', overflow: 'auto'}}>
            {children}
            {theme.layout.enableScrollToTop && <ScrollToTop />}
        </div>
    );
}

export default LayoutIframe;