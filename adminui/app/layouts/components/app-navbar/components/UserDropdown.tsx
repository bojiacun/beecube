import {Image, Dropdown, NavLink} from "react-bootstrap";
import classNames from "classnames";
import {User, Settings, LogOut} from 'react-feather';
import {useFetcher} from "@remix-run/react";

const UserDropdown = (props:any) => {
    const {userData} = props;
    const fetcher = useFetcher();

    const dropdownTitle = (
        <>
            <div className="d-sm-flex d-none user-nav">
                <p className="user-name font-weight-bolder mb-0">
                    {userData?.realName || userData?.username}
                </p>
                <span className="user-status">{userData?.post}</span>
            </div>
            {!userData?.username ? <User size={22} /> : <Image src={userData.avatar} roundedCircle={true} width={40} height={40} className={'badge-minimal'} />}
        </>
    );
    const logout = () => {
        fetcher.load('/logout');
    }
    return (
        //@ts-ignore
        <Dropdown as={'li'} style={{minWidth: 160}} className={classNames('dropdown-user d-flex justify-content-end')} variant={'link'}>
            <Dropdown.Toggle id={'dropdown-grouped'} as={NavLink} className={'d-flex align-items-center dropdown-user-link'}>
                {dropdownTitle}
            </Dropdown.Toggle>

            <Dropdown.Menu>
            <Dropdown.Item key={'user-profile'} className={'d-flex align-items-center'}>
                <User className={'mr-50'} size={16} />
                <span>个人资料</span>
            </Dropdown.Item>
            <Dropdown.Item key={'user-settings'} className={'d-flex align-items-center'}>
                <Settings className={'mr-50'} size={16} />
                <span>用户设置</span>
            </Dropdown.Item>
            <Dropdown.Item key={'logout'} onSelect={logout} className={'d-flex align-items-center'}>
                <LogOut className={'mr-50'} size={16} />
                <span>退出登录</span>
            </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default UserDropdown