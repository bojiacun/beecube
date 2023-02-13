import request, { SERVICE_WINKT_SYSTEM_HEADER } from "../../../../utils/request";



export async function getPagedGoods (type: number, siteId: number = 0, classId: number = 0) {
    return request.get('wxapp/shop/goods', SERVICE_WINKT_SYSTEM_HEADER, {type: type, "site_id": siteId, "class_id": classId}, false).then(res => {
        return res.data.data.content;
    });
}

export async function getGoodsByIds(ids: string) {
    return request.get('wxapp/shop/goods/batch', SERVICE_WINKT_SYSTEM_HEADER, {ids: ids}, false).then(res => {
        return res.data.data;
    });
}
export async function getShopClasses() {
    return request.get('wxapp/shop/classes',  SERVICE_WINKT_SYSTEM_HEADER, null, false).then(res=>res.data);
}
