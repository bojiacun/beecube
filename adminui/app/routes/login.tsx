import {ActionFunction, json, LinksFunction, LoaderFunction, redirect} from "@remix-run/node";
import loginPageStyleUrl from 'app/styles/react/pages/page-auth.css';
import {
    Row,
    NavLink,
    Col,
    Image,
    Card,
    Alert,
    OverlayTrigger,
    Tooltip,
    Form,
    Button,
    InputGroup
} from "react-bootstrap";
import SystemLogo from "~/components/logo";
import {useContext, useEffect, useState} from "react";
import ThemeContext from 'themeConfig';
import lightSideImageUrl from 'assets/images/pages/login-v2.svg';
import darkSideImageUrl from 'assets/images/pages/login-v2-dark.svg';
import {Eye, HelpCircle} from "react-feather";

import {useLoaderData, useTransition, Form as RemixForm} from "@remix-run/react";
import {auth, sessionStorage} from '~/utils/auth.server';
import classNames from "classnames";
import {API_CAPTCHA, LOGIN_SUCCESS_URL} from "~/utils/request.server";
import axios from "axios";
import {API_CAPTCHA_URL} from "~/utils/request.client";
const randomstring = require('randomstring');


type LoaderData = {
    checkKey: any;
    captchaImageData: string;
    error: { message: string } | null;
};



export const links: LinksFunction = () => {
    return [{rel: 'stylesheet', href: loginPageStyleUrl}];
}

export const action: ActionFunction = async ({request}) => {
    await auth.authenticate("form", request, {successRedirect: LOGIN_SUCCESS_URL, failureRedirect: '/login'});
}

export const loader: LoaderFunction = async ({request}) => {
    await auth.isAuthenticated(request, {successRedirect: LOGIN_SUCCESS_URL});
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    const error = session.get(auth.sessionErrorKey) as LoaderData['error'];
    session.unset(auth.sessionErrorKey);
    let randomString = randomstring.generate(12);
    let imageUrl = API_CAPTCHA+'/'+randomString+'?_t='+randomString;
    const res = await fetch(imageUrl);
    let result = await res.json();
    return json({captchaImageData: result.result, checkKey: randomString, error: error}, {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session),
        },
    });
}

export function ErrorBoundary({error}: { error: Error }) {
    console.log(error);
    return (<p>There is a error happened.</p>);
}

const LoginPage = () => {
    const {theme} = useContext(ThemeContext);
    const loaderData = useLoaderData<LoaderData>();
    const transition = useTransition();
    const [captchaData, setCaptchaData] = useState<string>(loaderData.captchaImageData);
    const [validated, setValidated] = useState<boolean>(false);


    let sideImageUrl = lightSideImageUrl;
    if (theme.layout.skin == 'dark') {
        sideImageUrl = darkSideImageUrl;
    }
    useEffect(()=>{
        const appLoading = document.getElementById('loading-bg')
        if (appLoading) {
            appLoading.style.display = 'none'
        }
    }, []);
    const handleCaptchaClick = () => {
        let randomStr = randomstring.generate(8);
        axios.get(API_CAPTCHA_URL + '/' + loaderData.checkKey + '?_t=' + randomStr).then(res => {
            setCaptchaData(res.data.result);
        });
    }
    const handleOnSubmit = async (e:any) => {
        let form = e.currentTarget;
        if(form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        }
        setValidated(true);
    }
    // @ts-ignore
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
                        <Image fluid={true} src={sideImageUrl} alt={'用户登录'}/>
                    </div>
                </Col>
                <Col lg={4} className="d-flex align-items-center auth-bg px-2 p-lg-5">
                    <Col lg={12} sm={8} md={6} className="px-xl-2 mx-auto">
                        <Card.Title className="mb-1 font-weight-bold" style={{fontSize: '1.714rem'}}>
                            登录蜜蜂魔方
                        </Card.Title>
                        <Card.Text>
                            请登录您的帐户开始体验
                        </Card.Text>
                        <Alert variant='primary' show>
                            <div className="alert-body font-small-2">
                                <p>
                                    <small className="mr-50"><span
                                        className="font-weight-bold">管理员:</span> admin@demo.com 密码: admin</small>
                                </p>
                                <p>
                                    <small className="mr-50"><span
                                        className="font-weight-bold">客户:</span> client@demo.com 密码: client</small>
                                </p>
                            </div>
                            <OverlayTrigger placement={'top'}
                                            overlay={<Tooltip id={'help'}>管理员和客户账号登录后体验不一样哦</Tooltip>}>
                                <HelpCircle size={18} className='position-absolute' style={{top: 10, right: 10}} />
                            </OverlayTrigger>
                        </Alert>
                        {loaderData.error && <Alert variant='danger'>
                            <div className="alert-body font-small-2">
                                <p>
                                    <small className="mr-50">{loaderData.error.message}</small>
                                </p>
                            </div>
                        </Alert>}
                        <RemixForm noValidate className={classNames("auth-login-form mt-2", validated ? 'was-validated':'')} method='post' onSubmit={handleOnSubmit}>
                            <Form.Group>
                                <Form.Label htmlFor={'username'}>用户名</Form.Label>
                                <Form.Control name='username' placeholder={'邮箱或者手机号'} required  />
                            </Form.Group>
                            <Form.Group>
                                <div className="d-flex justify-content-between">
                                    <Form.Label htmlFor="password">密码</Form.Label>
                                    <NavLink href="forgot-password">
                                        <small>忘记密码?</small>
                                    </NavLink>
                                </div>
                                <InputGroup className="input-group-merge">
                                    <Form.Control name='password' type='password' className='form-control-merge'
                                                  placeholder={'abc123'} required  />
                                    <InputGroup.Append>
                                        <InputGroup.Text>
                                            <Eye className='cursor-pointer' size={14}/>
                                        </InputGroup.Text>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Form.Group>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label htmlFor={'captcha'}>验证码</Form.Label>
                                    <Form.Control name='captcha' placeholder={'验证码'} required  />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>&nbsp;</Form.Label>
                                    <Image onClick={handleCaptchaClick} src={captchaData} className='cursor-pointer' alt='验证码' style={{display: 'block'}} />
                                </Form.Group>
                            </Form.Row>
                            <Form.Control type={'hidden'} name={'checkKey'} value={loaderData.checkKey} />
                            <Button block className='mt-1' variant={'primary'} type={'submit'} disabled={!!transition.submission}>{transition.submission? '登录中...':'登 录'}</Button>
                        </RemixForm>
                    </Col>
                </Col>
            </Row>
        </div>
    );
}

export default LoginPage;