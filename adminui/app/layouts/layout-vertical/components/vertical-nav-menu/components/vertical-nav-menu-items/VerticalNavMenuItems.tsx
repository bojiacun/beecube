import {resolveVerticalNavMenuItemComponent} from "~/layouts/utils";
import {FC} from "react";

type VerticalNavMenuItemsProps = {
    items?: any[];
    className?: string;
}

const VerticalNavMenuItems: FC<VerticalNavMenuItemsProps> = (props) => {
    const {items, className} = props;
    return (
        <ul className={className}>
            {items&&items.map((item:any)=>{
                let Component = resolveVerticalNavMenuItemComponent(item);
                return <Component key={item.title || item.header} item={item} />
            })}
        </ul>
    );
}

export default VerticalNavMenuItems;