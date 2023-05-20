import {Button, Card} from "react-bootstrap";
import {Form, Formik} from "formik";
import {FetcherState, getFetcherState, handleSaveResult} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import * as Yup from "yup";
import BootstrapInput from "~/components/form/BootstrapInput";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect} from "react";
import BootstrapSwitch from "~/components/form/BootstrapSwitch";


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
                        <BootstrapInput label={'单日分享最高积分'} name={'shareMaxIntegral'} placeholder={'单日分享最高积分'} />
                        <BootstrapInput label={'每日登录送积分'} name={'loginDayIntegral'} placeholder={'每日登录送积分'} />
                        <BootstrapSwitch label={'消费送积分'} name={'consumeIntegral'} />
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