import {Alert, Image} from "react-bootstrap";

export default function WxappUploadEntry() {
    return (
        <>
            <Image src={'/app/wxopen.png'} />
            <Alert show variant={'light'}>
                <div className={'alert-body'}>
                    请扫码授权
                </div>
            </Alert>
        </>
    );
}