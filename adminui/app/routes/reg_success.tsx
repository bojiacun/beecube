import {LinksFunction} from "@remix-run/node";
import loginPageStyleUrl from "~/styles/page-auth.css";
import {Col, NavLink, Row} from "react-bootstrap";
import SystemLogo from "~/components/logo";

export const links: LinksFunction = () => {
    return [{rel: 'stylesheet', href: loginPageStyleUrl}];
}


const RegisterPage = () => {

    return (
        <div className={'auth-wrapper auth-v2'}>
            <Row className={'auth-inner m-0'}>
                <NavLink className={'brand-logo'}>
                    <SystemLogo/>
                    <h2 className="brand-text text-primary">
                        蜜蜂魔方
                    </h2>
                </NavLink>
                <Col md={12} className="d-flex flex-column align-items-center justify-content-center px-2 p-lg-5">
                    <span style={{color: 'green', fontSize: 96}}>
                        <i className="feather icon-check-circle"></i>
                    </span>
                    <h1>注册成功，稍后售前会联系您，请保持手机畅通</h1>
                    <h5><a href={'/login'}>返回登录页</a></h5>
                </Col>
            </Row>
        </div>
    );
}

export default RegisterPage;