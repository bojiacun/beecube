import {Modal, FormGroup, FormLabel, Button, Col, Row} from "react-bootstrap";
import {Form, Formik} from "formik";
import {handleSaveResult} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import * as Yup from "yup";
import {useEffect, useRef, useState} from "react";
//@ts-ignore
import _ from 'lodash';
import FileBrowserInput from "~/components/filebrowser/form";
import BootstrapInput from "~/components/form/BootstrapInput";
import BootstrapRadioGroup from "~/components/form/BootstrapRadioGroup";
import BootstrapLinkSelector from "~/components/form/BootstrapLinkSelector";


const formSchema = Yup.object().shape({
    title: Yup.string().required('必填字段'),
    icon: Yup.string().required('必要字段'),
    iconActive: Yup.string().required('必要字段'),
    textColor: Yup.string().required('必要字段'),
    textColorActive: Yup.string().required('必要字段'),
    ordernum: Yup.number().required('必要字段'),
    url: Yup.string().required('必要字段'),
});


const AppMemberEdit = (props: any) => {
    const {model, onHide} = props;
    const [links, setLinks] = useState<any[]>([]);
    const postFetcher = useFetcher();
    const searchFetcher = useFetcher();
    const formikRef = useRef<any>();


    useEffect(()=>{
        searchFetcher.load("/app/links");
    }, []);

    useEffect(() => {
        if (searchFetcher.type === 'done' && searchFetcher.data) {
            setLinks(searchFetcher.data);
        }
    }, [searchFetcher.state]);

    const handleOnSubmit = (values: any) => {
        if (values.id) {
            postFetcher.submit(values, {method: 'post', action: '/app/navs/edit'});
        } else {
            postFetcher.submit(values, {method: 'post', action: '/app/navs/add'});
        }
    }

    useEffect(() => {
        if (postFetcher.type === 'done' && postFetcher.data) {
            formikRef.current!.setSubmitting(false);
            handleSaveResult(postFetcher.data);
            if (postFetcher.data.success) {
                onHide();
            }
        }
    }, [postFetcher.state]);


    if (!model) return <></>

    return (
        <>
            <Modal
                show={!!model}
                onHide={onHide}
                backdrop={'static'}
                aria-labelledby={'edit-modal'}
            >
                <Modal.Header closeButton>
                    <Modal.Title id={'edit-user-model'}>{model?.id ? '编辑' : '新建'}导航</Modal.Title>
                </Modal.Header>
                {model &&
                    <Formik innerRef={formikRef} initialValues={{status: 1,ordernum: 1, ...model}} validationSchema={formSchema} onSubmit={handleOnSubmit}>
                        {(formik)=>{
                            return (
                                <Form method={'post'}>
                                    <Modal.Body style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                                        <BootstrapInput label={'导航名称'} readOnly={model?.id} name={'title'}/>
                                        <BootstrapLinkSelector links={links} label={'链接地址'} name={'url'} />
                                        <FormGroup>
                                            <FormLabel htmlFor={'icon'}>图标</FormLabel>
                                            <FileBrowserInput name={'icon'} type={1} multi={false} />
                                        </FormGroup>
                                        <FormGroup>
                                            <FormLabel htmlFor={'iconActive'}>图标激活</FormLabel>
                                            <FileBrowserInput name={'iconActive'} type={1} multi={false} />
                                        </FormGroup>
                                        <BootstrapInput label={'文本颜色'} readOnly={model?.id} name={'textColor'}/>
                                        <BootstrapInput label={'激活文本颜色'} readOnly={model?.id} name={'textColorActive'}/>
                                        <BootstrapInput label={'排序'} readOnly={model?.id} name={'ordernum'} type={'number'} />
                                        <BootstrapRadioGroup  options={[{label: '正常', value: '1'},{label: '禁用', value: '0'}]} name={'status'} label={'状态'} />
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button
                                            variant={'primary'}
                                            disabled={formik.isSubmitting}
                                            type={'submit'}
                                        >
                                            保存
                                        </Button>
                                    </Modal.Footer>
                                </Form>
                            );
                        }}
                    </Formik>
                }
            </Modal>
        </>
    );
}

export default AppMemberEdit;