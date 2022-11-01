import classNames from "classnames";
import {canViewVerticalNavMenuLink} from "~/libs/acl/utils";
import {Nav, Badge} from "react-bootstrap";
import {Circle} from 'react-feather';


const VerticalNavMenuLink = (props:any) => {
    console.log('link props is', props);
    const {item} = props;
    if(canViewVerticalNavMenuLink(item)) {
        return (
            <li className={classNames('nav-item', item.disabled ? 'disabled' : '',)}>
                <Nav.Link className={'d-flex align-items-center'}>
                    <Circle />
                    <span className="menu-title text-truncate">{item.title}</span>
                    {item.tag && <Badge className={'mr-1 ml-auto'} pill={true} variant={item.tagVariant||'primary'}>{item.tag}</Badge>}
                </Nav.Link>
            </li>
        );
    }
    return <></>
}

export default VerticalNavMenuLink;