import {Button} from "react-bootstrap";
import {ArrowUp} from 'react-feather';
import {useWindowScroll} from "react-use";
import classNames from "classnames";
import stylesUrl from '~/styles/scroll-to-top.css';
import {LinksFunction} from "@remix-run/node";

export const links: LinksFunction = () => {
    return [{rel: 'stylesheet', href: stylesUrl}];
}

const ScrollToTop = (props:any) => {
    const {y} = useWindowScroll();

    const handleScrollToTop = () => {
        const rootEle = document.documentElement
        rootEle.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }
    return (
        <div onClick={handleScrollToTop} className={classNames('btn-scroll-to-top', y > 50 ? 'show':'')}>
            <Button variant={'primary'} className={'btn-icon'}>
                <ArrowUp size={16} />
            </Button>
        </div>
    );
}

export default ScrollToTop;