import {FC} from "react";


export interface DividerProps extends Partial<any>{
    color?: string;
    height?: number;
    margin?: number;
}

const Divider: FC<DividerProps> = (props) => {
    const {color = '#ccc', height = 1, margin = 10} = props;

    return (
        <div style={{width: '100%', height: height, backgroundColor: color, marginTop: margin, marginBottom: margin}}></div>
    );
}


export default Divider;