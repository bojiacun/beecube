import {Button, Image} from "react-bootstrap";
import errorImageUrl from 'assets/images/pages/error.svg';
import {useFetcher} from "@remix-run/react";


const Error403Page = () => {
    const logoutFetcher = useFetcher();
    const handleRelogin = () => {
        //@ts-ignore
        logoutFetcher.load(window.ENV.LOGOUT_URL);
    }
    return (
        <div className={'misc-wrapper'}>
            <div className="misc-inner p-2 p-sm-5">
                <div className="w-100 text-center">
                    <h2 className="mb-1">拒绝访问🕵🏻‍♀️😖 403</h2>
                    <p className="mb-2">您已登录，但您无权进行此操作</p>
                    <Image fluid src={errorImageUrl} alt="页面发生错误" />
                </div>
            </div>
        </div>
    );
}

export default Error403Page;