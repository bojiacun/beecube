import {LinksFunction} from "@remix-run/node";
import loginPageStyleUrl from 'app/styles/react/pages/page-auth.css';

export const links: LinksFunction = () => {
    return [{rel: 'stylesheet', href: loginPageStyleUrl}];
}

const LoginPage = () => {
    return (
        <div className={'auth-wrapper auth-v2'}>

        </div>
    );
}

export default LoginPage;