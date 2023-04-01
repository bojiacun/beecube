import {Alert, Button, Image} from "react-bootstrap";
import {useFetcher} from "@remix-run/react";
import {useEffect, useState} from "react";
import {handleSaveResult} from "~/utils/utils";

export default function WxappUploadEntry() {
    const urlFetcher = useFetcher();
    const [url, setUrl] = useState<string>();

    useEffect(() => {
        urlFetcher.load('/app/wxopen/url');
    }, []);

    useEffect(() => {
        if (urlFetcher.type === 'done' && urlFetcher.data) {
            setUrl(urlFetcher.data);
        }
    }, [urlFetcher.state]);

    return (
        <>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: 400, height: 400}}>
                {url && <a href={url} className={'btn btn-primary'} target={'_blank'}>点击开始授权</a>}
            </div>
            <Alert show variant={'light'}>
                点击以上链接，在新页面用微信扫一扫授权发布小程序
            </Alert>
        </>
    );
}