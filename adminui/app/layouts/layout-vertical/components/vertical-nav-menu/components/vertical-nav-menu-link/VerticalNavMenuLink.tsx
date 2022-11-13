import classNames from "classnames";
import {canViewVerticalNavMenuLink} from "~/libs/acl/utils";
import {Badge, NavLink} from "react-bootstrap";
import {Circle} from 'react-feather';
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useLocation} from "react-router";
import {Link} from "@remix-run/react";


const feather = require('feather-icons');


const VerticalNavMenuLink = (props:any) => {
    const {item, startPageLoading} = props;
    const {t} = useTranslation();
    const location = useLocation();
    const isActive = location.pathname === '/'+item.route;


    const renderItemIcon = (item:any) => {
        if(item.icon) {
            let icon = item.icon.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
            return <span dangerouslySetInnerHTML={{__html: feather.icons[icon].toSvg({width: 14, height: 14})}} />;
        }
        return <Circle />;
    }
    const renderLink = (item:any) => {
        if(item.route && !item.target) {
            return (
                <Link className={'d-flex align-items-center'} to={item.route} onClick={()=> {
                    if(!isActive) {
                        startPageLoading();
                    }
                }}>
                    {renderItemIcon(item)}
                    <span className="menu-title text-truncate">{t(item.title)}</span>
                    {item.tag && <Badge className={'mr-1 ml-auto'} pill={true} variant={item.tagVariant||'primary'}>{item.tag}</Badge>}
                </Link>
            );
        }
        else {
            return (
                <NavLink className={'d-flex align-items-center'} href={item.route||item.href} target={item.target??''}>
                    {renderItemIcon(item)}
                    <span className="menu-title text-truncate">{t(item.title)}</span>
                    {item.tag && <Badge className={'mr-1 ml-auto'} pill={true} variant={item.tagVariant||'primary'}>{item.tag}</Badge>}
                </NavLink>
            );
        }
    }
    if(canViewVerticalNavMenuLink(item)) {
        return (
            <li id={'link-'+item.route} className={classNames('nav-item', item.disabled ? 'disabled' : '',isActive ? 'active': '')}>
                {renderLink(item)}
            </li>
        );
    }
    return <></>
}

export default VerticalNavMenuLink;