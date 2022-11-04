import {Button} from "react-bootstrap";
import {useContext, useState} from "react";
import LayoutHorizontal, {links as LayoutHorizontalLinks} from "~/layouts/layout-horizontal/LayoutHorizontal";
import {LinksFunction} from "@remix-run/node";
import ThemeContext from 'themeConfig';
import useAppConfig from "~/config";
import LayoutVertical, {links as LayoutVerticalLinks} from "~/layouts/layout-vertical/LayoutVertical";
import {useTranslation} from "react-i18next";
import {Outlet} from "@remix-run/react";

export const links: LinksFunction = () => {
    return [
        ...LayoutVerticalLinks(),
        ...LayoutHorizontalLinks(),
    ];
}


export default function Test() {
    const [count, setCount] = useState<number>(0);
    const {theme} = useContext(ThemeContext);
    const {layoutType} = useAppConfig(theme);
    const Layout = layoutType == 'vertical' ? LayoutVertical : LayoutHorizontal;
    const {t} = useTranslation();

    const handleOnClick = () => {
        setCount(v => v+1);
    }
    return (
        <Layout requireLogin={true}>
            <h1>Test page.Welcome to Remix {count}</h1>
            <Button variant={'danger'} onClick={handleOnClick}>{t('test_button')}</Button>
            <Outlet />
        </Layout>
    );
}
