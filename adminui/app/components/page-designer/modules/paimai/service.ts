import request from "@/utils/request";
import {WINKT_SYSTEM_HEADERS} from "@/utils/Constant";

export async function searchGoods(key: string) {
    return request('/shop/goods/search', { params: {searchKey: key}, headers: WINKT_SYSTEM_HEADERS});
}
export async function getGoodsByIds(ids: string) {
    return request('/shop/goods/batch', { params: {ids: ids}, headers: WINKT_SYSTEM_HEADERS});
}

export async function getPagedGoods(type: number, tag: string = '') {
    return request('/shop/goods', { params: {type: type, tag: tag}, headers: WINKT_SYSTEM_HEADERS});
}

export async function getShopClasses() {
    return request('/shop/classes', { headers: WINKT_SYSTEM_HEADERS});
}

export async function getCurrentShopSecKills() {
    return request('/shop/seckills/current', {headers: WINKT_SYSTEM_HEADERS});
}
