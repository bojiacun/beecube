import {canViewVerticalNavMenuHeader} from "~/libs/acl/utils";
import {MoreHorizontal} from "react-feather";


const VerticalNavMenuHeader = (props:any) => {
    if(canViewVerticalNavMenuHeader(props.item)) {
        return (
            <li className={'navigation-header text-truncate'}>
                <span>{props.item.header}</span>
                <MoreHorizontal size={18} />
            </li>
        );
    }
    return (
        <>
            <span>{props.item.header}</span>
            <MoreHorizontal size={18} />
        </>
    );
}

export default VerticalNavMenuHeader;
