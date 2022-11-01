import {LinksFunction} from "@remix-run/node";
import borderedLayoutStyleUrl from "~/styles/base/themes/bordered-layout.css";
import classNames from "classnames";
import {useContext} from "react";
import ThemeContext from "../../../themeConfig";
import useAppConfig from "~/config";
import useVerticalLayout from "~/layouts/layout-vertical/useLayoutVertical";
import {Navbar} from "react-bootstrap";
import AppNavbarVerticalLayout from "~/layouts/components/app-navbar/AppNavbarVerticalLayout";
import VerticalNavMenu,{links as verticalNavMenuLinks} from "~/layouts/layout-vertical/components/vertical-nav-menu/VerticalNavMenu";
import AppFooter from "~/layouts/components/AppFooter";


export const links: LinksFunction = () => {
    return [...verticalNavMenuLinks(),{rel: 'stylesheet', href: borderedLayoutStyleUrl}];
}
const LayoutVertical = (props:any) => {
    const {children} = props;
    const {theme} = useContext(ThemeContext);
    const {navbarType, footerType, isVerticalMenuCollapsed, isNavMenuHidden, navbarBackgroundColor} = useAppConfig(theme);
    const {layoutClasses, navbarTypeClass, overlayClasses, footerTypeClass} = useVerticalLayout(navbarType, footerType, 'xl', isVerticalMenuCollapsed);
    return (
        <div className={classNames('vertical-layout h-100', layoutClasses)} data-col={isNavMenuHidden ? '1-column': null}>
            <Navbar variant={navbarBackgroundColor} className={classNames('header-navbar navbar navbar-shadow navbar-light align-items-center', navbarTypeClass)}>
                <AppNavbarVerticalLayout />
            </Navbar>
            {!isNavMenuHidden && <VerticalNavMenu />}
            <div className={classNames('sidenav-overlay', overlayClasses)} />
            {children}
            <footer className={classNames('footer footer-light', footerTypeClass)}>
                <AppFooter />
            </footer>
        </div>
    );
}

export default LayoutVertical;