import {Button, Card} from "react-bootstrap";
import {Form, Formik} from "formik";
import {useFetcher, useLoaderData} from "@remix-run/react";
import * as Yup from "yup";
import BootstrapInput from "~/components/form/BootstrapInput";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect} from "react";
import {handleSaveResult} from "~/utils/utils";

const UserInfoSchema = Yup.object().shape({
    oldpassword: Yup.string().required('必填字段'),
    password: Yup.string().required('必填字段'),
    confirmpassword: Yup.string().required('必填字段').test('password-match', '两次密码输入不一致', (value, context)=>{
        return context.parent.password === value;
    }),
});
const ModifyPassword = () => {
    const userInfo = useLoaderData();
    const postFetcher = useFetcher();


    useEffect(() => {
        if (postFetcher.type === 'done' && postFetcher.data) {
            handleSaveResult(postFetcher.data);
        }
    }, [postFetcher.state]);
    const handleOnSubmit = (values: any) => {
        console.log(values);
        postFetcher.submit({username: userInfo.username, ...values}, {method: 'put', action:'/system/users/password'});
    }

    return (
        <Formik initialValues={userInfo} onSubmit={handleOnSubmit} validationSchema={UserInfoSchema}>
            <Form method={'post'}>
                <Card>
                    <Card.Header>
                        <Card.Title>修改密码</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <BootstrapInput type={'password'} label={'旧密码'} name={'oldpassword'} />
                        <BootstrapInput type={'password'} label={'新密码'} name={'password'} />
                        <BootstrapInput type={'password'} label={'确认密码'} name={'confirmpassword'} />
                    </Card.Body>
                    <Card.Footer className={'text-right'}>
                        <Button disabled={postFetcher.state === 'submitting'} type={'submit'}><FontAwesomeIcon  icon={'save'} style={{marginRight: 5}} />保存</Button>
                    </Card.Footer>
                </Card>
            </Form>
        </Formik>
    );
}

export default ModifyPassword;