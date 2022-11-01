import {NavLink} from "react-bootstrap";
import {Heart} from 'react-feather'


const AppFooter = () => {
    return (
        <p className={'clearfix mb-0'}>
            <span className="float-md-left d-block d-md-inline-block mt-25">
                COPYRIGHT  © 2022 - {new Date().getFullYear()}
                <NavLink className={'ml-25'} href={'https://app.yyzxian.com'}>蜜蜂魔方.</NavLink>
                <span className="d-none d-sm-inline-block">, 设计开发 & 版权所有</span>
            </span>
            <span className={"float-md-right d-none d-md-block"}>
                蜜蜂魔方管理后台 <Heart size={21} className={'text-danger stroke-current'} />
            </span>
        </p>
    );
}

export default AppFooter;