import {Button, Card, FormGroup, FormLabel} from "react-bootstrap";
import {Form, Formik} from "formik";
import {handleSaveResult} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import * as Yup from "yup";
import BootstrapInput from "~/components/form/BootstrapInput";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect} from "react";
import FileBrowserInput from "~/components/filebrowser/form";


const SettingsSchema = Yup.object().shape({
});
const WxOpenSettingsEditor = (props:any) => {
    const {settings} = props;
    const postFetcher = useFetcher();

    useEffect(() => {
        if (postFetcher.type === 'done' && postFetcher.data) {
            handleSaveResult(postFetcher.data);
        }
    }, [postFetcher.state]);

    const handleOnSubmit = (values: any) => {
        postFetcher.submit(values, {method: 'post', action:'/app/wxopen/config'});
    }

    return (
        <Formik initialValues={settings} onSubmit={handleOnSubmit} validationSchema={SettingsSchema}>
            <Form method={'post'}>
                <Card>
                    <Card.Header>
                        <Card.Title>微信开放平台配置</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <BootstrapInput label={'APPID'} name={'componentAppId'} placeholder={'开放平台中第三方平台Appid'} />
                        <BootstrapInput label={'AppSecret'} name={'componentAppSecret'} placeholder={'开放平台中第三方平台AppSecret'} />
                        <BootstrapInput label={'消息校验Token'} name={'componentToken'} placeholder={'消息校验Token'} />
                        <BootstrapInput label={'消息加解密Key'} name={'componentAesKey'} placeholder={'消息加解密Key'} />
                    </Card.Body>
                    <Card.Footer className={'text-right'}>
                        <Button disabled={postFetcher.state === 'submitting'} type={'submit'}><FontAwesomeIcon  icon={'save'} style={{marginRight: 5}} />保存</Button>
                    </Card.Footer>
                </Card>
            </Form>
        </Formik>
    );
}

export default WxOpenSettingsEditor;