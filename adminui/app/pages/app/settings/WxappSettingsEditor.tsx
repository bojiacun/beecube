import {Button, Card} from "react-bootstrap";
import {Form, Formik} from "formik";
import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import _ from "lodash";
import querystring from "querystring";
import {DefaultListSearchParams, handleSaveResult} from "~/utils/utils";
import {API_USER_INFO, requestWithToken} from "~/utils/request.server";
import {useFetcher, useLoaderData} from "@remix-run/react";
import * as Yup from "yup";
import BootstrapInput from "~/components/form/BootstrapInput";
import FileBrowserInput from "~/components/filebrowser/form";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect} from "react";


const SettingsSchema = Yup.object().shape({
});
const WxappSettingsEditor = () => {
    const {settings} = useLoaderData();
    const postFetcher = useFetcher();

    useEffect(() => {
        if (postFetcher.type === 'done' && postFetcher.data) {
            handleSaveResult(postFetcher.data);
        }
    }, [postFetcher.state]);

    const handleOnSubmit = (values: any) => {
        postFetcher.submit({wxapp:values}, {method: 'post', action:'/app/settings/update'});
    }

    return (
        <Formik initialValues={settings.filter((st:any) => st.groupName === 'wxapp')} onSubmit={handleOnSubmit} validationSchema={SettingsSchema}>
            <Form method={'post'}>
                <Card>
                    <Card.Header>
                        <Card.Title>微信小程序</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <BootstrapInput label={'APPID'} name={'appid'} placeholder={'微信小程序Appid'} />
                        <BootstrapInput  label={'APPSECRET'} name={'appsecret'}  placeholder={'微信小程序secret'} />
                    </Card.Body>
                    <Card.Footer className={'text-right'}>
                        <Button disabled={postFetcher.state === 'submitting'} type={'submit'}><FontAwesomeIcon  icon={'save'} style={{marginRight: 5}} />保存</Button>
                    </Card.Footer>
                </Card>
            </Form>
        </Formik>
    );
}

export default WxappSettingsEditor;