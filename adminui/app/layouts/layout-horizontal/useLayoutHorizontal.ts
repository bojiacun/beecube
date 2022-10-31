import classNames from "classnames/dedupe";


export default function useLayoutHorizontal(navbarMenuType: any, footerType: any, isVerticalMenuActive: any, currentBreakPoint = 'md') {
    const classes = [];
    if(currentBreakPoint === 'xl') {
        classes.push('horizontal-menu');
    }
    else {
        classes.push('vertical-overlay-menu');
        classes.push(isVerticalMenuActive ? 'menu-open' : 'menu-hide')
    }
    // 副导航栏
    classes.push(`navbar-${navbarMenuType}`)

    // 页脚
    if (footerType === 'sticky') classes.push('footer-fixed')
    if (footerType === 'static') classes.push('footer-static')
    if (footerType === 'hidden') classes.push('footer-hidden')

    let navbarMenuTypeClass = 'floating-nav';
    if (navbarMenuType === 'sticky') navbarMenuTypeClass ='fixed-top';
    if (navbarMenuType === 'static') navbarMenuTypeClass = '';
    if (navbarMenuType === 'hidden') navbarMenuTypeClass = 'd-none';

    let footerTypeClass = '';
    if (footerType === 'static') footerTypeClass = 'footer-static';
    if (footerType === 'hidden') footerTypeClass = 'd-none';

    return {
        layoutClasses: classes,
        navbarMenuTypeClass,
        footerTypeClass
    }
}