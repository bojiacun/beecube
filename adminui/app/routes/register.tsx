import {ActionFunction, LinksFunction} from "@remix-run/node";
import loginPageStyleUrl from "~/styles/page-auth.css";
import {Button, Card, Col, Form, InputGroup, NavLink, Row} from "react-bootstrap";
import SystemLogo from "~/components/logo";
import {Form as RemixForm, useFetcher, useNavigation} from "@remix-run/react";
import classNames from "classnames";
import {useState} from "react";
import {API_APP_SEND_SMS, API_PAIMAI_ARTICLE_EDIT, postFormInit, requestWithToken} from "~/utils/request.server";
import {formData2Json} from "~/utils/utils";

const randomstring = require('randomstring');
export const links: LinksFunction = () => {
    return [{rel: 'stylesheet', href: loginPageStyleUrl}];
}

export const action: ActionFunction = async ({request}) => {
    const formData = await request.formData();
    return await requestWithToken(request)(API_PAIMAI_ARTICLE_EDIT, postFormInit(formData2Json(formData)))
}
const RegisterPage = () => {
    const [captchaKey, setCaptchaKey] = useState<string>();
    const transition = useNavigation();
    const [validated, setValidated] = useState<boolean>(false);
    const [timeout, setTimeout] = useState<number>(60);
    const [mobile, setMobile] = useState<string>();
    const [timer, setTimer] = useState<any>();
    const sendSmsFetcher = useFetcher();

    const handleOnSubmit = async (e: any) => {
        let form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        }
        setValidated(true);
    }

    const handleSendSms = async () => {
        if(!mobile || mobile.length != 11) {
            alert('请输入有效的手机号码');
            return;
        }
        sendSmsFetcher.submit({mobile: mobile}, {action: '/sms', method: 'post'});
        clearInterval(timer);
        setTimeout(59);
        setTimer(setInterval(()=>{
            setTimeout(v=>{
                if(v <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return v-1;
            });
        }, 1000));
    }
    const handleMobileChange = (e:any) => {
        setMobile(e.target.value);
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
                            注册蜜蜂魔方
                        </Card.Title>
                        <Card.Text>
                            请如实填写您的个人信息，以便我们联系您发送体验账号
                        </Card.Text>
                        <RemixForm noValidate className={classNames("auth-login-form mt-2", validated ? 'was-validated' : '')} method='post' onSubmit={handleOnSubmit}>
                            <Form.Group className={'mb-1'}>
                                <Form.Label htmlFor={'realname'}>姓名</Form.Label>
                                <Form.Control name='realname' placeholder={'联系人姓名'} required/>
                            </Form.Group>
                            <Form.Group className={'mb-1'}>
                                <Form.Label htmlFor="mobile">手机号码</Form.Label>
                                <InputGroup className="input-group-merge">
                                    <Form.Control name='mobile' className='form-control-merge' onChange={handleMobileChange}
                                                  placeholder={'联系人11位手机号码'} required/>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group className={'mb-1'}>
                                <Form.Label htmlFor={'captcha'}>验证码</Form.Label>
                                <InputGroup>
                                    <Form.Control name='vcode' placeholder={'短信验证码'} required/>
                                    <Button onClick={handleSendSms} disabled={timeout < 60 && timeout > 0}>
                                        {timeout == 60 && '验证码'}
                                        {(timeout < 60 && timeout > 0) && timeout}
                                        {timeout == 0 && '重新发送'}
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group className={'mb-1'}>
                                <Form.Label htmlFor={'cropName'}>公司名称</Form.Label>
                                <Form.Control name='cropName' placeholder={'公司名称'} />
                            </Form.Group>
                            <Row>
                                <Col className={'d-grid'}>
                                    <Button className='mt-1' variant={'primary'} type={'submit'}
                                            disabled={transition.state === 'submitting'}>{transition.state === 'submitting' ? '注册中...' : '注 册'}</Button>
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