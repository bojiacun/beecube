import {Alert, Button, Image} from "react-bootstrap";
import {compareVersion, handleResult} from "~/utils/utils";
import {useEffect, useState} from "react";
import {useFetcher} from "@remix-run/react";

export default function WxappUploadEntry(props: any) {
    const {authUrl, app, publish, newPublish} = props.data;
    const [currentPublish, setCurrentPublish] = useState<any>(publish);
    const [publishing, setPublishing] = useState<boolean>(false);
    const [uploading, setUploading] = useState<boolean>(false);
    const [releasing, setReleasing] = useState<boolean>(false);
    const submitFetcher = useFetcher();
    const publicFetcher = useFetcher();
    const releaseFetcher = useFetcher();

    useEffect(() => {
        if (submitFetcher.data && submitFetcher.type === 'done') {
            setUploading(false);
            handleResult(submitFetcher.data, '上传成功');
            setCurrentPublish(submitFetcher.data.result);
        }
    }, [submitFetcher.state]);

    useEffect(() => {
        if (publicFetcher.data && publicFetcher.type === 'done') {
            setPublishing(false);
            handleResult(publicFetcher.data, '提交审核成功');
        }
    }, [publicFetcher.state]);

    useEffect(() => {
        if (releaseFetcher.data && releaseFetcher.type === 'done') {
            setReleasing(false);
            handleResult(releaseFetcher.data, '发布成功！');
            setCurrentPublish(submitFetcher.data.result);
        }
    }, [releaseFetcher.state]);

    const submitPreview = () => {
        setUploading(true);
        submitFetcher.submit(newPublish, {method: 'post', action: '/app/wxopen/upload'})
    }
    const publicUpload = () => {
        setPublishing(true);
        publicFetcher.submit(currentPublish, {method: 'post', action: '/app/wxopen/public'});
    }
    const release = () => {
        setReleasing(true);
        releaseFetcher.submit(currentPublish, {method: 'post', action: '/app/wxopen/release'});
    }

    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: 400, flexDirection: 'column'}}>
            {app.authStatus == 'unauthorized' &&
                <>
                    <div><a href={authUrl} className={'btn btn-primary'}>点击开始授权</a></div>
                    <Alert show variant={'light'}>
                        点击以上链接，在新页面用微信扫一扫授权发布小程序
                    </Alert>
                </>
            }
            {app.authStatus == 'authorized' && !currentPublish &&
                <div>
                    <Button variant={'primary'} onClick={submitPreview} disabled={publishing}>{publishing ? '发布中，请稍后...':'提交代码并生成体验码'}</Button>
                </div>
            }
            {app.authStatus == 'authorized' && currentPublish &&
                <>
                    <div>
                        {currentPublish.status < 4 &&
                            <Image src={currentPublish.previewQrcode} style={{width: '100%'}} />
                        }
                        {currentPublish.status == 4 &&
                            <Image src={currentPublish.qrcode} style={{width: '100%'}} />
                        }
                    </div>
                    <div style={{marginBottom: 10}}>
                        当前版本为<span style={{fontWeight: 'bold'}}>{currentPublish.version}</span>，最新版本为<span style={{color: 'red', fontWeight: 'bold'}}>{newPublish.userVersion}</span>
                    </div>
                    <div style={{marginBottom: 10}}>
                        上传时间为 <span style={{fontWeight: 'bold'}}>{currentPublish.createTime}</span>
                    </div>
                    {currentPublish.status == 3 &&
                        <Alert variant={'danger'} style={{marginBottom: 10}}>审核未通过：{currentPublish.reason}</Alert>
                    }
                    <div>
                        {newPublish && compareVersion(currentPublish.version, newPublish.userVersion) < 0 && <Button variant={'primary'} style={{marginRight: 20}} onClick={submitPreview} disabled={uploading}>{uploading? '发布中，请稍后...':'重新发布'}</Button>}
                        {(currentPublish.status == 0 || currentPublish.status == 3) && <Button variant={'danger'} disabled={publishing} onClick={publicUpload}>{publishing ? '提交中...':'提交审核'}</Button>}
                        {(currentPublish.status == 2 ) && <Button variant={'success'} disabled={releasing} onClick={release}>{releasing ? '发布中...':'发布上线'}</Button>}
                        {(currentPublish.status == 1 ) && <Button variant={'light'} disabled={true}>审核中</Button>}
                    </div>
                </>
            }
        </div>
    );
}