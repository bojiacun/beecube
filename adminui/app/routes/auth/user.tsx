import {LoaderFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";


export const loader: LoaderFunction = async ({request}) => {
    return await requireAuthenticated(request);
}