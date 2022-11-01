import ThemeContext from 'themeConfig';
import {useContext} from "react";
import useAppConfig from "~/config";
import classNames from "classnames";
//@ts-ignore
import Fade from 'react-reveal/Fade';

const LayoutContentRendererDefault = (props:any) => {
    const {children} = props;
    const {theme} = useContext(ThemeContext);
    const {shallShowOverlay, contentWidth} = useAppConfig(theme);
    return (
        <div className={classNames('app-content content', shallShowOverlay? 'show-overlay':'')}>
            <div className="content-overlay"/>
            <div className="header-navbar-shadow"/>
            <div className={classNames('content-wrapper', contentWidth === 'boxed' ? 'container p-0':'')}>
                <div className={'content-body'}>
                    <Fade bottom>
                        {children}
                    </Fade>
                </div>
            </div>
        </div>
    );
}
export default LayoutContentRendererDefault;