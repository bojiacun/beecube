import {Button} from "react-bootstrap";
import {ArrowUp} from 'react-feather';
import {useScroll, useWindowScroll} from "react-use";
import classNames from "classnames";
import stylesUrl from '~/styles/base/components/scroll-to-top.css';
import {LinksFunction} from "@remix-run/node";
import {FC} from "react";

export const links: LinksFunction = () => {
    return [{rel: 'stylesheet', href: stylesUrl}];
}

export interface IFrameScrollToTopProps {
    scrollRef: any;
}

const IFrameScrollToTop: FC<IFrameScrollToTopProps> = (props) => {
    const {y} = useScroll(props.scrollRef);

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

export default IFrameScrollToTop;