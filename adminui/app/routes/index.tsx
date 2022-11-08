import {LoaderFunction, redirect} from "@remix-run/node";

export const loader: LoaderFunction = async () => {
    return redirect('/test');
}

export default function Index() {
    return <></>
}
