import {Alert, Button, Image} from "react-bootstrap";

export default function WxappUploadEntry(props:any) {
    const {authUrl, app} = props.data;

    return (
        <>
            {app.authStatus == 'unauthorized' &&
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: 400, height: 400, flexDirection: 'column'}}>
                    <div><a href={authUrl} className={'btn btn-primary'}>点击开始授权</a></div>
                    <Alert show variant={'light'}>
                        点击以上链接，在新页面用微信扫一扫授权发布小程序
                    </Alert>
                </div>
            }
            {app.authStatus == 'authorized' &&
                <div>
                    这里是已经授权的内容
                </div>
            }
        </>
    );
}