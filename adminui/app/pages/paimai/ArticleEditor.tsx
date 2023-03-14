import {Modal, FormGroup, FormLabel, Button, Col, Row} from "react-bootstrap";
import {Form, Formik} from "formik";
import {emptyDropdownIndicator, emptyIndicatorSeparator, handleSaveResult, showToastError} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import * as Yup from "yup";
import {useEffect, useRef, useState} from "react";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import PositionListSelector from "~/pages/system/roles/PositionListSelector";
//@ts-ignore
import _ from 'lodash';
import DepartmentTreeSelector from "~/pages/system/roles/DepartmentTreeSelector";
import FileBrowserInput from "~/components/filebrowser/form";
import DateTimePicker from "~/components/date-time-picker/DateTimePicker";
import BootstrapInput from "~/components/form/BootstrapInput";
import BootstrapSelect from "~/components/form/BootstrapSelect";
import {API_DUPLICATE_CEHCK} from "~/utils/request.server";
import {usePromise} from "react-use";
import BootstrapRadioGroup from "~/components/form/BootstrapRadioGroup";
import BootstrapDateTime from "~/components/form/BootstrapDateTime";
import TinymceEditor from "~/components/tinymce-editor";
import UprangConfiger from "~/pages/paimai/UprangConfiger";
import DescListConfiger from "~/pages/paimai/DescListConfiger";
import {ArticleType} from "~/pages/paimai/ArtcileList";


const ArticleEditor = (props: any) => {
    const {model, onHide, type} = props;
    const [articleClassOptions, setArticleClassOptions] = useState<any[]>([]);
    const postFetcher = useFetcher();
    const articleClassFetcher = useFetcher();
    const formikRef = useRef<any>();
    let ArticleSchema;


    useEffect(() => {
        if (model) {
            articleClassFetcher.load('/paimai/articles/classes/all');
        }
    }, [model]);



    useEffect(() => {
        if (articleClassFetcher.type === 'done' && articleClassFetcher.data) {
            setArticleClassOptions(articleClassFetcher.data.map((item: any) => ({label: item.name, value: item.id})));
        }
    }, [articleClassFetcher.state]);

    if(type  == ArticleType.SERVICES) {
        ArticleSchema = Yup.object().shape({
            title: Yup.string().required('必填字段'),
        });
    }
    else {
        ArticleSchema = Yup.object().shape({
            classId: Yup.string().required('必填字段'),
        });
    }

    const handleOnSubmit = (values: any) => {
        values.type = type;
        if (values.id) {
            postFetcher.submit(values, {method: 'post', action: '/paimai/articles/edit'});
        } else {
            postFetcher.submit(values, {method: 'post', action: '/paimai/articles/add'});
        }
    }

    useEffect(() => {
        if (postFetcher.type === 'done' && postFetcher.data) {
            formikRef.current!.setSubmitting(false);
            handleSaveResult(postFetcher.data);
            if (postFetcher.data.success) {
                onHide(postFetcher.data.result);
            }
        }
    }, [postFetcher.state]);


    if (!model) return <></>

    const newModel = {status: 0, type: type, ...model};

    return (
        <>
            <Modal
                show={!!model}
                onHide={onHide}
                size={'lg'}
                backdrop={'static'}
                aria-labelledby={'edit-modal'}
            >
                <Modal.Header closeButton>
                    <Modal.Title id={'edit-user-model'}>{model?.id ? '编辑' : '新建'}文章</Modal.Title>
                </Modal.Header>
                <Formik innerRef={formikRef} initialValues={newModel} validationSchema={ArticleSchema}
                        onSubmit={handleOnSubmit}>
                    {(formik)=>{
                        return (
                            <Form method={'post'}>
                                <Modal.Body style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                                    {type != ArticleType.SERVICES &&
                                        <BootstrapSelect name={'classId'} label={'分类'} options={articleClassOptions}/>
                                    }
                                    <BootstrapInput label={'标题'} name={'title'}/>
                                    {type == ArticleType.TEXT_IMAGE &&
                                        <FormGroup>
                                            <FormLabel htmlFor={'preview'}>预览图片</FormLabel>
                                            <FileBrowserInput name={'preview'} type={1} multi={false}/>
                                        </FormGroup>
                                    }
                                    {type == ArticleType.VIDEO &&
                                        <FormGroup>
                                            <FormLabel htmlFor={'video'}>视频地址</FormLabel>
                                            <FileBrowserInput name={'video'} type={3} multi={false}/>
                                        </FormGroup>
                                    }
                                    <FormGroup>
                                        <FormLabel htmlFor={'description'}>文章简介</FormLabel>
                                        <TinymceEditor name={'description'}/>
                                    </FormGroup>
                                    {type != ArticleType.VIDEO &&
                                        <FormGroup>
                                            <FormLabel htmlFor={'content'}>文章正文</FormLabel>
                                            <TinymceEditor name={'content'}/>
                                        </FormGroup>
                                    }
                                    <BootstrapInput label={'阅读数'} name={'views'}/>
                                    <BootstrapRadioGroup options={[{label: '下架', value: '0'}, {label: '上架', value: '1'}]} name={'status'} label={'状态'}/>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button
                                        variant={'primary'}
                                        disabled={postFetcher.state === 'submitting'}
                                        type={'submit'}
                                    >
                                        保存
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        );
                    }}

                </Formik>
            </Modal>
        </>
    );
}

export default ArticleEditor;