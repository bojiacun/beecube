import {FC} from "react";

export interface BootstrapFormListProps extends Partial<any>{
    list: any[];
}

const BootstrapFormList : FC<BootstrapFormListProps> = (props) => {
    const {list, children} = props;

    return (<>
        {list.map((item:any,index)=>{
            return children(item, index);
        })}
    </>);
}

export default BootstrapFormList;