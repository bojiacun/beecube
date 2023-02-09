import React from 'react';
import {Editor} from '@tinymce/tinymce-react';
import {useFormikContext} from "formik";
import {useTranslation} from "react-i18next";


interface TinymceEditorProps {
    width?: string | number;
    height?: string | number;
    name: string;
}

const UPLOAD_URL = "/system/oss/file/upload";

const TinymceEditor: React.FC<TinymceEditorProps> = (props) => {
    const {width = '100%', height = 400, name, ...rest} = props;
    const formik = useFormikContext<any>();
    const handleEditorChange = (e: any) => {
        let html = e.target.getContent();
        formik.setFieldValue(name, html);
    }
    return (
        <Editor
            apiKey={"8x16kx5cbqpuv0ppcc9yamh9biaokrtmfa76tmlpn8ydxx6f"}
            initialValue={formik.values[name]}
            onBlur={handleEditorChange}
            textareaName={name}
            init={{
                height: height,
                width: width,
                menubar: false,
                images_upload_url: UPLOAD_URL,
                images_upload_credentials: true,
                images_upload_handler: (blobInfo, success, failure, progress: any) => {
                    let xhr: any, formData;

                    xhr = new XMLHttpRequest();
                    xhr.withCredentials = false;
                    xhr.open('POST', UPLOAD_URL);
                    xhr.setRequestHeader('Accept', 'application/json');
                    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

                    xhr.upload.onprogress = function (e: any) {
                        progress(e.loaded / e.total * 100);
                    };

                    xhr.onload = function () {
                        var json;

                        if (xhr.status === 403) {
                            failure('HTTP Error: ' + xhr.status, {remove: true});
                            return;
                        }

                        if (xhr.status < 200 || xhr.status >= 300) {
                            failure('HTTP Error: ' + xhr.status);
                            return;
                        }

                        json = JSON.parse(xhr.responseText);

                        success(json.data);
                    };

                    xhr.onerror = function () {
                        failure('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
                    };

                    formData = new FormData();
                    formData.append('file', blobInfo.blob(), blobInfo.filename());
                    formData.append('name', blobInfo.filename());
                    formData.append('chunks', '1');
                    formData.append('chunk', '0');
                    formData.append('type', '1');

                    xhr.send(formData);
                },
                plugins: [
                    'advlist autolink lists link image',
                    'charmap print preview anchor help',
                    'searchreplace visualblocks code',
                    'insertdatetime media table paste wordcount'
                ],
                toolbar:
                    'undo redo | formatselect | bold italic | \
            alignleft aligncenter alignright | image | \
            bullist numlist outdent indent | help'
            }}
            {...rest}
        />
    );
}


export default TinymceEditor;