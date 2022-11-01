

/*
* 根据数据 / 上下文返回要渲染的组件
* @param {Object} item 导航菜单项
*/
export const resolveVerticalNavMenuItemComponent = (item: any) => {
    if (item.header) return 'vertical-nav-menu-header'
    if (item.children) return 'vertical-nav-menu-group'
    return 'vertical-nav-menu-link'
}