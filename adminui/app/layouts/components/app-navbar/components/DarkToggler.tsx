import {Nav} from "react-bootstrap";
import {Sun, Moon} from 'react-feather';
import ThemeContext from 'themeConfig';
import {useContext} from "react";
import useAppConfig from "~/config";


const DarkToggler = (props:any) => {
    const {className} = props;
    const {theme} = useContext(ThemeContext);
    const {skin} = useAppConfig(theme);
    const isDark = skin === 'dark';
    return (
        <Nav.Item className={className} as={'li'}>
            {isDark ? <Sun size={21} />: <Moon size={21} />}
        </Nav.Item>
    );
}

export default DarkToggler;