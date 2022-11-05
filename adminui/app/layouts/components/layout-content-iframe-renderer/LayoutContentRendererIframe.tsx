import ThemeContext from 'themeConfig';
import {useContext} from "react";
import useAppConfig from "~/config";
import classNames from "classnames";

const LayoutContentRendererIframe = (props:any) => {
    const {children} = props;
    const {theme} = useContext(ThemeContext);
    const {shallShowOverlay, contentWidth} = useAppConfig(theme);
    return (
        <div className={classNames('app-content content', shallShowOverlay? 'show-overlay':'')}>
            <div className="content-overlay"/>
            <div className="header-navbar-shadow"/>
            <div className={classNames('content-wrapper', contentWidth === 'boxed' ? 'container p-0':'')}>
                <div className={'content-body'}>
                    <iframe name={'content-body'} id={'content-body'} style={{height: '100%', width: '100%', border: 'none'}}>
                    </iframe>
                </div>
            </div>
        </div>
    );
}
export default LayoutContentRendererIframe;