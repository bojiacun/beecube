/*

注意：水平导航菜单中不支持标签

对象数组

顶层对象可以为：
2.组（组中必须有导航子项）
3.导航项

*支持的选项

/--- 导航组 (顶层标题组) ---/
title
icon
children

/--- 导航项 (顶层标题链接) ---/
icon
title
route: [route_obj/route_name]

*/
import dashboard from './dashboard'
import apps from './apps'
import pages from './pages'
import chartsAndMaps from './charts-and-maps'
import uiElements from './ui-elements'
import formAndTable from './forms-and-table'
import others from './others'

// 部件名数组
export default [...dashboard, ...apps, ...uiElements, ...formAndTable, ...pages, ...chartsAndMaps, ...others]
