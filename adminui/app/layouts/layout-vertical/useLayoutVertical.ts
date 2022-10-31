
export default function useVerticalLayout(navbarType: any, footerType:any, currentBreakpoint = 'xl', isVerticalMenuCollapsed = false) {
    let isVerticalMenuActive = true;
    const toggleVerticalMenuActive = () => {
        isVerticalMenuActive = !isVerticalMenuActive
    }
    const classes = [];
    if(currentBreakpoint === 'xl') {
        classes.push('vertical-menu-modern')
        classes.push(isVerticalMenuCollapsed ? 'menu-collapsed' : 'menu-expanded');
    }
    else {
        classes.push('vertical-overlay-menu')
        classes.push(isVerticalMenuActive? 'menu-open' : 'menu-hide')
    }
    // 副导航栏
    classes.push(`navbar-${navbarType}`)
    const overlayClasses = () => {
        if (currentBreakpoint !== 'xl' && isVerticalMenuActive ) return 'show'
        return null
    };
    const navbarTypeClass = () => {
        if (navbarType.value === 'sticky') return 'fixed-top'
        if (navbarType.value === 'static') return 'navbar-static-top'
        if (navbarType.value === 'hidden') return 'd-none'
        return 'floating-nav'
    };
    const footerTypeClass = () => {
        if (footerType.value === 'static') return 'footer-static'
        if (footerType.value === 'hidden') return 'd-none'
        return ''
    };
    const resizeHandler = () => {
        // ! 当窗口宽度为 'xs' 时判定为移动端，将关闭垂直菜单。可调整 sass 改变判定断点（不建议）
        if (window.innerWidth >= 1200) currentBreakpoint = 'xl'
        else if (window.innerWidth >= 992) currentBreakpoint = 'lg'
        else if (window.innerWidth >= 768) currentBreakpoint = 'md'
        else if (window.innerWidth >= 576) currentBreakpoint = 'sm'
        else currentBreakpoint = 'xs'
    }
    return {
        isVerticalMenuActive,
        toggleVerticalMenuActive,
        isVerticalMenuCollapsed,
        layoutClasses: classes,
        overlayClasses: overlayClasses(),
        navbarTypeClass: navbarTypeClass(),
        footerTypeClass: footerTypeClass(),
        resizeHandler,
    }
}