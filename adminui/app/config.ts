

export default function useAppConfig(theme:any) {
    return {
        isNavMenuHidden: theme.layout.menu.hidden,
        currentBreakPoint: 'md',
        navbarType: theme.layout.navbar.type,
        footerType: theme.layout.footer.type,
        isVerticalMenuActive: false,
        skin: theme.layout.skin,
        routerTransition: theme.layout.routerTransition,
    };
}