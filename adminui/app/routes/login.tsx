import {LinksFunction} from "@remix-run/node";
import loginPageStyleUrl from 'app/styles/react/pages/page-auth.css';
import {Row, NavLink, Col, Image} from "react-bootstrap";
import SystemLogo from "~/components/logo";
import {useContext} from "react";
import ThemeContext from 'themeConfig';
import lightSideImageUrl from 'assets/images/pages/login-v2.svg';
import darkSideImageUrl from 'assets/images/pages/login-v2-dark.svg';

export const links: LinksFunction = () => {
    return [{rel: 'stylesheet', href: loginPageStyleUrl}];
}

const LoginPage = (props: any) => {
    const {theme} = useContext(ThemeContext);
    let sideImageUrl = lightSideImageUrl;
    if(theme.layout.skin == 'dark') {
        sideImageUrl = darkSideImageUrl;
    }
    return (
        <div className={'auth-wrapper auth-v2'}>
            <Row className={'auth-inner m-0'}>
                <NavLink className={'brand-logo'}>
                    <SystemLogo/>
                    <h2 className="brand-text text-primary">
                        蜜蜂魔方
                    </h2>
                </NavLink>
                <Col lg={8} className="d-none d-lg-flex align-items-center p-5">
                    <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
                        <Image fluid={true} src={sideImageUrl} alt={'用户登录'} />
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default LoginPage;