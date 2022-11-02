import classNames from "classnames";
import {canViewVerticalNavMenuLink} from "~/libs/acl/utils";
import {Nav, Badge} from "react-bootstrap";
import {Circle} from 'react-feather';
import React from "react";
import {useTranslation} from "react-i18next";
const feather = require('feather-icons');


const VerticalNavMenuLink = (props:any) => {
    const {item} = props;
    const {t} = useTranslation();

    const renderItemIcon = (item:any) => {
        if(item.icon) {
            let icon = item.icon.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
            return <span dangerouslySetInnerHTML={{__html: feather.icons[icon].toSvg({width: 14, height: 14})}} />;
        }
        return <Circle />;
    }
    if(canViewVerticalNavMenuLink(item)) {
        return (
            <li className={classNames('nav-item', item.disabled ? 'disabled' : '',)}>
                <Nav.Link className={'d-flex align-items-center'}>
                    {renderItemIcon(item)}
                    <span className="menu-title text-truncate">{t(item.title)}</span>
                    {item.tag && <Badge className={'mr-1 ml-auto'} pill={true} variant={item.tagVariant||'primary'}>{item.tag}</Badge>}
                </Nav.Link>
            </li>
        );
    }
    return <></>
}

export default VerticalNavMenuLink;