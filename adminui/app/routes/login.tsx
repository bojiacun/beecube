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
import {useContext, useEffect, useRef, useState} from "react";
import ThemeContext from 'themeConfig';
import lightSideImageUrl from 'assets/images/pages/login-v2.svg';
import darkSideImageUrl from 'assets/images/pages/login-v2-dark.svg';
import {Eye, HelpCircle} from "react-feather";
import {API_CAPTCHA, API_LOGIN, BASE_URL, LOCAL_USER_KEY, LOGIN_SUCCESS_URL, postFormInit} from "~/utils/reqeust";
import axios from "axios";
import {useLoaderData, useNavigate} from "@remix-run/react";

const randomstring = require('randomstring');


type ActionData = {
    formError?: string;
    checkKey: any;
};

type LoaderData = {
    checkKey: any;
    captchaImageData: string;
};
const badRequest = (data: ActionData) => json(data, { status: 400 });



export const links: LinksFunction = () => {
    return [{rel: 'stylesheet', href: loginPageStyleUrl}];
}

export const action: ActionFunction = async ({request}) => {
    const form = await request.formData();
    let checkKey = form.get("checkKey");
    const data = {username: form.get("username"), password: form.get("password"), captcha: form.get("captcha"), checkKey: checkKey};
    const res = await fetch(API_LOGIN, postFormInit(JSON.stringify(data)));
    const result = await res.json();
    if(result.code !== 200) {
        return badRequest({formError: result.message, checkKey: checkKey});
    }
    return redirect(LOGIN_SUCCESS_URL);
}

export const loader: LoaderFunction = async () => {
    let randomString = randomstring.generate(12);
    const res = await fetch(API_CAPTCHA+'/'+randomString+'?_t='+randomString);
    let result = await res.json();
    return {captchaImageData: result.result, checkKey: randomString};
}

export function ErrorBoundary({error}: { error: Error }) {
    return (<p>There is a error happened.</p>);
}

const LoginPage = () => {
    const {theme} = useContext(ThemeContext);
    const loaderData = useLoaderData<LoaderData>();
    const [captchaData, setCaptchaData] = useState<string>(loaderData.captchaImageData);
    const [validated, setValidated] = useState<boolean>(false);
    const [formData, setFormData] = useState<any>({checkKey: loaderData.checkKey, username: '', password: '', captcha: ''});
    const [posting, setPosting] = useState<boolean>(false);
    const [errorData, setErrorData] = useState<string>();
    const navigate = useNavigate();


    let sideImageUrl = lightSideImageUrl;
    if (theme.layout.skin == 'dark') {
        sideImageUrl = darkSideImageUrl;
    }

    const handleCaptchaClick = () => {
        let randomStr = randomstring.generate(8);
        axios.get(API_CAPTCHA + '/' + loaderData.checkKey + '?_t=' + randomStr).then(res => {
            setCaptchaData(res.data.result);
        });
    }
    const handleOnSubmit = async (e:any) => {
        e.preventDefault();
        e.stopPropagation();
        setValidated(true);
        let form = e.currentTarget;
        if(form.checkValidity() === false) {
            return false;
        }
        setPosting(true);
        try{
            const res = await axios.post(API_LOGIN, formData);
            setPosting(false);
            if(res.data.success) {
                localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(res.data.result));
                navigate('/');
            }
            else {
                setErrorData(res.data.message);
            }
        }
        catch(e:any) {
            setErrorData('登录出错');
            setPosting(false);
        }
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
                                <HelpCircle size={18} className='position-absolute' style={{top: 10, right: 10}} />
                            </OverlayTrigger>
                        </Alert>
                        {errorData && <Alert variant='danger'>
                            <div className="alert-body font-small-2">
                                <p>
                                    <small className="mr-50">{errorData}</small>
                                </p>
                            </div>
                        </Alert>}
                        <Form noValidate className="auth-login-form mt-2" method='post' validated={validated} onSubmit={handleOnSubmit}>
                            <Form.Group>
                                <Form.Label htmlFor={'username'}>用户名</Form.Label>
                                <Form.Control name='username' placeholder={'邮箱或者手机号'} required value={formData.username} onChange={event => setFormData({...formData, username: event.target.value})}  />
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
                                                  placeholder={'abc123'} required value={formData.password} onChange={event => setFormData({...formData, password: event.target.value})}  />
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
                                    <Form.Control name='captcha' placeholder={'验证码'} required value={formData.captcha} onChange={event => setFormData({...formData, captcha: event.target.value})} />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>&nbsp;</Form.Label>
                                    <Image onClick={handleCaptchaClick} src={captchaData} className='cursor-pointer' alt='验证码' style={{display: 'block'}} />
                                </Form.Group>
                            </Form.Row>
                            <Button block className='mt-1' variant={'primary'} type={'submit'} disabled={posting}>{posting? '登录中...':'登 录'}</Button>
                        </Form>
                    </Col>
                </Col>
            </Row>
        </div>
    );
}

export default LoginPage;