import useVerticalNavMenuGroup from "./useVerticalNavMenuGroup";
import {canViewVerticalNavMenuGroup} from "~/libs/acl/utils";
import classNames from "classnames";
import {Nav, Badge} from "react-bootstrap";
import {Circle} from 'react-feather';
import {resolveVerticalNavMenuItemComponent} from "~/layouts/utils";
import React from "react";
const feather = require('feather-icons');


const VerticalNavMenuGroup = (props:any) => {
    const {item} = props;
    const {isOpen, isActive} = useVerticalNavMenuGroup(props.item);
    const renderItemIcon = (item:any) => {
        if(item.icon) {
            let icon = item.icon.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
            return <span dangerouslySetInnerHTML={{__html: feather.icons[icon].toSvg({width: 21, height: 21})}} />;
        }
        return <Circle />;
    }
    if(canViewVerticalNavMenuGroup(item)) {
        return (
            <li className={classNames('nav-item has-sub', isOpen ? 'open':'', item.disabled ? 'disabled':'', isActive ? 'sidebar-group-active':'')}>
                <Nav.Link className={'d-flex align-items-center'}>
                    {renderItemIcon(item)}
                    <span className={'menu-title text-truncate'}>{item.title}</span>
                    {item.tag && <Badge className={'mr-1 ml-auto'} pill={true} variant={item.tagVariant||'primary'}>{item.tag}</Badge>}
                </Nav.Link>
                <ul className={'menu-content collapse'}>
                    {item.children.map((child:any)=>{
                        const Component = resolveVerticalNavMenuItemComponent(child);
                        return <Component key={child.header || child.title} item={child} />;
                    })}
                </ul>
            </li>
        );
    }
    return <></>;
}

export default VerticalNavMenuGroup;