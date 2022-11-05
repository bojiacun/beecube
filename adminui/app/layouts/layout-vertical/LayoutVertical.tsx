import {LinksFunction} from "@remix-run/node";
import borderedLayoutStyleUrl from "~/styles/base/themes/bordered-layout.css";
import classNames from "classnames";
import {FC, useContext, useEffect, useState} from "react";
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
import {getCurrentUser} from "~/utils/reqeust";
import {useNavigate} from "@remix-run/react";
import LayoutContentRendererIframe
    from "~/layouts/components/layout-content-iframe-renderer/LayoutContentRendererIframe";


export const links: LinksFunction = () => {
    return [...verticalNavMenuLinks(),{rel: 'stylesheet', href: borderedLayoutStyleUrl}];
}

export interface LayoutVerticalProps {
    requireLogin?: boolean;
    children?: any;
}


const LayoutVertical: FC<LayoutVerticalProps> = (props:any) => {
    const {children, requireLogin = true} = props;
    const {theme} = useContext(ThemeContext);
    const [appLoading, setAppLoading] = useState<boolean>(true);
    const {navbarType, footerType, isVerticalMenuCollapsed, isNavMenuHidden, navbarBackgroundColor, iframeContent} = useAppConfig(theme);
    const {layoutClasses, navbarTypeClass, overlayClasses, footerTypeClass} = useVerticalLayout(navbarType, footerType, 'xl', isVerticalMenuCollapsed);
    const navigate = useNavigate();
    //检验用户是否登录
    useEffect(()=>{
        if(requireLogin) {
            const userInfo = getCurrentUser();
            if(userInfo == null) {
                navigate('/login');
            }
            else {
                const appLoading = document.getElementById('loading-bg')
                if (appLoading) {
                    appLoading.style.display = 'none'
                    setAppLoading(false);
                }
            }
        }
    }, []);

    if(appLoading) return <></>

    const LayoutContentRenderer = !iframeContent ? LayoutContentRendererDefault: LayoutContentRendererIframe;

    return (
        <div className={classNames('vertical-layout h-100', layoutClasses)} data-col={isNavMenuHidden ? '1-column': null}>
            <Navbar variant={navbarBackgroundColor} className={classNames('header-navbar navbar navbar-shadow navbar-light align-items-center', navbarTypeClass)}>
                <AppNavbarVerticalLayout />
            </Navbar>
            {!isNavMenuHidden && <VerticalNavMenu />}
            {/*垂直导航菜单遮罩层*/}
            <div className={classNames('sidenav-overlay', overlayClasses)} />
                <LayoutContentRenderer>
                    {children}
                </LayoutContentRenderer>
            {/*页脚 */}
            <footer className={classNames('footer footer-light', footerTypeClass)}>
                <AppFooter />
            </footer>
        </div>
    );
}

export default LayoutVertical;