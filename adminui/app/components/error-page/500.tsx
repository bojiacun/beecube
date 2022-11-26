import {Button, Image} from "react-bootstrap";
import errorImageUrl from 'assets/images/pages/error.svg';
import {useNavigate} from "@remix-run/react";


const Error500Page = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(0);
    }
    return (
        <div className={'misc-wrapper'}>
            <div className="misc-inner p-2 p-sm-5">
                <div className="w-100 text-center">
                    <h2 className="mb-1"> 发生错误 🕵🏻‍♀️😖 500 </h2>
                    <p className="mb-2">服务器内部发生错误</p>
                    <Button onClick={handleClick} variant="primary" className="mb-2 btn-sm-block"> 返回首页 </Button>
                    <Image fluid src={errorImageUrl} alt="页面发生错误" />
                </div>
            </div>
        </div>
    );
}

export default Error500Page;