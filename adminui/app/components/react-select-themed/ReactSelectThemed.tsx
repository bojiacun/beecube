import Select from "react-select";
import {useContext} from "react";
import themeContext from 'themeConfig';


const ReactSelectThemed = (props:any) => {
    const {theme:systemTheme} = useContext(themeContext);

    return (
        <Select
            id={'react-select2'}
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
            {...props}
        />
    );
}

export default ReactSelectThemed;