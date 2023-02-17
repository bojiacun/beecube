import {Button, FormControl, InputGroup, Modal} from "react-bootstrap";
import React, {FC, useEffect, useState} from "react";
import {useFormikContext} from "formik";
import BootstrapSelect from "~/components/form/BootstrapSelect";
import BootstrapInput from "~/components/form/BootstrapInput";
import _ from 'lodash';
import querystring from "querystring";

export interface LinkItem {
    label: string;
    url: string;
    urlSuffix?: { label: string; value: string };
    suffixOptions?: any;
}

export interface BootstrapLinkSelectProps extends Partial<any>{
    links: LinkItem[];
    onChange?: Function;
    initValue?: any;
}

const BootstrapLinkSelector : FC<BootstrapLinkSelectProps> = (props: any) => {
    let {label, name='', placeholder = '', className, links, onChange, initValue, ...rest} = props;
    const formik = useFormikContext<any>();
    const [value, setValue] = useState<string>(name?formik.values[name]:initValue);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedLinkItem, setSelectedLinkItem] = useState<LinkItem>();


    useEffect(() => {
        if(name) {
            setValue(formik.values[name]);
        }
    }, [formik.values[name]]);

    const doSelect = () => {
        let newValue = formik.values['_url'];
        const _url_suffix = formik.values['_url_suffix'];
        const _url_suffix_option = formik.values['_url_suffix_option'];
        if(selectedLinkItem?.urlSuffix) {
            let params:any = {};
            params[selectedLinkItem.urlSuffix!.value] = _url_suffix ? _url_suffix : _url_suffix_option;
            newValue += '?' + querystring.stringify(params);
        }
        setValue(newValue);
        if(name) {
            formik.setFieldValue(name, newValue);
        }
        setModalVisible(false);
        onChange && onChange(newValue);
    }
    const handleInputValueChanged = (e: any) => {
        // formik.handleChange(e);
        setValue(e.currentTarget.value);
        if(name) {
            formik.setFieldValue(name, e.currentTarget.value);
        }
        onChange && onChange(e.currentTarget.value);
    }
    const renderFooter = () => {
        return (
            <>
                <Button variant={'secondary'} onClick={() => setModalVisible(false)}>取消</Button>
                <Button variant="primary" onClick={() => doSelect()}>
                    确定选择
                </Button>
            </>
        );
    };
    const handleUrlChanged = (v:any) => {
        let linkItem = _.find(links, {url: v});
        setSelectedLinkItem(linkItem);
        formik.setFieldValue('_url_suffix', '');
        formik.setFieldValue('_url_suffix_option', '');
    }
    const renderUrlSuffix = () => {
        if (selectedLinkItem?.urlSuffix) {
            if (typeof selectedLinkItem.suffixOptions === 'string') {
                return <BootstrapInput label={selectedLinkItem.urlSuffix.label} name={'_url_suffix'}
                                       placeholder={selectedLinkItem.suffixOptions}/>
            } else if (typeof selectedLinkItem.suffixOptions === 'object') {
                return <BootstrapSelect name={'_url_suffix_option'} label={selectedLinkItem.urlSuffix.label}
                                        options={selectedLinkItem.suffixOptions}/>
            }
        }
        return <></>
    }
    return (
        <>
            <InputGroup>
                <FormControl
                    name={name}
                    className={(!!formik.touched[name] && !!formik.errors[name]) ? 'is-invalid' : ''}
                    onChange={handleInputValueChanged}
                    value={value}
                    {...rest}
                />
                <InputGroup.Append>
                    <Button onClick={() => setModalVisible(true)}>选择链接</Button>
                </InputGroup.Append>
            </InputGroup>
            <Modal
                centered={true}
                size={'lg'}
                show={modalVisible}
                onHide={() => setModalVisible(false)}
            >
                <Modal.Header closeButton={true}>
                    <Modal.Title>
                        选择链接
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <>
                        <BootstrapSelect onSelectChanged={handleUrlChanged} name={'_url'} label={'选择链接'}
                                         options={links?.map((item: LinkItem) => ({label: item.label, value: item.url}))}/>
                        {renderUrlSuffix()}
                    </>
                </Modal.Body>
                <Modal.Footer>
                    {renderFooter()}
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default BootstrapLinkSelector;