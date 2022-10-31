import ThemeContext from 'themeConfig';
import {useContext} from "react";
import useAppConfig from "~/config";
import useLayoutHorizontal from "~/layouts/layout-horizontal/useLayoutHorizontal";
import classNames from "classnames/dedupe";
import {LinksFunction} from "@remix-run/node";
import borderedLayoutStyleUrl from '~/styles/base/themes/bordered-layout.css';


export const links: LinksFunction = () => {
    return [{rel: 'stylesheet', href: borderedLayoutStyleUrl}];
}
const LayoutHorizontal = (props:any) => {
    const {children} = props;
    const {theme} = useContext(ThemeContext);
    const {skin, isVerticalMenuActive, navbarType, footerType, isNavMenuHidden, routerTransition} = useAppConfig(theme);
    const {layoutClasses} = useLayoutHorizontal(navbarType, footerType, isVerticalMenuActive);
    return (
        <div className={classNames('horizontal-layout', layoutClasses)} data-col={isNavMenuHidden ? '1-column' : null} style={{height: 'inherit'}}>
            {children}
        </div>
    );
}


export default LayoutHorizontal;