import {Form, Modal} from "react-bootstrap";
import {useFormik} from "formik";
import {EditFormHelper} from "~/utils/utils";
import {AwesomeButton} from "react-awesome-button";
import {useFetcher} from "@remix-run/react";
import * as Yup from "yup";

const userSchema = Yup.object().shape({
    username: Yup.string().required(),
    realname: Yup.string().required(),
    workNo: Yup.string().required(),
    phone: Yup.string().required(),
    email: Yup.string().required(),
});

const UserEdit = (props: any) => {
    const {model, setEditModel} = props;
    const editFetcher = useFetcher();
    const formik = useFormik({
        initialValues: model,
        validationSchema: userSchema,
        onSubmit: values => {
            console.log(values);
        }
    });


    return (
        <Modal
            show={!!model}
            onHide={() => setEditModel(null)}
            size={'lg'}
            backdrop={'static'}
            aria-labelledby={'edit-modal'}
        >
            <Modal.Header closeButton>
                <Modal.Title id={'edit-user-model'}>{model?.id ? '编辑' : '新建'}用户</Modal.Title>
            </Modal.Header>
            {model &&
                <Form method={'post'}>
                    <Modal.Body>
                        {EditFormHelper.normalInput({
                                label: '用户账号',
                                placeholder: '用户账号',
                                className: !!formik.errors.username ? 'is-invalid' : '',
                                readOnly: model?.id,
                                ...formik.getFieldProps('username')
                            }
                        )}
                        {EditFormHelper.normalInput({
                                label: '用户姓名',
                                ...formik.getFieldProps('realname'),
                                placeholder: '用户姓名',
                                className: !!formik.errors.realname ? 'is-invalid' : '',
                            }
                        )}
                        {EditFormHelper.normalInput({
                                label: '工号',
                                ...formik.getFieldProps('workNo'),
                                placeholder: '工号',
                                className: !!formik.errors.workNo ? 'is-invalid' : ''
                            }
                        )}
                        {EditFormHelper.normalInput({
                                label: '手机号',
                                ...formik.getFieldProps('phone'),
                                placeholder: '手机号',
                                className: !!formik.errors.phone ? 'is-invalid' : ''
                            }
                        )}
                        {EditFormHelper.normalInput({
                                label: '座机号',
                                ...formik.getFieldProps('telephone'),
                                placeholder: '座机号',
                            }
                        )}

                    </Modal.Body>
                    <Modal.Footer>
                        <AwesomeButton
                            key={'submit'}
                            type={'primary'}
                            containerProps={{type: 'submit'}}
                            disabled={editFetcher.state === 'submitting'}
                        >
                            保存
                        </AwesomeButton>
                    </Modal.Footer>
                </Form>
            }
        </Modal>
    );
}

export default UserEdit;