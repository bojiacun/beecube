import {Nav} from "react-bootstrap";
import Locale from "./components/Locale";


const AppNavbarVerticalLayout = () => {


    return (
        <div className='navbar-container d-flex content align-items-center'>
            <div className="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex">
                &nbsp;
            </div>
            <Nav className='nav align-items-center ml-auto'>
                <Locale />
            </Nav>
        </div>
    );
}

export default AppNavbarVerticalLayout;