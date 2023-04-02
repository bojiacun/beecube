import {Alert, Button, Image} from "react-bootstrap";
import {compareVersion, handleResult} from "~/utils/utils";
import {useEffect, useState} from "react";
import {useFetcher} from "@remix-run/react";

export default function WxappUploadEntry(props: any) {
    const {authUrl, app, publish, newPublish} = props.data;
    const [currentPublish, setCurrentPublish] = useState<any>(publish);
    const [publishing, setPublishing] = useState<boolean>(false);
    const submitFetcher = useFetcher();

    useEffect(() => {
        if (submitFetcher.data && submitFetcher.type === 'done') {
            setPublishing(false);
            handleResult(submitFetcher.data, '发布成功');
            setCurrentPublish(submitFetcher.data);
        }
    }, [submitFetcher.state]);

    const submitPreview = () => {
        setPublishing(true);
        submitFetcher.submit(newPublish, {method: 'post', action: '/app/wxopen/upload'})
    }

    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: 400, height: 400, flexDirection: 'column'}}>
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
                        {currentPublish.status < 2 &&
                            <Image src={currentPublish.previewQrcode} style={{width: '100%'}} />
                        }
                        {currentPublish.status == 2 &&
                            <Image src={currentPublish.qrcode} style={{width: '100%'}} />
                        }
                    </div>
                    <div>当前版本为{currentPublish.version}，最新版本为{newPublish.user_version}</div>
                    <div>
                        {compareVersion(currentPublish.version, newPublish.user_version) < 0 && <Button variant={'primary'} onClick={submitPreview} disabled={publishing}>{publishing ? '发布中，请稍后...':'重新发布'}</Button>}
                        <Button variant={'danger'}>提交审核</Button>
                    </div>
                </>
            }
        </div>
    );
}