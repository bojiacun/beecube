import {LinksFunction} from "@remix-run/node";
import borderedLayoutStyleUrl from "~/styles/base/themes/bordered-layout.css";
import classNames from "classnames";
import {useContext} from "react";
import ThemeContext from "../../../themeConfig";
import useAppConfig from "~/config";
import useVerticalLayout from "~/layouts/layout-vertical/useLayoutVertical";


export const links: LinksFunction = () => {
    return [{rel: 'stylesheet', href: borderedLayoutStyleUrl}];
}
const LayoutVertical = (props:any) => {
    const {children} = props;
    const {theme} = useContext(ThemeContext);
    const {navbarType, footerType, isVerticalMenuCollapsed, isNavMenuHidden} = useAppConfig(theme);
    const {layoutClasses} = useVerticalLayout(navbarType, footerType, 'xl', isVerticalMenuCollapsed);
    return (
        <div className={classNames('vertical-layout h-100', layoutClasses)} data-col={isNavMenuHidden ? '1-column': null}>

        </div>
    );
}

export default LayoutVertical;