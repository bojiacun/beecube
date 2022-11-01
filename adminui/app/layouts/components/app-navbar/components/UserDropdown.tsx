import {NavDropdown, Image} from "react-bootstrap";
import {useState} from "react";
import classNames from "classnames";
import {User, Settings, LogOut} from 'react-feather';

const UserDropdown = (props:any) => {
    const {userData} = props;
    const [toggleClass, setToggleClass] = useState<string>('d-flex align-items-center dropdown-user-link');

    const handleOnToggle = (isOpen: boolean) => {
        if(isOpen) {
           setToggleClass('d-flex align-items-center dropdown-user-link');
        }
        else {
            setToggleClass('');
        }
    }
    const dropdownTitle = (
        <>
            <div className="d-sm-flex d-none user-nav">
                <p className="user-name font-weight-bolder mb-0">
                    {userData?.fullName || userData?.username}
                </p>
                <span className="user-status">{userData?.role}</span>
            </div>
            {!userData?.fullName ? <User size={22} /> : <Image roundedCircle={true} width={40} height={40} className={'badge-minimal'} />}
        </>
    );
    return (
        //@ts-ignore
        <NavDropdown as={'li'} id={'dropdown-grouped'} title={dropdownTitle} onToggle={handleOnToggle} className={classNames('dropdown-user', toggleClass)} variant={'link'}>
            <NavDropdown.Item key={'user-profile'} className={'d-flex align-items-center'}>
                <User className={'mr-50'} size={16} />
                <span>个人资料</span>
            </NavDropdown.Item>
            <NavDropdown.Item key={'user-settings'} className={'d-flex align-items-center'}>
                <Settings className={'mr-50'} size={16} />
                <span>用户设置</span>
            </NavDropdown.Item>
            <NavDropdown.Item key={'logout'} className={'d-flex align-items-center'}>
                <LogOut className={'mr-50'} size={16} />
                <span>退出登录</span>
            </NavDropdown.Item>
        </NavDropdown>
    );
}

export default UserDropdown