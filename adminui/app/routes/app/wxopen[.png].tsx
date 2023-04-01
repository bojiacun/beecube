import {LoaderFunction} from "@remix-run/node";
import {API_APP_WXOPEN_AUTHQRCODE, requestWithToken} from "~/utils/request.server";


export const loader: LoaderFunction = async ({request}) => {
    //获取图片数据
    const qrcodeUrl = API_APP_WXOPEN_AUTHQRCODE + '?_t='+Math.random();
    const res = await requestWithToken(request)(qrcodeUrl);
    console.log(res);
    const result = await res.arrayBuffer();
    return new Response(result, {
        headers: {
            'Content-Type': 'image/png',
        }
    });
}