import React, {useContext} from "react";
import ThemeContext from 'themeConfig';


const LayoutFull: React.FC<any> = (props:any) => {
    const {children} = props;
    const {theme} = useContext(ThemeContext);
    console.log(theme);
    return (
        <div className={theme.layout.contentWidth == 'boxed' ? 'container p-0':''}>
            {children}
        </div>
    );
}

export default LayoutFull;