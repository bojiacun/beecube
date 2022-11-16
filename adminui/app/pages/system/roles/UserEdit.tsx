import {Modal, Form, FormControl, FormGroup, FormLabel, InputGroup, Button, Col, Row} from "react-bootstrap";
import {Field, useFormik} from "formik";
import {EditFormHelper} from "~/utils/utils";
import {AwesomeButton} from "react-awesome-button";
import {useFetcher} from "@remix-run/react";
import * as Yup from "yup";
import {useEffect, useRef, useState} from "react";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import PositionListSelector from "~/pages/system/roles/PositionListSelector";

const userSchema = Yup.object().shape({
    username: Yup.string().required(),
    realname: Yup.string().required(),
    workNo: Yup.string().required(),
    phone: Yup.string().required(),
    email: Yup.string().required(),
});

const UserEdit = (props: any) => {
    const {model, setEditModel} = props;
    const [positionListShow, setPositionListShow] = useState<boolean>(false);
    const [positionOptions, setPositionOptions] = useState<any[]>([]);
    const positionRef = useRef<any>();
    const editFetcher = useFetcher();
    const formik = useFormik({
        initialValues: {
            username: '',
            realname: '',
            workNo: '',
            phone: '',
            telephone: '',
            post: ''
        },
        validationSchema: userSchema,
        onSubmit: values => {
            console.log(values);
        }
    });


    useEffect(() => {
        if (model?.id) {
            formik.setValues(model);
        }
    }, [model]);

    const handleOnPositionSelect = (rows:any) => {
        let newOptions = rows.map((x:any)=>({label: x.name, value:x.id}));
        setPositionOptions(newOptions);
        positionRef.current!.setValue(newOptions);
    }
    const handleOnPositionSelectChanged = (currentValue:any) => {
        console.log(currentValue);
    }

    if(!model) return <></>


    return (
        <>
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
                    <Form method={'post'} onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
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
                            <FormGroup>
                                <FormLabel htmlFor={'post'}>职务</FormLabel>
                                <Row>
                                    <Col sm={10}>
                                        <ReactSelectThemed
                                            ref={positionRef}
                                            id={'post'}
                                            placeholder={'选择职务'}
                                            isClearable={true}
                                            isSearchable={false}
                                            isMulti={true}
                                            openMenuOnClick={true}
                                            options={positionOptions}
                                            onChange={formik.handleChange}
                                        />
                                    </Col>
                                    <Col sm={2}>
                                        <Button onClick={()=>setPositionListShow(true)}>选择</Button>
                                    </Col>
                                </Row>
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
                }
            </Modal>
            <PositionListSelector show={positionListShow} setPositionListShow={setPositionListShow} onSelect={handleOnPositionSelect} />
        </>
    );
}

export default UserEdit;