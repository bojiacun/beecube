import {Button, FormGroup, FormLabel, Modal} from "react-bootstrap";
import {Form, Formik} from "formik";
import {FetcherState, getFetcherState, handleSaveResult} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import * as Yup from "yup";
import {useEffect, useRef, useState} from "react";
//@ts-ignore
import _ from 'lodash';
import FileBrowserInput from "~/components/filebrowser/form";
import BootstrapInput from "~/components/form/BootstrapInput";
import BootstrapLinkSelector from "~/components/form/BootstrapLinkSelector";


const formSchema = Yup.object().shape({
    image: Yup.string().required('必要字段'),
    sortNum: Yup.number().required('必要字段'),
    url: Yup.string().required('必要字段'),
});


const GoodsSwiperEditor = (props: any) => {
    const {model, onHide} = props;
    const [links, setLinks] = useState<any[]>([]);
    const postFetcher = useFetcher();
    const searchFetcher = useFetcher();
    const formikRef = useRef<any>();


    useEffect(()=>{
        searchFetcher.load("/app/links");
    }, []);

    useEffect(() => {
        if (getFetcherState(searchFetcher) === FetcherState.DONE) {
            setLinks(searchFetcher.data);
        }
    }, [searchFetcher.state]);

    const handleOnSubmit = (values: any) => {
        if (values.id) {
            postFetcher.submit(values, {method: 'post', action: '/paimai/goods/swipers/edit'});
        } else {
            postFetcher.submit(values, {method: 'post', action: '/paimai/goods/swipers/add'});
        }
    }

    useEffect(() => {
        if (getFetcherState(postFetcher) === FetcherState.DONE) {
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
                    <Modal.Title id={'edit-user-model'}>{model?.id ? '编辑' : '新建'}轮播图</Modal.Title>
                </Modal.Header>
                {model &&
                    <Formik innerRef={formikRef} initialValues={{sortNum: 0, ...model}} validationSchema={formSchema} onSubmit={handleOnSubmit}>
                        {(formik)=>{
                            return (
                                <Form method={'post'}>
                                    <Modal.Body style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                                        <BootstrapLinkSelector links={links} label={'链接地址'} name={'url'} />
                                        <FormGroup className={'mb-1'}>
                                            <FormLabel htmlFor={'image'}>图片</FormLabel>
                                            <FileBrowserInput name={'image'} type={1} multi={false} />
                                        </FormGroup>
                                        <BootstrapInput label={'排序'} name={'sortNum'} type={'number'} />
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

export default GoodsSwiperEditor;