import request, { SERVICE_WINKT_SYSTEM_HEADER } from "../../../../utils/request";



export async function getPagedSubscribeGoods (type: number, siteId:number = 0, classId: number = 0) {
    return request.get('wxapp/subscribe/goods', SERVICE_WINKT_SYSTEM_HEADER, {type: type, "site_id": siteId, "class_id":classId}, false).then(res => {
        return res.data.data.content;
    });
}

export async function getSubscribeGoodsByIds(ids: string) {
    return request.get('wxapp/subscribe/goods/batch', SERVICE_WINKT_SYSTEM_HEADER, {ids: ids}, false).then(res => {
        return res.data.data;
    });
}
export async function getSubscribeClasses() {
    return request.get('wxapp/subscribe/classes',  SERVICE_WINKT_SYSTEM_HEADER, null, false).then(res=>res.data);
}
