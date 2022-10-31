import {Button} from "react-bootstrap";
import {useState} from "react";
import LayoutHorizontal, {links as LayoutHorizontalLinks} from "~/layouts/layout-horizontal/LayoutHorizontal";
import {LinksFunction} from "@remix-run/node";

export const links: LinksFunction = () => {
    return [
        ...LayoutHorizontalLinks(),
    ];
}


export default function Index() {
    const [count, setCount] = useState<number>(0);

    const handleOnClick = () => {
        setCount(v => v+1);
    }
    return (
        <LayoutHorizontal>
            <h1>Welcome to Remix {count}</h1>
            <Button variant={'danger'} onClick={handleOnClick}>测试按钮</Button>
        </LayoutHorizontal>
    );
}
