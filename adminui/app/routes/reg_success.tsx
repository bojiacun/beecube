import {ActionFunction, LinksFunction} from "@remix-run/node";
import loginPageStyleUrl from "~/styles/page-auth.css";
import {Alert, Button, Card, Col, Form, Image, InputGroup, NavLink, Row} from "react-bootstrap";
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
                <Col md={12} className="d-flex align-items-center px-2 p-lg-5">
                </Col>
            </Row>
        </div>
    );
}

export default RegisterPage;