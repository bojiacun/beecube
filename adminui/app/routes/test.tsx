import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";
import {useLoaderData} from "@remix-run/react";

export const loader: LoaderFunction = async ({request}) => {
    const user = await requireAuthenticated(request);
    return json(user);
}
const Test = () => {
    const loaderData = useLoaderData();
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