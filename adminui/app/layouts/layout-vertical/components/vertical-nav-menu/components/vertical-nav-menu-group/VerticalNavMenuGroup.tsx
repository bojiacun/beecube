import useVerticalNavMenuGroup from "./useVerticalNavMenuGroup";
import {canViewVerticalNavMenuGroup} from "~/libs/acl/utils";
import classNames from "classnames";
import {Nav, Badge, Navbar} from "react-bootstrap";
import {Circle} from 'react-feather';
import {resolveVerticalNavMenuItemComponent} from "~/layouts/utils";


const VerticalNavMenuGroup = (props:any) => {
    const {item} = props;
    const {isOpen, isActive} = useVerticalNavMenuGroup(props.item);

    if(canViewVerticalNavMenuGroup(props.item)) {
        return (
            <li className={classNames('nav-item has-sub', isOpen ? 'open':'', item.disabled ? 'disabled':'', isActive ? 'sidebar-group-active':'')}>
                <Nav.Link className={'d-flex align-items-center'}>
                    <Circle />
                    <span className={'menu-title text-truncate'}>{item.title}</span>
                    {item.tag && <Badge className={'mr-1 ml-auto'} pill={true} variant={item.tagVariant||'primary'}>{item.tag}</Badge>}
                </Nav.Link>
                <Navbar.Collapse className={'menu-content'} as={'ul'}>
                    {item.children.map((child:any)=>{
                        const Component = resolveVerticalNavMenuItemComponent(child);
                        return <Component key={child.header || child.title} />;
                    })}
                </Navbar.Collapse>
            </li>
        );
    }
    return <></>;
}

export default VerticalNavMenuGroup;