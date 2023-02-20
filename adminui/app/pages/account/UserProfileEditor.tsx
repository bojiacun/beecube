import {Button, Card, FormGroup, FormLabel} from "react-bootstrap";
import {Form, Formik} from "formik";
import {handleSaveResult} from "~/utils/utils";
import {useFetcher, useLoaderData} from "@remix-run/react";
import * as Yup from "yup";
import BootstrapInput from "~/components/form/BootstrapInput";
import FileBrowserInput from "~/components/filebrowser/form";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect} from "react";


const UserInfoSchema = Yup.object().shape({
    realname: Yup.string().required('必填字段'),
});
const UserProfileEditor = () => {
    const userInfo = useLoaderData();
    const postFetcher = useFetcher();

    useEffect(() => {
        if (postFetcher.type === 'done' && postFetcher.data) {
            handleSaveResult(postFetcher.data);
        }
    }, [postFetcher.state]);

    const handleOnSubmit = (values: any) => {
        postFetcher.submit({userInfo, ...values}, {method: 'put', action:'/system/users/profile'});
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
                        <BootstrapInput  label={'手机号'} name={'phone'} disabled={true} />
                        <FormGroup>
                            <FormLabel htmlFor={'avatar'}>用户头像</FormLabel>
                            <FileBrowserInput name={'avatar'} type={1} multi={false} />
                        </FormGroup>
                    </Card.Body>
                    <Card.Footer className={'text-right'}>
                        <Button disabled={postFetcher.state === 'submitting'} type={'submit'}><FontAwesomeIcon  icon={'save'} style={{marginRight: 5}} />保存</Button>
                    </Card.Footer>
                </Card>
            </Form>
        </Formik>
    );
}

export default UserProfileEditor;