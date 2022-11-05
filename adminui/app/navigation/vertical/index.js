/*

对象数组

顶层对象可以为：
1.标题
2.组（组中必须有导航子项）
3.导航项

*支持的选项

/--- 标题 ---/
header

/--- 导航组 ---/
title
icon
tag
tagVariant
children

/--- 导航项 ---/
icon
title
route: [route_obj/route_name]
tag
tagVariant

*/
import dashboard from './dashboard'
import appsAndPages from './apps-and-pages'
import others from './others'
import chartsAndMaps from './charts-and-maps'
import uiElements from './ui-elements'
import formAndTable from './forms-and-table'
import systemPages from './system-pages';

// 部件名数组
export default [...dashboard, ...appsAndPages, ...uiElements, ...formAndTable, ...chartsAndMaps, ...others, ...systemPages]
