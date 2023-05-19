import {Heart} from 'react-feather'
import {Col, Row} from "react-bootstrap";


const AppFooter = () => {
    return (
        <div className={'d-flex justify-content-between'}>
            <div>
                COPYRIGHT  © 2022 - {new Date().getFullYear()}
                <a className={'ml-25'} href={'http://www.qukuailian888.com'} target={'_blank'}>蜜蜂魔方</a>
                <span className="d-none d-sm-inline-block">, 设计开发 & 版权所有</span>
            </div>
            <div>
                蜜蜂魔方管理后台 <Heart size={21} className={'text-danger stroke-current'} />
            </div>
        </div>
    );
}

export default AppFooter;