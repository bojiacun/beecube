import {isObject} from "~/libs/acl/utils";
import VerticalNavMenuHeader
    from "~/layouts/layout-vertical/components/vertical-nav-menu/components/vertical-nav-menu-header/VerticalNavMenuHeader";
import VerticalNavMenuGroup
    from "~/layouts/layout-vertical/components/vertical-nav-menu/components/vertical-nav-menu-group/VerticalNavMenuGroup";
import VerticalNavMenuLink
    from "~/layouts/layout-vertical/components/vertical-nav-menu/components/vertical-nav-menu-link/VerticalNavMenuLink";

/*
* 根据数据 / 上下文返回要渲染的组件
* @param {Object} item 导航菜单项
*/
export const resolveVerticalNavMenuItemComponent = (item: any) => {
    if (item.header) return VerticalNavMenuHeader;
    if (item.children) return VerticalNavMenuGroup;
    return VerticalNavMenuLink;
}
/**
 *返回导航链接的路由名称。如果链接是字符串，链接将被认为是路由名称；如果链接是对象，它将解析对象并返回链接
 * @param {Object, String} link 导航链接对象 / 字符串
 */
export const resolveNavDataRouteName = (link:any) => {
    if (isObject(link.route)) {
        const { route } = link.route;
        return route.name
    }
    return link.route
}
/**
 * 检查导航链接是否激活
 * @param {Object} link 导航链接对象
 */
export const isNavLinkActive = (link:any) => {
    // 当前路由的匹配路由数组
    const matchedRoutes:any[] = [];

    // 检查提供的路由名是否与路由匹配
    const resolveRoutedName = resolveNavDataRouteName(link)

    if (!resolveRoutedName) return false

    return matchedRoutes.some(route => route.name === resolveRoutedName || route.meta.navActiveLink === resolveRoutedName)
}
/**
 * 检查导航是否分组
 * @param {Array} children 分组子级数组
 */
export const isNavGroupActive = (children:any) => {
    // 检查当前路由匹配数组
    const matchedRoutes:any[] = [];

    return children.some((child:any) => {
        // 如果子级中有子级则递归
        if (child.children) {
            return isNavGroupActive(child.children)
        }

        // 否则检查链接是否为匹配的路由
        //@ts-ignore
        return isNavLinkActive(child, matchedRoutes)
    })
}

/**
 * 返回使用的 b-link prop
 * @param {Object, String} item 数据中提供的导航路由名称或路由对象
 */
// prettier-ignore
export const navLinkProps = (item:any) => () => {
    const props = {}

    // 如果路由为字符串,则判定用路由名称创建路由对象；如果路由不为字符串，则直接返回路由对象
    if (item.route) {
        // @ts-ignore
        props.to = typeof item.route === 'string' ? item.route : item.route.name;
    }
    else {
        // @ts-ignore
        props.to = item.href
    }



    return props
}