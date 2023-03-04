import axios from '~/utils/request.client';



export async function getPagedGoods(type: number, source: any, count:number) {
    return axios.get('/paimai/goods/diy/list', { params: {type: type, source: source, pageSize: count}});
}
export async function getPagedPerformance(type: number,source:any, count:number) {
    return axios.get('/paimai/performances/diy/list', { params: {type: type, source: source, pageSize: count}});
}
export async function getPagedAuction(count:number) {
    return axios.get('/paimai/auctions/diy/list', { params: {pageSize: count}});
}

export async function getShopClasses() {
    return axios.get('/paimai/goods/class/all');
}
