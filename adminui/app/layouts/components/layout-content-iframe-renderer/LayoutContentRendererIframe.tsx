import ThemeContext from 'themeConfig';
import {useContext, useEffect, useRef} from "react";
import useAppConfig from "~/config";
import classNames from "classnames";

const LayoutContentRendererIframe = () => {
    const {theme} = useContext(ThemeContext);
    const {shallShowOverlay, contentWidth} = useAppConfig(theme);
    const iframeStyles = {maxHeight: 'calc(100% - 3.35rem)', overflow: 'hidden', height: 'calc(100% - 3.35rem)'};
    const iframeRef = useRef<any>();

    useEffect(()=>{
        if(iframeRef.current) {
            iframeRef.current.contentWindow.postMessage(theme, '*');
        }
    }, [theme]);

    return (
        <div className={classNames('app-content content', shallShowOverlay? 'show-overlay':'')} style={iframeStyles}>
            <div className="content-overlay" style={{height: '100%'}} />
            <div className="header-navbar-shadow"/>
            <div className={classNames('content-wrapper', contentWidth === 'boxed' ? 'container p-0':'')} style={{height: '100%'}}>
                <div className={'content-body'} style={{height: '100%'}}>
                    <iframe ref={iframeRef} name={'content-body'} id={'content-body'} style={{height: '100%', width: '100%', border: 'none'}}>
                    </iframe>
                </div>
            </div>
        </div>
    );
}
export default LayoutContentRendererIframe;