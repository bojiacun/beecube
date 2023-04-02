import {Alert, Button, Image} from "react-bootstrap";
import {compareVersion} from "~/utils/utils";

export default function WxappUploadEntry(props: any) {
    const {authUrl, app, publish, newVersion} = props.data;

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
            {app.authStatus == 'authorized' && !publish &&
                <div>
                    <Button variant={'primary'}>发布代码</Button>
                </div>
            }
            {app.authStatus == 'authorized' && publish &&
                <>
                    <div>
                        {publish.status < 2 &&
                            <Image src={publish.previewQrcode} style={{width: '100%'}} />
                        }
                        {publish.status == 2 &&
                            <Image src={publish.qrcode} style={{width: '100%'}} />
                        }
                    </div>
                    <div>当前版本为{publish.version}，最新版本为{newVersion}</div>
                    <div>
                        {compareVersion(publish.version, newVersion) < 0 && <Button variant={'primary'}>重新发布</Button>}
                        <Button variant={'danger'}>提交审核</Button>
                    </div>
                </>
            }
        </div>
    );
}