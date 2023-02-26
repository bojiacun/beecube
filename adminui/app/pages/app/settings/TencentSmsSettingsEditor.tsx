import {Button, Card} from "react-bootstrap";
import {Form, Formik} from "formik";
import { handleSaveResult} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import * as Yup from "yup";
import BootstrapInput from "~/components/form/BootstrapInput";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect} from "react";


const SettingsSchema = Yup.object().shape({
});


const WechatSettingsEditor = (props:any) => {
    const {settings} = props;
    const postFetcher = useFetcher();

    useEffect(() => {
        if (postFetcher.type === 'done' && postFetcher.data) {
            handleSaveResult(postFetcher.data);
        }
    }, [postFetcher.state]);

    const handleOnSubmit = (values: any) => {
        postFetcher.submit(values, {method: 'post', action:'/app/settings/update?group=tencent_sms'});
    }


    return (
        <Formik initialValues={settings} onSubmit={handleOnSubmit} validationSchema={SettingsSchema}>
            <Form method={'post'}>
                <Card>
                    <Card.Header>
                        <Card.Title>腾讯云短信设置</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <BootstrapInput label={'应用ID'} name={'appId'} />
                        <BootstrapInput  label={'秘钥ID'} name={'secretId'} />
                        <BootstrapInput  label={'秘钥KEY'} name={'secretKey'} />
                        <BootstrapInput  label={'模板ID'} name={'templateId'} />
                        <BootstrapInput  label={'短信签名'} name={'signName'} />
                    </Card.Body>
                    <Card.Footer className={'text-right'}>
                        <Button disabled={postFetcher.state === 'submitting'} type={'submit'}><FontAwesomeIcon  icon={'save'} style={{marginRight: 5}} />保存</Button>
                    </Card.Footer>
                </Card>
            </Form>
        </Formik>
    );
}

export default WechatSettingsEditor;