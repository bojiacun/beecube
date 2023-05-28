import {Button, Card, FormGroup, FormLabel} from "react-bootstrap";
import {Form, Formik} from "formik";
import {FetcherState, getFetcherState, handleSaveResult} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import * as Yup from "yup";
import BootstrapInput from "~/components/form/BootstrapInput";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useEffect} from "react";
import BootstrapSwitch from "~/components/form/BootstrapSwitch";
import TinymceEditor from "~/components/tinymce-editor";


const SettingsSchema = Yup.object().shape({
});


const MemberSettingsEditor = (props:any) => {
    const {settings} = props;
    const postFetcher = useFetcher();

    useEffect(() => {
        if (getFetcherState(postFetcher) === FetcherState.DONE) {
            handleSaveResult(postFetcher.data);
        }
    }, [postFetcher.state]);

    const handleOnSubmit = (values: any) => {
        postFetcher.submit(values, {method: 'post', action:'/app/settings/update?group=member'});
    }


    return (
        <Formik initialValues={settings} onSubmit={handleOnSubmit} validationSchema={SettingsSchema}>
            <Form method={'post'}>
                <Card>
                    <Card.Header>
                        <Card.Title>会员设置</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <BootstrapInput label={'新用户赠送积分'} name={'newMemberIntegral'} placeholder={'新用户赠送积分'} />
                        <BootstrapInput label={'分享积分'} name={'shareIntegral'} placeholder={'分享积分'} />
                        <BootstrapInput label={'实名认证送积分'} name={'authRealIntegral'} placeholder={'实名认证送积分'} />
                        <BootstrapInput label={'每日阅读送积分'} name={'readIntegral'} placeholder={'每日阅读送积分'} />
                        <BootstrapInput label={'每日首单送积分'} name={'buyIntegral'} placeholder={'每日首单送积分'} />
                        <BootstrapInput label={'每日充值送积分'} name={'rechargeIntegral'} placeholder={'每日首次充值赠送积分'} />
                        <BootstrapInput label={'单日分享最高积分'} name={'shareMaxIntegral'} placeholder={'单日分享最高积分'} />
                        <BootstrapInput label={'签到周期'} name={'signinCycle'} placeholder={'签到周期赠送的积分，例如100,200,300,400,500'} />
                        <BootstrapSwitch label={'消费送积分'} name={'consumeIntegral'} />
                        <BootstrapInput label={'提现金额'} name={'minWithdrawIntegral'} placeholder={'最小提现金额'} />
                        <BootstrapInput label={'提现比例'} name={'integralToMoney'} placeholder={'提现比例，例如100积分兑换1元设置为100:1'} />

                        <FormGroup className={'mb-1'}>
                            <FormLabel htmlFor={'integralRule'}>积分规则</FormLabel>
                            <TinymceEditor name={'integralRule'} />
                        </FormGroup>
                    </Card.Body>
                    <Card.Footer className={'text-right'}>
                        <Button disabled={postFetcher.state === 'submitting'} type={'submit'}>
                            <FontAwesomeIcon  icon={'save'} style={{marginRight: 5}} />保存
                        </Button>
                    </Card.Footer>
                </Card>
            </Form>
        </Formik>
    );
}

export default MemberSettingsEditor;