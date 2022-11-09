import {json, LoaderFunction} from "@remix-run/node";
import {auth} from "~/utils/auth.server";

export const loader: LoaderFunction = async ({request}) => {
        return json(await auth.isAuthenticated(request, {failureRedirect: '/login'}));
}
const Test = () => {
    return (
        <>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
            <h1>Welcome to Remix!</h1>
        </>
    );
}

export default Test;