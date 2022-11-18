import {FC, useEffect, useState} from "react";
import plupload from "plupload";

import {ListGroup, Row, Col, Button, Form, ProgressBar} from "react-bootstrap";
import {CheckCircle, FileText, Speaker, Video} from "react-feather";

export const FILE_TYPE_IMAGE = 1
export const FILE_TYPE_AUDIO = 2
export const FILE_TYPE_VIDEO = 3
export const FILE_TYPE_OTHER = 4

function resolveUrl(path: string) {
    return '/' + path;
}


interface FileBrowserProps {
    request: (page: number, type: number) => void;
    onChange: (values: any[]) => void;
    type: number;
    uploadUrl: string;
    onDelete: (value: any) => void;
    multi: boolean;
}

const FileBrowser: FC<FileBrowserProps> = (props) => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [page, setPage] = useState({totalElements: 0, size: 20, number: 1});
    const [canDelete, setCanDelete] = useState(false);
    const [progress, setProgress] = useState({percent: 0});
    const {request, onChange, type = FILE_TYPE_IMAGE, onDelete, uploadUrl, multi} = props;
    let filters: any;
    switch (type) {
        case FILE_TYPE_IMAGE:
            filters = {
                name: '图片',
                max_file_size: "20mb",
                mime_types: [
                    {
                        title: "图片文件",
                        extensions: "jpg,gif,png,jpeg,webp"
                    }
                ]
            };
            break;
        case FILE_TYPE_AUDIO:
            filters = {
                name: '音频',
                max_file_size: "500mb",
                mime_types: [
                    {
                        title: "Audio files",
                        extensions: "mp3"
                    }
                ]
            };
            break;
        case FILE_TYPE_VIDEO:
            filters = {
                name: '视频',
                max_file_size: "3000mb",
                mime_types: [
                    {
                        title: "Video files",
                        extensions: "mp4,wmv,rmvb,avi"
                    }
                ]
            };
            break;
        case FILE_TYPE_OTHER:
            filters = {
                name: '文件',
                max_file_size: "1000mb",
                mime_types: [
                    {
                        title: "files",
                        extensions: "*"
                    }
                ]
            };
            break;
        default:
            filters = {
                max_file_size: "0mb"
            }
            break;
    }

    const checkItem = (item: any) => {
        console.log('multi', multi);
        if (!multi) {
            //取消所有所选
            items.map((itm: any) => itm.checked = false);
        }
        item.checked = !item.checked;
        setItems([...items]);
        setCanDelete(items.filter((itm: any) => itm.checked === true).length > 0);
        typeof onChange === 'function' && onChange(items.filter((itm: any) => itm.checked === true));
    }
    const checkAll = (e:any) => {
        setCanDelete(e.target.checked);
        setItems(items.map(item => {
            item.checked = e.target.checked;
            return item
        }))
        typeof onChange === 'function' && onChange(items.filter(itm => itm.checked === true));
    }
    const loadData = (page = 1) => {
        setLoading(true);
        setCanDelete(false);
        // typeof request === 'function' && request(page, type).then(res => {
        //     setLoading(false);
        //     res.data.number++;
        //     setPage(res.data);
        //     setItems(res.data.content);
        // }).catch(e => setLoading(false));
    }
    const doDelete = () => {
        if (typeof onDelete === 'function') {
            const itemsToDelete = items.filter(item => item.checked === true);
            const requests = [];
            setDeleting(true);

            for (let item of itemsToDelete) {
                requests.push(onDelete(item));
            }

            Promise.all(requests).then(() => {
                loadData(page.number);
                setDeleting(false);
            });
        }
    }
    const pageSizeChanged = (newPage: number, pageSize: number) => {
        loadData(newPage);
    }
    useEffect(() => {
        // const uploader = new plupload.Uploader({
        //     runtimes: "html5,flash,silverlight,html4",
        //     browse_button: document.getElementById('browseBtn'),
        //     url: uploadUrl,
        //     flash_swf_url: '/static/Moxie.swf',
        //     silverlight_xap_url: '/static/Moxie.xap',
        //     chunk_size: '1m',
        //     multi_selection: true,
        //     multipart_params: {
        //         type: type
        //     },
        //     headers: {},
        //     filters,
        //     init: {
        //         PostInit: function () {
        //         },
        //
        //         FilesAdded: function (up: any, files: any) {
        //             up.start();
        //         },
        //
        //         UploadComplete: function (up: any, files: any) {
        //         },
        //
        //         FileUploaded: function (up: any, files: any) {
        //             loadData(page.number);
        //         },
        //
        //         UploadProgress: function (up: any, file: any) {
        //             setProgress(() => ({...file}));
        //         },
        //
        //         Error: function (up: any, err: any) {
        //             setProgress(() => ({...err.file}));
        //         }
        //     }
        // })
        // uploader.init();
        loadData();
    }, []);
    let renderChildren:any;
    switch (type) {
        case FILE_TYPE_IMAGE:
            renderChildren = (item: any) => (
                <ListGroup.Item className={'item'} style={{backgroundImage: 'url(' + resolveUrl(item.attachment) + ')'}}
                           onClick={() => checkItem(item)}>
                    {item.checked && <div className={'mask'}><CheckCircle size={16} className={'icon'}/></div>}
                    <div className={'name'}>{item.filename}</div>
                </ListGroup.Item>
            )
            break;
        case FILE_TYPE_AUDIO:
            renderChildren = (item: any) => (
                <ListGroup.Item className={'item'} onClick={() => checkItem(item)}>
                    <Speaker className={'audio'}/>
                    {item.checked && <div className={'mask'}><CheckCircle className={'icon'}/></div>}
                    <div className={'name'}>{item.filename}</div>
                </ListGroup.Item>
            )
            break;
        case FILE_TYPE_VIDEO:
            renderChildren = (item: any) => (
                <ListGroup.Item className={'item'} onClick={() => checkItem(item)}>
                    <Video className={'video'}/>
                    {item.checked && <div className={'mask'}><CheckCircle className={'icon'}/></div>}
                    <div className={'name'}>{item.filename}</div>
                </ListGroup.Item>
            )
            break;
        case FILE_TYPE_OTHER:
            renderChildren = (item: any) => (
                <ListGroup.Item className={'item'} onClick={() => checkItem(item)}>
                    <FileText className={'excel'}/>
                    {item.checked && <div className={'mask'}><CheckCircle className={'icon'}/></div>}
                    <div className={'name'}>{item.filename}</div>
                </ListGroup.Item>
            )
            break;
        default:
            renderChildren = <></>
            break;
    }
    return (
        <div className={'filebrowser'}>
            <div className={'container'}>
                <Row className={'header'}>
                    <Col>
                        {progress.percent > 0 && <ProgressBar />}
                    </Col>
                    <Col>
                        <Button disabled={!canDelete || deleting} onClick={doDelete}>删除</Button>
                        <Button type="primary" id="browseBtn">上传{filters.name}</Button>
                    </Col>
                </Row>
                <ListGroup>
                    {items.map((item:any)=>{
                        return renderChildren(item);
                    })}
                </ListGroup>
                <Row className={'footer'}>
                    <Col>
                        {multi && <Form.Check onChange={checkAll}>全选</Form.Check>}
                    </Col>
                    <Col style={{textAlign: 'right'}}>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

FileBrowser.defaultProps = {
    multi: false
}

export default FileBrowser
