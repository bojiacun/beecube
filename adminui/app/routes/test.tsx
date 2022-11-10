import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";

export const loader: LoaderFunction = async ({request}) => {
        return json(await requireAuthenticated(request));
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