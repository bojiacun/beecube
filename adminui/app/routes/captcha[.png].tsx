import {LoaderFunction} from "@remix-run/node";
import {API_CAPTCHA} from "~/utils/request.server";


export const loader: LoaderFunction = async ({request}) => {
    const url = new URL(request.url);
    const _t = url.searchParams.get('_t');
    //获取图片数据
    const remoteCaptchaImageUrl = API_CAPTCHA + '/' + _t;
    const res = await fetch(remoteCaptchaImageUrl);
    const result = await res.json();

    return new Response(result.result, {
        headers: {
            "Content-Type": "image/png"
        }
    });
}