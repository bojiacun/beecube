import {json, LinksFunction, LoaderFunction} from "@remix-run/node";
import borderedLayoutStyleUrl from "~/styles/base/themes/bordered-layout.css";
import classNames from "classnames";
import React, {FC, useContext, useEffect} from "react";
import ThemeContext from "../../../themeConfig";
import useAppConfig from "~/config";
import useVerticalLayout from "~/layouts/layout-vertical/useLayoutVertical";
import {Navbar} from "react-bootstrap";
//@ts-ignore
import Fade from 'react-reveal/Fade';
import AppNavbarVerticalLayout from "~/layouts/components/app-navbar/AppNavbarVerticalLayout";
import VerticalNavMenu,{links as verticalNavMenuLinks} from "~/layouts/layout-vertical/components/vertical-nav-menu/VerticalNavMenu";
import AppFooter from "~/layouts/components/AppFooter";
import LayoutContentRendererDefault from "~/layouts/components/layout-content-renderer/LayoutContentRendererDefault";
import ScrollToTop, {links as scrollToTopStyle} from "~/components/scroll-to-top/ScrollToTop";
import {auth} from "~/utils/auth.server";
import ClipLoader from "react-spinners/ClipLoader";


export const links: LinksFunction = () => {
    return [...verticalNavMenuLinks(),...scrollToTopStyle(),{rel: 'stylesheet', href: borderedLayoutStyleUrl}];
}

export const loader: LoaderFunction = async ({request}) => {
    console.log("layout vertical loader");
    return json(await auth.isAuthenticated(request, {failureRedirect: '/login'}));
}

export interface LayoutVerticalProps extends Partial<any>{
    children?: any;
}


const LayoutVertical: FC<LayoutVerticalProps> = (props:any) => {
    const {children, startPageLoading, stopPageLoading} = props;
    const {theme} = useContext(ThemeContext);

    const {navbarType, footerType, isVerticalMenuCollapsed, isNavMenuHidden, navbarBackgroundColor, enableScrollToTop} = useAppConfig(theme);
    const {layoutClasses, navbarTypeClass, overlayClasses, footerTypeClass} = useVerticalLayout(navbarType, footerType, 'xl', isVerticalMenuCollapsed);

    return (
        <div className={classNames('vertical-layout h-100', layoutClasses)} data-col={isNavMenuHidden ? '1-column': null}>
            <Navbar variant={navbarBackgroundColor} className={classNames('header-navbar navbar navbar-shadow navbar-light align-items-center', navbarTypeClass)}>
                <AppNavbarVerticalLayout />
            </Navbar>
            {!isNavMenuHidden && <VerticalNavMenu startPageLoading={startPageLoading} stopPageLoading={stopPageLoading} />}
            {/*垂直导航菜单遮罩层*/}
            <div className={classNames('sidenav-overlay', overlayClasses)} />
                <LayoutContentRendererDefault>
                    {children}
                </LayoutContentRendererDefault>
            {/*页脚 */}
            <footer className={classNames('footer footer-light', footerTypeClass)}>
                <AppFooter />
            </footer>
            {enableScrollToTop && <ScrollToTop />}

        </div>
    );
}

export default LayoutVertical;