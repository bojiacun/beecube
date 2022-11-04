import {Button} from "react-bootstrap";
import {ArrowUp} from 'react-feather';
import {useWindowScroll} from "beautiful-react-hooks";
import {useState} from "react";
import classNames from "classnames";


const ScrollToTop = () => {
    const [scrollY, setScrollY] = useState(window.scrollY);
    const onWindowScroll = useWindowScroll();
    onWindowScroll((event)=>{
        setScrollY(window.scrollY);
    });
    const handleScrollToTop = () => {
        const rootEle = document.documentElement
        rootEle.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }
    return (
        <div onClick={handleScrollToTop} className={classNames('btn-scroll-to-top', scrollY > 50 ? 'show':'')}>
            <Button variant={'primary'} className={'btn-icon'}>
                <ArrowUp size={16} />
            </Button>
        </div>
    );
}

export default ScrollToTop;