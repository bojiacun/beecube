import {Image, Dropdown, NavLink} from "react-bootstrap";
import classNames from "classnames";
import {User, Settings, LogOut, ArrowLeft} from 'react-feather';
import {useFetcher, useLoaderData, useNavigate} from "@remix-run/react";
import {LoginedUser, UserInfo} from "~/utils/auth.server";
import {useEffect, useState} from "react";

const UserDropdown = () => {
    const [userData, setUserData] = useState<UserInfo>();
    const rootLoaderData = useLoaderData();
    const logoutFetcher = useFetcher();
    const userFetcher = useFetcher<LoginedUser>();
    const navigate = useNavigate();

    useEffect(() => {
        // @ts-ignore
        userFetcher.load(window.ENV.USER_INFO_URL);
    }, []);

    useEffect(() => {
        if (userFetcher.type === 'done') {
            setUserData(userFetcher.data.userInfo);
        }
    }, [userFetcher.type]);

    useEffect(() => {
        if (logoutFetcher.data) {
            let url = logoutFetcher.data;
            console.log(url);
            navigate(url, {replace: true});
        }
    }, [logoutFetcher.state]);


    const dropdownTitle = (
        <>
            <div className="d-sm-flex d-none user-nav">
                <p className="user-name font-weight-bolder mb-0">
                    {userData?.realname || userData?.username}
                </p>
                <span className="user-status">{userData?.post}</span>
            </div>
            {!userData?.username ? <User size={22}/> :
                <Image src={userData.avatar} roundedCircle={true} width={40} height={40} className={'badge-minimal'}/>}
        </>
    );
    const logout = () => {
        // @ts-ignore
        logoutFetcher.load(window.ENV.LOGOUT_URL);
    }
    const navigateToAccountSettings = () => {
        navigate('/account/settings');
    }
    const backToPlatform = () => {
        logoutFetcher.load('/back');
    }
    return (
        //@ts-ignore
        <Dropdown as={'li'} style={{minWidth: 160}} className={classNames('dropdown-user d-flex justify-content-end')} variant={'link'}>
            <Dropdown.Toggle id={'dropdown-grouped'} as={NavLink} className={'d-flex align-items-center dropdown-user-link'}>
                {dropdownTitle}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item key={'user-settings'} onSelect={navigateToAccountSettings} className={'d-flex align-items-center'}>
                    <Settings className={'mr-50'} size={16}/>
                    <span>用户设置</span>
                </Dropdown.Item>
                {rootLoaderData.from === 'platform' &&
                    <Dropdown.Item key={'user-back'} onSelect={backToPlatform} className={'d-flex align-items-center'}>
                        <ArrowLeft className={'mr-50'} size={16}/>
                        <span>返回平台</span>
                    </Dropdown.Item>
                }
                <Dropdown.Item key={'logout'} onSelect={logout} className={'d-flex align-items-center'}>
                    <LogOut className={'mr-50'} size={16}/>
                    <span>退出登录</span>
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default UserDropdown