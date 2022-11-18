import {FC, useEffect, useState} from "react";
import plupload from "plupload";
import {ListGroup, Row, Col, Button, Form, ProgressBar} from "react-bootstrap";
import {CheckCircle, FileText, Speaker, Video} from "react-feather";
import {useHydrated} from "remix-utils";
import SinglePagination from "~/components/pagination/SinglePagination";
import {DefaultListSearchParams} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import querystring from "querystring";
import Upload from "rc-upload";

export const FILE_TYPE_IMAGE = 1
export const FILE_TYPE_AUDIO = 2
export const FILE_TYPE_VIDEO = 3
export const FILE_TYPE_OTHER = 4

function resolveUrl(path: string) {
    return '/' + path;
}


interface FileBrowserProps {
    onChange: (values: any[]) => void;
    type: number;
    uploadUrl: string;
    onDelete: (value: any) => void;
    multi: boolean;
}


const FileBrowser: FC<FileBrowserProps> = (props) => {
    const {onChange, type = FILE_TYPE_IMAGE, onDelete, uploadUrl, multi} = props;
    const [list, setList] = useState<any>();
    const [deleting, setDeleting] = useState<boolean>(false);
    const [searchState, setSearchState] = useState<any>({...DefaultListSearchParams, type: type});
    const [canDelete, setCanDelete] = useState(false);
    const [progress, setProgress] = useState({percent: 0});

    const searchFetcher = useFetcher();

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
        if (!multi) {
            //取消所有所选
            list.records.forEach((itm: any) => itm.checked = false);
        }
        item.checked = !item.checked;
        setList({...list});
        setCanDelete(list.records.filter((itm: any) => itm.checked === true).length > 0);
        typeof onChange === 'function' && onChange(list.records.filter((itm: any) => itm.checked === true));
    }
    const checkAll = (e:any) => {
        setCanDelete(e.target.checked);
        list.records.forEach((item:any)=>item.checked = e.target.checked);
        setList({...list});
        typeof onChange === 'function' && onChange(list.records.filter((itm:any) => itm.checked === true));
    }
    const loadData = () => {
        setCanDelete(false);
        searchFetcher.load('/system/oss/file/list?'+querystring.stringify(searchState));
    }
    const handlePageChanged = (e: any) => {
        searchState.pageNo = e.selected + 1;
        setSearchState({...searchState});
        loadData();
    }
    const doDelete = () => {
        if (typeof onDelete === 'function') {
            const itemsToDelete = list.records.filter((item:any) => item.checked === true);
            const requests = [];
            setDeleting(true);

            for (let item of itemsToDelete) {
                requests.push(onDelete(item));
            }
            Promise.all(requests).then(() => {
                loadData();
                setDeleting(false);
            });
        }
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
        // });
        // uploader.init();
        loadData();
    }, []);
    useEffect(()=>{
        if(searchFetcher.type === 'done' && searchFetcher.data) {
            setList(searchFetcher.data);
        }
    }, [searchFetcher.state]);
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
    if(!list) return <></>
    return (
        <div className={'filebrowser'}>
            <div className={'container'}>
                <Row className={'header'}>
                    <Col>
                        {progress.percent > 0 && <ProgressBar />}
                    </Col>
                    <Col style={{textAlign: 'right'}}>
                        <Button disabled={!canDelete || deleting} onClick={doDelete}>删除</Button>
                        <Upload action={'/system/oss/file/upload'} data={{type: type}}>
                            <Button type="primary" id="browseBtn">上传{filters.name}</Button>
                        </Upload>
                    </Col>
                </Row>
                <ListGroup>
                    {list?.records.map((item:any)=>{
                        return renderChildren(item);
                    })}
                </ListGroup>
                <Row className={'footer'}>
                    <Col sm={6} className={'d-flex align-items-center justify-content-center justify-content-sm-start'}>
                        <span
                            className="text-muted">共 {list?.total} 条记录 显示 {(list?.current - 1) * list?.size + 1} 至 {list?.current * list?.size > list?.total ? list?.total : list?.current * list?.size} 条</span>
                    </Col>
                    <Col sm={6} className={'d-flex align-items-center justify-content-center justify-content-sm-end'}>
                        <SinglePagination
                            forcePage={searchState.pageNo - 1}
                            className={'mb-0'}
                            pageCount={list?.pages}
                            onPageChange={handlePageChanged}
                        />
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
