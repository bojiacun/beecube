import {Nav} from "react-bootstrap";
import Locale from "./components/Locale";
import DarkToggler from "~/layouts/components/app-navbar/components/DarkToggler";
import UserDropdown from "~/layouts/components/app-navbar/components/UserDropdown";


const AppNavbarVerticalLayout = () => {
    return (
        <div className='navbar-container d-flex content align-items-center'>
            <div className="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex">
                &nbsp;
            </div>
            <Nav as={'ul'} className='nav align-items-center ml-auto'>
                <Locale />
                <DarkToggler className={'d-none d-lg-block cursor-pointer'} />
                <UserDropdown />
            </Nav>
        </div>
    );
}

export default AppNavbarVerticalLayout;