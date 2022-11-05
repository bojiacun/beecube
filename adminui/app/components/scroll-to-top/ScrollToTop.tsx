import {Button} from "react-bootstrap";
import {ArrowUp} from 'react-feather';
import {useScroll} from "react-use";
import classNames from "classnames";
import stylesUrl from '~/styles/base/components/scroll-to-top.css';
import {LinksFunction} from "@remix-run/node";
import {useRef} from "react";

export const links: LinksFunction = () => {
    return [{rel: 'stylesheet', href: stylesUrl}];
}

const ScrollToTop = () => {
    const scrollContainerRef = useRef<any>();
    const {y} = useScroll(scrollContainerRef);
    console.log('scroll y is',y);
    const handleScrollToTop = () => {
        const rootEle = document.documentElement
        rootEle.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }
    return (
        <div ref={scrollContainerRef} onClick={handleScrollToTop} className={classNames('btn-scroll-to-top', y > 50 ? 'show':'')}>
            <Button variant={'primary'} className={'btn-icon'}>
                <ArrowUp size={16} />
            </Button>
        </div>
    );
}

export default ScrollToTop;