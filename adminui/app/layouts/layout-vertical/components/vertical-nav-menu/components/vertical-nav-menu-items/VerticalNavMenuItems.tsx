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
                const Component = resolveVerticalNavMenuItemComponent(item);
                return <Component key={item.title || item.header} item={item} />
            })}
        </li>
    );
}

export default VerticalNavMenuItems;