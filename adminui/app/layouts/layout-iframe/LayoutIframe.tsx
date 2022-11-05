import React, {useContext, useEffect, useRef} from "react";
import ThemeContext from 'themeConfig';
import {useLocation} from "react-router";
import ScrollToTop from "~/components/scroll-to-top/ScrollToTop";
import IframeScrollToTop from "~/components/iframe-scroll-to-top/IframeScrollToTop";


const LayoutIframe : React.FC<any> = (props:any) => {
    const {children} = props;
    const {theme} = useContext(ThemeContext);
    const location = useLocation();
    const scrollContainerRef = useRef<any>();

    useEffect(()=>{
        const appLoading = document.getElementById('loading-bg')
        if (appLoading) {
            appLoading.style.display = 'none';
            //@ts-ignore
            parent.setCurrentLink(location.pathname);
        }
    }, []);
    return (
        <div ref={scrollContainerRef} className={theme.layout.contentWidth == 'boxed' ? 'container p-0':''} style={{height: '100%', overflow: 'auto'}}>
            {children}
            {theme.layout.enableScrollToTop && <IframeScrollToTop scrollRef={scrollContainerRef} />}
        </div>
    );
}

export default LayoutIframe;