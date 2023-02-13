import request, { SERVICE_WINKT_SYSTEM_HEADER } from "../../../../utils/request";



export async function getCurrentShopSecKills () {
    return request.get('wxapp/shop/kills', SERVICE_WINKT_SYSTEM_HEADER, null, false).then(res => {
        return res.data.data.content;
    });
}
