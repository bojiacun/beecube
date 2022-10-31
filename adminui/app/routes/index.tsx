import {Button} from "react-bootstrap";
import {useContext, useState} from "react";
import LayoutHorizontal, {links as LayoutHorizontalLinks} from "~/layouts/layout-horizontal/LayoutHorizontal";
import {LinksFunction} from "@remix-run/node";
import ThemeContext from 'themeConfig';
import useAppConfig from "~/config";
import LayoutVertical, {links as LayoutVerticalLinks} from "~/layouts/layout-vertical/LayoutVertical";

export const links: LinksFunction = () => {
    const {theme} = useContext(ThemeContext);
    const {layoutType} = useAppConfig(theme);
    if(layoutType == 'vertical') {
        return [
            ...LayoutVerticalLinks(),
        ];
    }
    return [
        ...LayoutHorizontalLinks(),
    ];
}


export default function Index() {
    const [count, setCount] = useState<number>(0);
    const {theme} = useContext(ThemeContext);
    const {layoutType} = useAppConfig(theme);
    const Layout = layoutType == 'vertical' ? LayoutVertical : LayoutHorizontal;

    const handleOnClick = () => {
        setCount(v => v+1);
    }
    return (
        <Layout>
            <h1>Welcome to Remix {count}</h1>
            <Button variant={'danger'} onClick={handleOnClick}>测试按钮</Button>
        </Layout>
    );
}
