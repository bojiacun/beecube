import React, {useContext} from "react";
import ThemeContext from 'themeConfig';


const LayoutFull: React.FC<any> = (props:any) => {
    const {children} = props;
    const themeContext = useContext(ThemeContext);
    console.log(themeContext);
    return (
        <div>
            {children}
        </div>
    );
}

export default LayoutFull;