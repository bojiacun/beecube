import {FormGroup, FormLabel, Modal} from "react-bootstrap";
import {Field, Form, Formik} from "formik";
import classNames from "classnames";
import {EditFormHelper} from "~/utils/utils";
import {AwesomeButton} from "react-awesome-button";
import {useFetcher} from "@remix-run/react";
import * as Yup from "yup";
import FormikSelect from "~/components/form/FormikSelect";

const userSchema = Yup.object().shape({
    username: Yup.string().required(),
    realname: Yup.string().required(),
    workNo: Yup.string().required(),
    phone: Yup.string().required(),
    email: Yup.string().required(),
});

const UserEdit = (props:any) => {
    const {model, setEditModel} = props;
    const editFetcher = useFetcher();

    const handleOnSubmit = (values:any) => {
        console.log(values);
    }
    return (
        <Modal
            show={!!model}
            onHide={() => setEditModel(null)}
            size={'lg'}
            backdrop={'static'}
            aria-labelledby={'edit-modal'}
        >
            <Modal.Header closeButton>
                <Modal.Title id={'edit-user-model'}>{model?.id ? '编辑':'新建'}用户</Modal.Title>
            </Modal.Header>
            {model &&
                <Formik initialValues={model} validationSchema={userSchema} onSubmit={handleOnSubmit}>
                    {({errors})=>{
                        return (
                           <Form>
                               <Modal.Body>
                                   {EditFormHelper.normalInput({
                                           label: '用户账号',
                                           fieldName: 'username',
                                           placeholder: '用户账号',
                                           className: !!errors.username ? 'is-invalid' : '',
                                           readOnly: model?.id
                                       }
                                   )}
                                   {EditFormHelper.normalInput({
                                           label: '用户姓名',
                                           fieldName: 'realname',
                                           placeholder: '用户姓名',
                                           className: !!errors.realname? 'is-invalid' : ''
                                       }
                                   )}
                                   {EditFormHelper.normalInput({
                                           label: '工号',
                                           fieldName: 'workNo',
                                           placeholder: '工号',
                                           className: !!errors.workNo? 'is-invalid' : ''
                                       }
                                   )}
                                   {EditFormHelper.normalInput({
                                           label: '手机号',
                                           fieldName: 'phone',
                                           placeholder: '手机号',
                                           className: !!errors.phone? 'is-invalid' : ''
                                       }
                                   )}
                                   {EditFormHelper.normalInput({
                                           label: '座机号',
                                           fieldName: 'telephone',
                                           placeholder: '座机号',
                                       }
                                   )}
                                   <FormGroup>
                                       <FormLabel htmlFor={'post'}>职务</FormLabel>
                                       <FormikSelect id={'post'} name={'post'} placeholder={'选择职务'} />
                                   </FormGroup>
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
                        );
                    }}
                </Formik>
            }
        </Modal>
    );
}

export default UserEdit;