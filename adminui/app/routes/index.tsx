import {LoaderFunction, redirect} from "@remix-run/node";
import {requireAuthenticated} from "~/utils/auth.server";

export const loader: LoaderFunction = async ({request}) => {
    const userInfo = await requireAuthenticated(request, true);
    const perms = userInfo!.perms;

    //从用户的可用菜单中取出第一个菜单并重定向到该菜单地址
    const url = perms == null ? '/': perms[1].route;
    return redirect(url!);
}

export default function Index() {
    return <></>
}
