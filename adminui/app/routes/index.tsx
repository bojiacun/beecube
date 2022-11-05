import {useContext} from "react";
import LayoutHorizontal, {links as LayoutHorizontalLinks} from "~/layouts/layout-horizontal/LayoutHorizontal";
import {LinksFunction} from "@remix-run/node";
import ThemeContext from 'themeConfig';
import useAppConfig from "~/config";
import LayoutVertical, {links as LayoutVerticalLinks} from "~/layouts/layout-vertical/LayoutVertical";
import {Outlet} from "@remix-run/react";

export const links: LinksFunction = () => {
    return [
        ...LayoutVerticalLinks(),
        ...LayoutHorizontalLinks(),
    ];
}


export default function Index() {
    const {theme} = useContext(ThemeContext);
    const {layoutType} = useAppConfig(theme);
    const Layout = layoutType == 'vertical' ? LayoutVertical : LayoutHorizontal;


    return (
        <Layout requireLogin={true}>
            <Outlet />
        </Layout>
    );
}
