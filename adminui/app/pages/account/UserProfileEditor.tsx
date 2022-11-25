import {Button, Card} from "react-bootstrap";
import {Form, Formik} from "formik";
import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import _ from "lodash";
import querystring from "querystring";
import {DefaultListSearchParams} from "~/utils/utils";
import {API_USER_INFO, requestWithToken} from "~/utils/request.server";
import {useLoaderData} from "@remix-run/react";
import * as Yup from "yup";
import BootstrapInput from "~/components/form/BootstrapInput";
import FileBrowserInput from "~/components/filebrowser/form";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const UserInfoSchema = Yup.object().shape({
    realname: Yup.string().required('必填字段'),
});
const UserProfileEditor = () => {
    const userInfo = useLoaderData();
    const handleOnSubmit = (values: any) => {
        console.log(values);
    }

    return (
        <Formik initialValues={userInfo} onSubmit={handleOnSubmit} validationSchema={UserInfoSchema}>
            <Form method={'post'}>
                <Card>
                    <Card.Header>
                        <Card.Title>用户资料</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <BootstrapInput  label={'用户姓名'} name={'realname'} />
                        <BootstrapInput  label={'Email'} name={'email'} disabled={true} />
                        <BootstrapInput  label={'手机号'} name={'mobile'} disabled={true} />
                        <FileBrowserInput name={'avatar'} type={1} />
                    </Card.Body>
                    <Card.Footer className={'text-right'}>
                        <Button type={'submit'}><FontAwesomeIcon  icon={'save'} style={{marginRight: 5}} />保存</Button>
                    </Card.Footer>
                </Card>
            </Form>
        </Formik>
    );
}

export default UserProfileEditor;