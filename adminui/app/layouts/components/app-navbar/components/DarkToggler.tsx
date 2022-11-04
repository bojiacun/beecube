import {Nav} from "react-bootstrap";
import {Sun, Moon} from 'react-feather';
import ThemeContext from 'themeConfig';
import {useContext} from "react";
import useAppConfig from "~/config";


const DarkToggler = (props:any) => {
    const {className} = props;
    const {theme, setThemeContext} = useContext(ThemeContext);
    const {skin} = useAppConfig(theme);
    const isDark = skin === 'dark';

    const updateThemeSkin = (newSkin:string) => {
        theme.layout.skin = newSkin;
        setThemeContext({...theme});
    }

    return (
        <Nav.Item className={className} as={'li'}>
            {isDark ? <Sun size={21} onClick={()=>updateThemeSkin('light')} />: <Moon size={21} onClick={()=>updateThemeSkin('dark')} />}
        </Nav.Item>
    );
}

export default DarkToggler;