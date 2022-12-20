import {LoaderFunction} from "@remix-run/node";
import {API_CAPTCHA} from "~/utils/request.server";
import {base64Decode, base64ToUint8array} from "~/utils/utils";


export const loader: LoaderFunction = async ({request}) => {
    const url = new URL(request.url);
    const _t = url.searchParams.get('_t');
    //获取图片数据
    const remoteCaptchaImageUrl = API_CAPTCHA + '/' + _t;
    const res = await fetch(remoteCaptchaImageUrl);
    const result = await res.json();
    const base64data = result.result.replace(/^data:image\/png;base64,|^data:image\/jpeg;base64,|^data:image\/jpg;base64,|^data:image\/bmp;base64,/, '');
    const imageData = base64ToUint8array(base64data);
    return new Response(imageData, {
        headers: {
            'Content-Type': 'image/png',
        }
    });
}