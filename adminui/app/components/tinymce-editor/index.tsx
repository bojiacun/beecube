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
            // apiKey={"zly5n25yopvw9c92zi0ngu8to4j6jffsulwb8newm80l9qsa"}
            initialValue={formik.values[name]}
            onBlur={handleEditorChange}
            textareaName={name}
            init={{
                height: height,
                width: width,
                menubar: false,
                images_upload_url: UPLOAD_URL,
                images_upload_credentials: true,
                lineheight_formats: "1 1.2 1.5 1.8 2 2.5 3 3.5 4 4.5",
                images_upload_handler: (blobInfo, progress: any) => new Promise((resolve, reject)=> {
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
                        if (xhr.status === 403) {
                            reject({ message: 'HTTP Error: ' + xhr.status, remove: true });
                            return;
                        }

                        if (xhr.status < 200 || xhr.status >= 300) {
                            reject('HTTP Error: ' + xhr.status);
                            return;
                        }

                        const json = JSON.parse(xhr.responseText);

                        if (!json || typeof json.data != 'string') {
                            reject('Invalid JSON: ' + xhr.responseText);
                            return;
                        }

                        resolve(json.data);
                    };

                    xhr.onerror = function () {
                        reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
                    };

                    formData = new FormData();
                    formData.append('file', blobInfo.blob(), blobInfo.filename());
                    formData.append('name', blobInfo.filename());
                    formData.append('chunks', '1');
                    formData.append('chunk', '0');
                    formData.append('type', '1');

                    xhr.send(formData);
                }),
                plugins: 'advlist autolink lists link image charmap preview anchor help searchreplace visualblocks code insertdatetime media table wordcount',
                toolbar:
                    'undo redo | formatselect | bold italic | \
                    alignleft aligncenter alignright | image | \
                    bullist numlist outdent indent lineheight| help'
            }}
            {...rest}
        />
    );
}


export default TinymceEditor;
