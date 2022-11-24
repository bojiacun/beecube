import Select from "react-select";
import React, {useContext} from "react";
import themeContext from 'themeConfig';




const ReactSelectThemed = React.forwardRef((props:any, ref) => {
    const {theme:systemTheme} = useContext(themeContext);
    const {id, ...rest} = props;

    return (
        <Select
            ref={ref}
            instanceId={id}
            theme={(theme)=>{
                if(systemTheme.layout.skin === 'dark') {
                    theme.colors.neutral0 = '#161d31';
                    theme.colors.neutral20 = '#3b4253';
                    theme.colors.neutral80 = '#b4b7bd';
                }
                else {
                    theme.colors.neutral0 = 'hsl(0, 0%, 100%)';
                    theme.colors.neutral20 = 'hsl(0, 0%, 80%)';
                    theme.colors.neutral80 = 'hsl(0, 0%, 20%)';
                }
                return theme;
            }}
            {...rest}
        />
    );
});

export default ReactSelectThemed;