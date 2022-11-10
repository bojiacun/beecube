import {LoaderFunction, redirect} from "@remix-run/node";
import {LOGIN_SUCCESS_URL} from "~/utils/request.server";

export const loader: LoaderFunction = async () => {
    return redirect(LOGIN_SUCCESS_URL);
}

export default function Index() {
    return <></>
}
