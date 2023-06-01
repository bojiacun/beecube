import {Button, Image} from "react-bootstrap";
import errorImageUrl from 'assets/images/pages/error.svg';
import {useFetcher} from "@remix-run/react";


const Error401Page = () => {
    const logoutFetcher = useFetcher();
    const handleRelogin = () => {
        //@ts-ignore
        logoutFetcher.submit({}, {action: window.ENV?.LOGOUT_URL || '/auth/logout', method: 'post'});
    }
    return (
        <div className={'misc-wrapper'}>
            <div className="misc-inner p-2 p-sm-5">
                <div className="w-100 text-center">
                    <h2 className="mb-1">登录超时或您的账号在其他地方登录，您已经下线</h2>
                    <p className="mb-2"> 点击以下按钮重新登录 </p>
                    <Button variant="primary" className="mb-2 btn-sm-block" onClick={handleRelogin}> 重新登录 </Button>
                    <Image fluid src={errorImageUrl} alt="页面发生错误" />
                </div>
            </div>
        </div>
    );
}

export default Error401Page;