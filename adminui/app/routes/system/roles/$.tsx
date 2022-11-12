import {ActionFunction} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";


export const action: ActionFunction = async ({request}) => {
    await requireAuthenticated(request);

}