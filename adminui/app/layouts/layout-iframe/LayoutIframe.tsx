import React, {useContext, useEffect, useRef} from "react";
import ThemeContext from 'themeConfig';
import {useLocation} from "react-router";
import IframeScrollToTop from "~/components/iframe-scroll-to-top/IframeScrollToTop";
import {getCurrentUser} from "~/utils/reqeust";


export interface LayoutIframeProps {
    requireLogin?: boolean;
    children?: any;
}

const LayoutIframe : React.FC<LayoutIframeProps> = (props) => {
    const {children, requireLogin = true} = props;
    const {theme, updateThemeContext} = useContext(ThemeContext);
    const location = useLocation();
    const scrollContainerRef = useRef<any>();

    useEffect(()=>{
        const appLoading = document.getElementById('loading-bg')
        if (appLoading) {
            // appLoading.style.display = 'none';
            //@ts-ignore
            typeof parent?.setCurrentLink === 'function' && parent?.setCurrentLink(location.pathname);
        }
        window.addEventListener("message", function(event){
            updateThemeContext({...event.data});
        }, false);
        if(requireLogin) {
            const userInfo = getCurrentUser();
            if(userInfo == null) {
                //@ts-ignore
                typeof parent?.navigate === 'function' && parent?.navigate("/login");
            }
        }
    }, []);



    return (
        <div ref={scrollContainerRef} className={theme?.layout?.contentWidth == 'boxed' ? 'container p-0':''} style={{height: '100%', overflow: 'auto'}}>
            {children}
            {theme?.layout?.enableScrollToTop && <IframeScrollToTop scrollRef={scrollContainerRef} />}
        </div>
    );
}
export const stopLoading = () => {
    const appLoading = document.getElementById('loading-bg')
    if(appLoading) appLoading.style.display = 'none';
}
export const startLoading = () => {
    const appLoading = document.getElementById('loading-bg')
    if(appLoading) appLoading.style.display = 'none';
}

export default LayoutIframe;