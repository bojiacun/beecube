import {ActionFunction, LinksFunction} from "@remix-run/node";
import loginPageStyleUrl from "~/styles/page-auth.css";
import {auth} from "~/utils/auth.server";
import {LOGIN_SUCCESS_URL, LOGIN_URL} from "~/utils/request.server";
import {Alert, Button, Card, Col, Form, Image, InputGroup, NavLink, Row} from "react-bootstrap";
import SystemLogo from "~/components/logo";
import {Form as RemixForm, useNavigation} from "@remix-run/react";
import classNames from "classnames";
import {useState} from "react";

const randomstring = require('randomstring');
export const links: LinksFunction = () => {
    return [{rel: 'stylesheet', href: loginPageStyleUrl}];
}

export const action: ActionFunction = async ({request}) => {
    await auth.authenticate("form", request, {successRedirect: LOGIN_SUCCESS_URL, failureRedirect: LOGIN_URL});
}
const RegisterPage = () => {
    const [captchaKey, setCaptchaKey] = useState<string>();
    const transition = useNavigation();
    const [validated, setValidated] = useState<boolean>(false);
    const handleOnSubmit = async (e: any) => {
        let form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        }
        setValidated(true);
    }
    const handleCaptchaClick = () => {
        let randomStr = randomstring.generate(18);
        setCaptchaKey(randomStr);
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
                <Col md={12} className="d-flex align-items-center px-2 p-lg-5">
                    <Card className="p-xl-2 mx-auto" style={{width: 500}}>
                        <Card.Title className="mb-1 font-weight-bold" style={{fontSize: '1.714rem'}}>
                            登录蜜蜂魔方
                        </Card.Title>
                        <Card.Text>
                            请登录您的帐户开始体验
                        </Card.Text>
                        <RemixForm noValidate className={classNames("auth-login-form mt-2", validated ? 'was-validated' : '')} method='post' onSubmit={handleOnSubmit}>
                            <Form.Group className={'mb-1'}>
                                <Form.Label htmlFor={'username'}>用户名</Form.Label>
                                <Form.Control name='username' placeholder={'邮箱或者手机号'} required/>
                            </Form.Group>
                            <Form.Group className={'mb-1'}>
                                <Form.Label htmlFor="password">密码</Form.Label>
                                <InputGroup className="input-group-merge">
                                    <Form.Control name='password' type='password' className='form-control-merge'
                                                  placeholder={'abc123'} required/>
                                </InputGroup>
                            </Form.Group>
                            <Row>
                                <Form.Group as={Col}>
                                    <Form.Label htmlFor={'captcha'}>验证码</Form.Label>
                                    <Form.Control name='captcha' placeholder={'验证码'} required/>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>&nbsp;</Form.Label>
                                    {captchaKey && <Image onClick={handleCaptchaClick} src={`/captcha.png?_t=${captchaKey}`} className='cursor-pointer' alt='验证码'
                                                          style={{display: 'block'}}/>}
                                </Form.Group>
                            </Row>
                            {captchaKey && <Form.Control type={'hidden'} name={'checkKey'} value={captchaKey}/>}
                            <Row>
                                <Col className={'d-grid'}>
                                    <Button className='mt-1' variant={'primary'} type={'submit'}
                                            disabled={transition.state === 'submitting'}>{transition.state === 'submitting' ? '登录中...' : '登 录'}</Button>
                                </Col>
                            </Row>
                        </RemixForm>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default RegisterPage;