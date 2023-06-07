import {Button, Col, FormGroup, FormLabel, Modal, Row} from "react-bootstrap";
import {Form, Formik} from "formik";
import {emptyDropdownIndicator, emptyIndicatorSeparator, FetcherState, getFetcherState, handleSaveResult} from "~/utils/utils";
import {useFetcher, useFetchers} from "@remix-run/react";
import * as Yup from "yup";
import {useEffect, useRef, useState} from "react";
//@ts-ignore
import _ from 'lodash';
import BootstrapInput from "~/components/form/BootstrapInput";
import BootstrapRadioGroup from "~/components/form/BootstrapRadioGroup";
import BootstrapTextarea from "~/components/form/BootstrapTextarea";
import BootstrapLinkSelector from "~/components/form/BootstrapLinkSelector";
import ReactSelectThemed from "~/components/react-select-themed/ReactSelectThemed";
import MemberSelector from "~/pages/app/MemberSelector";


const SmtEditor = (props: any) => {
    const {model, onHide} = props;
    const postFetcher = useFetcher();
    const formikRef = useRef<any>();
    const [links, setLinks] = useState<any[]>([]);
    const [ruleMemberOptions, setRuleMemberOptions] = useState<{ label: string, value: any }[]>([]);
    const [memberIds, setMemberIds] = useState<any[]>();
    const [memberSelectorShow, setMemberSelectorShow] = useState<boolean>(false);
    const [memberOptions, setMemberOptions] = useState<any[]>([]);
    const searchFetcher = useFetcher();
    const dictFetcher1 = useFetcher();


    useEffect(()=>{
        searchFetcher.load("/app/links");
        dictFetcher1.load('/system/dicts?dictCode=paimai_smt_rule_member');
    }, []);
    useEffect(() => {
        if (model) {
            if (model.id) {
                const newModel = model;
                const memberIds = newModel.ruleMemberIds?.split(',');
                const memberNames = newModel.ruleMemberIds_dictText?.split(',') || [];
                const memberIdsOptions: any[] = [];
                if(memberIds) {
                    memberIds.forEach((v: any, i: number) => {
                        memberIdsOptions.push({value: v, label: memberNames[i]??''});
                    });
                }
                setMemberIds(memberIdsOptions);
            }
        }
    }, [model]);
    useEffect(() => {
        if (getFetcherState(dictFetcher1) === FetcherState.DONE) {
            setRuleMemberOptions(dictFetcher1.data.map((item: any) => ({value: item.value, label: item.text})));
        }
    }, [dictFetcher1.state]);
    useEffect(() => {
        if (getFetcherState(searchFetcher) === FetcherState.DONE) {
            setLinks(searchFetcher.data);
        }
    }, [searchFetcher.state]);

    useEffect(() => {
        if (getFetcherState(postFetcher) === FetcherState.DONE) {
            formikRef.current!.setSubmitting(false);
            handleSaveResult(postFetcher.data);
            if (postFetcher.data.success) {
                onHide(postFetcher.data.result);
            }
        }
    }, [postFetcher.state]);


    const schema = Yup.object().shape({
        title: Yup.string().required('必填字段'),
        templateId: Yup.string().required('必填字段'),
        vars: Yup.string().required('必填字段'),
        url: Yup.string().required('必填字段'),
        ruleMember: Yup.number().integer().required('必填字段'),
    });

    const handleOnSubmit = (values: any) => {
        if (values.id) {
            postFetcher.submit(values, {method: 'post', action: '/paimai/smts/edit'});
        } else {
            postFetcher.submit(values, {method: 'post', action: '/paimai/smts/add'});
        }
    }
    const handleOnMemberSelect = (rows: any) => {
        let newOptions = rows.map((x: any) => ({label: x.nickname||x.realname||x.id, value: x.id, key: x.id}));
        setMemberOptions(_.uniqBy([...memberOptions, ...newOptions], 'key'));

        let data = {name: 'ruleMemberIds', value: newOptions.map((item: any) => item.value).join(',')};
        let e = {currentTarget: data};
        formikRef.current!.handleChange(e);
        setMemberIds(newOptions);
    }
    const handleOnMemberSelectChanged = (currentValue: any) => {
        let data = {name: 'ruleMemberIds', value: currentValue.map((item: any) => item.value).join(',')};
        let e = {currentTarget: data};
        formikRef.current!.handleChange(e);
        setMemberIds(currentValue);
    }

    if (!model) return <></>

    const newModel = {ruleMember: 2, ...model};

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
                    <Modal.Title id={'edit-user-model'}>{model?.id ? '编辑' : '新建'}短信模板</Modal.Title>
                </Modal.Header>
                <Formik innerRef={formikRef} initialValues={newModel} validationSchema={schema}
                        onSubmit={handleOnSubmit}>
                    {(formik)=>{
                        return (
                            <Form method={'post'}>
                                <Modal.Body style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                                    <BootstrapInput label={'模板标题'} name={'title'} />
                                    <BootstrapInput label={'短信模板ID'} name={'templateId'} />
                                    <BootstrapInput label={'变量替换'} name={'vars'} placeholder={'形式如{id};{xxx}，系统可用变量有:会员名称：{memberName}、链接地址：{url}'} />
                                    <BootstrapLinkSelector links={links} label={'链接地址'} name={'url'} />
                                    <BootstrapRadioGroup options={ruleMemberOptions} name={'ruleMember'} label={'适用人群'}/>
                                    {formik.values.ruleMember == 1 &&
                                        <FormGroup className={'mb-1'}>
                                            <FormLabel htmlFor={'ruleMemberIds'}>选择用户</FormLabel>
                                            <Row>
                                                <Col sm={10}>
                                                    <ReactSelectThemed
                                                        id={'ruleMemberIds'}
                                                        name={'ruleMemberIds'}
                                                        components={{DropdownIndicator: emptyDropdownIndicator, IndicatorSeparator: emptyIndicatorSeparator}}
                                                        placeholder={'选择会员'}
                                                        isClearable={true}
                                                        isSearchable={false}
                                                        isMulti={true}
                                                        openMenuOnClick={false}
                                                        options={memberOptions}
                                                        onChange={handleOnMemberSelectChanged}
                                                        value={memberIds}
                                                    />
                                                </Col>
                                                <Col sm={2}>
                                                    <Button onClick={() => setMemberSelectorShow(true)}>选择</Button>
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                    }
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
            <MemberSelector show={memberSelectorShow} onHide={()=>setMemberSelectorShow(false)} onSelect={handleOnMemberSelect} />
        </>
    );
}

export default SmtEditor;