import {LoaderFunction} from "@remix-run/node";
import {API_CAPTCHA} from "~/utils/request.server";
import {base64to2} from "~/utils/utils";


export const loader: LoaderFunction = async ({request}) => {
    const url = new URL(request.url);
    const _t = url.searchParams.get('_t');
    //获取图片数据
    const remoteCaptchaImageUrl = API_CAPTCHA + '/' + _t;
    const res = await fetch(remoteCaptchaImageUrl);
    const result = await res.json();
    const imageData = base64to2(result.result);
    return new Response(imageData, {
        headers: {
            'Content-Type': 'image/png',
        }
    });
}