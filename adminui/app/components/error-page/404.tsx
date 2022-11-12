import {Button, Image} from "react-bootstrap";
import errorImageUrl from 'assets/images/pages/error.svg';
import {useNavigate} from "@remix-run/react";


const Error404Page = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(-1);
    }

    return (
        <div className={'misc-wrapper'}>
            <div className="misc-inner p-2 p-sm-5">
                <div className="w-100 text-center">
                    <h2 className="mb-1"> 找不到页面 🕵🏻‍♀️😖 404 </h2>
                    <p className="mb-2"> 找不到该网址 </p>
                    <Button onClick={handleClick} variant="primary" className="mb-2 btn-sm-block"> 返回上一页 </Button>
                    <Image fluid src={errorImageUrl} alt="页面发生错误" />
                </div>
            </div>
        </div>
    );
}

export default Error404Page;