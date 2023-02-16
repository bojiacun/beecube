import {Button, FormControl, InputGroup, Modal} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {useFormikContext} from "formik";
import FileBrowser from "~/components/filebrowser";

export interface LinkItem {
    label: string;
    url: string;
    urlSuffix?: { label: string; value: string };
    suffixOptions?: any;
}

const BootstrapLinkSelector = (props: any) => {
    let {label, name, placeholder = '', className, ...rest} = props;
    const formik = useFormikContext<any>();
    const [value, setValue] = useState<string>(formik.values[name]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);


    useEffect(()=>{
        setValue(formik.values[name]);
    }, [formik.values[name]]);

    const doSelect = () => {
        setModalVisible(false);
    }
    const handleInputValueChanged = (e: any) => {
        // formik.handleChange(e);
        setValue(e.currentTarget.value);
        formik.setFieldValue(name, e.currentTarget.value);
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

                <Modal.Footer>
                    {renderFooter()}
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default BootstrapLinkSelector;