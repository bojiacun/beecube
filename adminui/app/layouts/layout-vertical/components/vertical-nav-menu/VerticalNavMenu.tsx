import ThemeContext from 'themeConfig';
import {useContext, useState} from "react";
import useAppConfig from "~/config";
import useVerticalNavMenu from "~/layouts/layout-vertical/components/vertical-nav-menu/useVerticalNavMenu";
import classNames from "classnames";
import {Image, NavLink} from "react-bootstrap";
import {X, Disc} from 'react-feather'
import {LinksFunction} from "@remix-run/node";
import PerfectScrollbar from "react-perfect-scrollbar";
import perfectScrollbarStyleUrl from 'react-perfect-scrollbar/dist/css/styles.css';
import verticalMenuStyleUrl from "~/styles/base/core/menu/menu-types/vertical-menu.css";
import VerticalNavMenuItems
    from "~/layouts/layout-vertical/components/vertical-nav-menu/components/vertical-nav-menu-items/VerticalNavMenuItems";
import navMenuItems from '~/navigation/vertical'

export const links: LinksFunction = () => {
    return [
        {rel: 'stylesheet', href: verticalMenuStyleUrl},
        {rel: 'stylesheet', href: perfectScrollbarStyleUrl},
    ];
}

const VerticalNavMenu = (props:any) => {
    const {startPageLoading, stopPageLoading} = props;
    const {theme} = useContext(ThemeContext);
    const {appName, appLogoImage} = theme.app;
    const {isVerticalMenuCollapsed, skin} = useAppConfig(theme);
    const {} = useVerticalNavMenu(props);
    const [shallShadowBottom, setShallShadowBottom] = useState<boolean>(false);
    const perfectScrollbarSettings = {
        maxScrollbarLength: 60,
        wheelPropagation: false,
    }

    return (
        <div className={classNames('main-menu menu-fixed menu-accordion menu-shadow',
            !isVerticalMenuCollapsed || (isVerticalMenuCollapsed) ? 'expanded':'', skin === 'dark' ? 'menu-dark':'menu-light')}
        >
            <div className={'navbar-header expanded'}>
                <ul className={'nav navbar-nav flex-row'}>
                    <li className={'nav-item mr-auto'}>
                        <NavLink href={'/'} className={'navbar-brand'}>
                            <span className={'brand-logo'}>
                                <Image src={appLogoImage} alt={'logo'} width={36} height={36} />
                            </span>
                            <h2 className={'brand-text'}>{appName}</h2>
                        </NavLink>
                    </li>
                    <li className="nav-item nav-toggle">
                        <NavLink className={'nav-link modern-nav-toggle'}>
                            <X size={20} className={'d-none d-xl-none'} />
                            <Disc size={20} className={'d-none d-xl-block collapse-toggle-icon'} />
                        </NavLink>
                    </li>
                </ul>
            </div>

            <div className={classNames("shadow-bottom", shallShadowBottom ? 'd-block':'')} />

            <PerfectScrollbar onScrollY={evt => setShallShadowBottom(evt.scrollTop > 0)} className={'main-menu-content scroll-area'} component={'div'} options={perfectScrollbarSettings}>
                <VerticalNavMenuItems startPageLoading={startPageLoading} stopPageLoading={stopPageLoading} className={'navigation navigation-main'} items={navMenuItems} />
            </PerfectScrollbar>
        </div>
    );
}


export default VerticalNavMenu;