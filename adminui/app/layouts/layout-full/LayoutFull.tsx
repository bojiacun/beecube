import React, {useContext} from "react";
import ThemeContext from 'themeConfig';


const LayoutFull: React.FC = (props:any) => {
    const themeContext = useContext(ThemeContext);

    const {children} = props;
    return (
        <div>
            {children}
        </div>
    );
}

export default LayoutFull;