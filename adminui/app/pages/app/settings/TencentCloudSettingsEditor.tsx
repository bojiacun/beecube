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

const TencentCloudSettingsEditor = (props:any) => {
    const {settings} = props;
    const postFetcher = useFetcher();

    useEffect(() => {
        if (postFetcher.type === 'done' && postFetcher.data) {
            handleSaveResult(postFetcher.data);
        }
    }, [postFetcher.state]);

    const handleOnSubmit = (values: any) => {
        postFetcher.submit(values, {method: 'post', action:'/app/tencent/config'});
    }

    return (
        <Formik initialValues={settings} onSubmit={handleOnSubmit} validationSchema={SettingsSchema}>
            <Form method={'post'}>
                <Card>
                    <Card.Header>
                        <Card.Title>腾讯云配置</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <BootstrapInput label={'推流协议'} name={'pushSchema'} placeholder={'腾讯云直播推流协议'} />
                        <BootstrapInput label={'推流地址'} name={'pushDomain'} placeholder={'腾讯云直播推流地址'} />
                        <BootstrapInput label={'应用名称'} name={'appName'} placeholder={'腾讯云推流拉流的应用名称'} />
                        <BootstrapInput label={'推流鉴权KEY'} name={'pushTxtSecret'} placeholder={'腾讯云推流鉴权KEY'} />
                        <BootstrapInput label={'拉流协议'} name={'playSchema'} placeholder={'腾讯云直播拉流协议'} />
                        <BootstrapInput label={'拉流地址'} name={'playDomain'} placeholder={'腾讯云直播拉流地址'} />
                        <BootstrapInput label={'拉流鉴权KEY'} name={'playTxtSecret'} placeholder={'腾讯云直播拉流鉴权KEY'} />
                    </Card.Body>
                    <Card.Footer className={'text-right'}>
                        <Button disabled={postFetcher.state === 'submitting'} type={'submit'}><FontAwesomeIcon  icon={'save'} style={{marginRight: 5}} />保存</Button>
                    </Card.Footer>
                </Card>
            </Form>
        </Formik>
    );
}

export default TencentCloudSettingsEditor;