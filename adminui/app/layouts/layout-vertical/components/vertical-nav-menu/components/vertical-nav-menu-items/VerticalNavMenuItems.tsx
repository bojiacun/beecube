import {resolveVerticalNavMenuItemComponent} from "~/layouts/utils";
import {FC} from "react";

type VerticalNavMenuItemsProps = {
    items?: any[];
    className?: string;
}

const VerticalNavMenuItems: FC<VerticalNavMenuItemsProps> = (props) => {
    const {items} = props;
    return (
        <li>
            {items&&items.map((item:any)=>{
                let Component = resolveVerticalNavMenuItemComponent(item);
                console.log('item is ', Component, item);
                return <Component key={item.title || item.header} item={item} />
            })}
        </li>
    );
}

export default VerticalNavMenuItems;