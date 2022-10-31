import {LinksFunction} from "@remix-run/node";
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
import {useContext, useRef} from "react";
import ThemeContext from 'themeConfig';
import lightSideImageUrl from 'assets/images/pages/login-v2.svg';
import darkSideImageUrl from 'assets/images/pages/login-v2-dark.svg';
import {Eye, HelpCircle} from "react-feather";

export const links: LinksFunction = () => {
    return [{rel: 'stylesheet', href: loginPageStyleUrl}];
}

const LoginPage = () => {
    const ref = useRef();
    const {theme} = useContext(ThemeContext);
    let sideImageUrl = lightSideImageUrl;
    if (theme.layout.skin == 'dark') {
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
                                <HelpCircle size={18} className='position-absolute' style={{top: 10, right: 10}}/>
                            </OverlayTrigger>
                        </Alert>
                        <Form className="auth-login-form mt-2">
                            <Form.Group>
                                <Form.Label htmlFor={'login-email'}>用户名 / 邮箱</Form.Label>
                                <Form.Control name='login-email' placeholder={'abc@example.com'}/>
                            </Form.Group>
                            <Form.Group>
                                <div className="d-flex justify-content-between">
                                    <Form.Label htmlFor="login-password">密码</Form.Label>
                                    <NavLink href="forgot-password">
                                        <small>忘记密码?</small>
                                    </NavLink>
                                </div>
                                <InputGroup className="input-group-merge">
                                    <Form.Control name='login-password' type='password' className='form-control-merge'
                                                  placeholder={'abc123'}/>
                                    <InputGroup.Append>
                                        <InputGroup.Text>
                                            <Eye className='cursor-pointer' size={14}/>
                                        </InputGroup.Text>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Form.Group>
                            <Button block className='mt-4' variant={'primary'} type={'submit'}>登 录</Button>
                        </Form>
                    </Col>
                </Col>
            </Row>
        </div>
    );
}

export default LoginPage;