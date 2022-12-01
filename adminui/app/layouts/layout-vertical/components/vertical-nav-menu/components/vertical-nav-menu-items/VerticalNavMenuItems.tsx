import {resolveVerticalNavMenuItemComponent} from "~/layouts/utils";
import {FC} from "react";

type VerticalNavMenuItemsProps = {
    items?: any[];
    className?: string;
    startPageLoading?: Function;
    stopPageLoading?: Function;
}

const VerticalNavMenuItems: FC<VerticalNavMenuItemsProps> = (props) => {
    const {items, className, startPageLoading, stopPageLoading} = props;
    return (
        <ul className={className}>
            {items&&items.map((item:any)=>{
                let Component = resolveVerticalNavMenuItemComponent(item);
                return <Component key={item.id || item.route || item.header} item={item} startPageLoading={startPageLoading} stopPageLoading={stopPageLoading} />
            })}
        </ul>
    );
}

export default VerticalNavMenuItems;