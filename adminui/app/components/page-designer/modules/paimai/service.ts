import axios from '~/utils/request.client';


export async function getGoodsClasses() {
    return axios.get('/paimai/goods/classes/all', { params: {}});
}
export async function getPagedGoods(type: number, source: any, count:number, tag: string = '') {
    return axios.get('/paimai/goods/diy/list', { params: {type: type, source: source, tag: tag, pageSize: count}});
}
export async function getPagedPerformance(type: number,source:any, count:number) {
    return axios.get('/paimai/performances/diy/list', { params: {type: type, source: source, pageSize: count}});
}
export async function getPagedTagedPerformance(tag: string,source:any, count:number) {
    return axios.get('/paimai/performances/diy/list', { params: {tag: tag, source: source, pageSize: count}});
}
export async function getPagedTagedRooms(tag: string,source:any, count:number) {
    return axios.get('/paimai/live/rooms/diy/list', { params: {tag: tag, source: source, pageSize: count}});
}
export async function getPagedAuction(source:any, count:number) {
    return axios.get('/paimai/auctions/diy/list', { params: {source: source, pageSize: count}});
}
export async function getPagedArticle(type: number, classId = '', count:number) {
    return axios.get('/paimai/articles/diy/list', { params: {type: type, pageSize: count, classId: classId}});
}

export async function getShopClasses() {
    return axios.get('/paimai/goods/class/all');
}
