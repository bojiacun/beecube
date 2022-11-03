import useVerticalNavMenuGroup from "./useVerticalNavMenuGroup";
import {canViewVerticalNavMenuGroup} from "~/libs/acl/utils";
import classNames from "classnames";
import {Nav, Badge, Collapse} from "react-bootstrap";
import {Circle} from 'react-feather';
import {navLinkProps, resolveVerticalNavMenuItemComponent} from "~/layouts/utils";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useLocation} from "react-router";
const feather = require('feather-icons');


const groupIsActive = (item:any, linkProps:any, location: any) => {
    let isActive = false;
    item.children.forEach((i:any) => {
        if(i.href === location.pathname) {
            isActive = true;
        }
    })
    return isActive;
}

const VerticalNavMenuGroup = (props:any) => {
    const {item} = props;
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const {t} = useTranslation();
    const location = useLocation();
    const linkProps:any = navLinkProps(item)();
    const isActive = groupIsActive(item, linkProps, location);

    const renderItemIcon = (item:any) => {
        if(item.icon) {
            let icon = item.icon.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
            return <span dangerouslySetInnerHTML={{__html: feather.icons[icon].toSvg({width: 21, height: 21})}} />;
        }
        return <Circle />;
    }
    const updateGroupOpen = (open: boolean) => {
        setIsOpen(open);
        if(open) {
            setMenuOpen(open);
        }
    }
    if(canViewVerticalNavMenuGroup(item)) {
        return (
            <li className={classNames('nav-item has-sub', menuOpen? 'open':'', item.disabled ? 'disabled':'', isActive ? 'sidebar-group-active':'')}>
                <Nav.Link className={'d-flex align-items-center'} onClick={()=>updateGroupOpen(!isOpen)}>
                    {renderItemIcon(item)}
                    <span className={'menu-title text-truncate'}>{t(item.title)}</span>
                    {item.tag && <Badge className={'mr-1 ml-auto'} pill={true} variant={item.tagVariant||'primary'}>{item.tag}</Badge>}
                </Nav.Link>
                <Collapse in={isOpen} onExited={()=>setMenuOpen(false)}>
                    <ul className={classNames('menu-content')} id={item.title}>
                    {item.children.map((child:any)=>{
                        const Component = resolveVerticalNavMenuItemComponent(child);
                        return <Component key={child.header || child.title} item={child} />;
                    })}
                    </ul>
                </Collapse>
            </li>
        );
    }
    return <></>;
}

export default VerticalNavMenuGroup;