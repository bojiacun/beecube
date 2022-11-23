import type { FC} from "react";
import React, {useEffect, useState} from "react";
import FileBrowser, { FILE_TYPE_AUDIO, FILE_TYPE_IMAGE, FILE_TYPE_OTHER, FILE_TYPE_VIDEO } from "./index";
import {Button, FormControl, Image, Row, Col, InputGroup, Modal} from "react-bootstrap";
import {DownloadCloud, X, XCircle} from "react-feather";
import FallbackImage from "~/components/fallback-image";
import {ClientOnly} from "remix-utils";
import {resolveUrl} from "~/utils/utils";
import {FormikProps, useFormikContext} from "formik";


interface FileBrowserInputProps {
    type: number;
    multi?: boolean;
    imagePreview?: boolean;
    previewWidth?: number;
    previewHeight?: number;
    name: string;
}




const FileBrowserInput: FC<FileBrowserInputProps> = React.forwardRef<any, FileBrowserInputProps>((props, ref) => {
    const { type, multi=false, imagePreview=false, previewHeight=80, previewWidth=80, name, ...rest } = props;
    const formik = useFormikContext<any>();
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
    const [value, setValue] = useState<string>(formik.values[name]);

    useEffect(()=>{
        setValue(formik.values[name]);
    }, [formik.values[name]]);


    let buttonText: string = '';
    switch (type) {
        case FILE_TYPE_IMAGE:
            buttonText = '选择图片';
            break;
        case FILE_TYPE_AUDIO:
            buttonText = '选择音频';
            break;
        case FILE_TYPE_VIDEO:
            buttonText = '选择视频';
            break;
        case FILE_TYPE_OTHER:
            buttonText = '选择文件';
            break;
    }
    const doSelect = () => {
        if (selectedFiles && selectedFiles.length > 0) {
            let newValue = selectedFiles.map(item => item.url).join(',');
            formik.handleChange({currentTarget: {name: name, value: newValue}});
            setValue(newValue);
        }
        setModalVisible(false);
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
    const handleFileChanged = (values: any[]) => {
        setSelectedFiles(values);
    }
    const handleInputValueChanged = (e:any) => {
        formik.handleChange(e);
        setValue(e.currentTarget.value);
    }
    const removeFile = (v:string) => {
        let values = value?.split(',');
        values = values?.filter(val => val != v);
        let newValue = values?.join(',');
        formik.handleChange({currentTarget: {name: name, value: newValue}});
        setValue(newValue);
    }
    return (
        <div className={'filebrowser'}>
            {!imagePreview &&
                <InputGroup>
                    <FormControl
                        ref={ref}
                        name={name}
                        className={(!!formik.touched[name]&&!!formik.errors[name]) ? 'is-invalid':''}
                        readOnly={multi}
                        onChange={handleInputValueChanged}
                        value={multi?'':value}
                        {...rest}
                    />
                    <InputGroup.Append>
                        <Button onClick={() => setModalVisible(true)}>浏览</Button>
                    </InputGroup.Append>
                </InputGroup>
            }
            {imagePreview && 
                <Row style={{marginTop: 0, minWidth: 60}}>
                    <Col sm={2} className={'previewItem'}>
                        <XCircle size={16} className={'close'} onClick={()=>removeFile(value!)} />
                        <FallbackImage src={resolveUrl(value!)} style={{width:previewWidth, height: previewHeight, cursor: 'pointer'}} onClick={()=>setModalVisible(true)} />
                    </Col>
                </Row>
            }
            {type === FILE_TYPE_IMAGE && !imagePreview && value && value.split(',').length > 0 &&
                <Row style={{marginTop: 10}}>
                    {
                        value.split(',').map(v => {
                            return (
                                <Col className={'previewItem'} key={v}>
                                    <X className={'close'} onClick={()=>removeFile(v)} />
                                    <Image width={160} src={resolveUrl(v)} className={'preview'} />
                                </Col>
                            );
                        })
                    }
                </Row>
            }
            {type === FILE_TYPE_VIDEO && value && value.split(',').length > 0 &&
                <Row style={{marginTop: 10}}>
                    {
                        value.split(',').map(v => {
                            return (
                                <Col className={'previewItem'} key={v}>
                                    <X className={'close'} onClick={()=>removeFile(v)} />
                                    <video src={resolveUrl(v)} controls={true} style={{width: 320}} className={'previeew'}> 您的浏览器不支持 video 标签。 </video>
                                </Col>
                            );
                        })
                    }
                </Row>
            }
            {type === FILE_TYPE_AUDIO && value && value.split(',').length > 0 &&
                <Row style={{marginTop: 10}}>
                    {
                        value.split(',').map(v => {
                            return (
                                <Col className={'previewItem'} key={v}>
                                    <X className={'close'} onClick={()=>removeFile(v)} />
                                    <audio src={resolveUrl(v)} controls={true} style={{width: 320}} className={'preview'}> 您的浏览器不支持 audio 标签。 </audio>
                                </Col>
                            );
                        })
                    }
                </Row>
            }
            {type === FILE_TYPE_OTHER && value && value.split(',').length > 0 &&
                <Row style={{marginTop: 10}}>
                    {
                        value.split(',').map(v => {
                            return (
                                <Col className={'previewItem'} key={v}>
                                    <X className={'close'} onClick={()=>removeFile(v)} />
                                    <div className={'preview'} style={{width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                        <a href={resolveUrl(v)} target="_blank"><DownloadCloud style={{fontSize: 80}} /></a>
                                    </div>
                                </Col>
                            );
                        })
                    }
                </Row>
            }
            <Modal
                centered={true}
                size={'lg'}
                show={modalVisible}
                dialogClassName={'filebrowser-modal'}
                onHide={() => setModalVisible(false)}
            >
                <Modal.Header closeButton={true}>
                    <Modal.Title>
                        {buttonText}
                    </Modal.Title>
                </Modal.Header>
                <FileBrowser
                    onChange={handleFileChanged}
                    type={type}
                    multi={multi}
                />
                <Modal.Footer>
                    {renderFooter()}
                </Modal.Footer>
            </Modal>
        </div>
    );

});

FileBrowserInput.defaultProps = {
    multi: false,
}

export default FileBrowserInput
