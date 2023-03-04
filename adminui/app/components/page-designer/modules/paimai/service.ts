import axios from '~/utils/request.client';



export async function getPagedGoods(type: number, source: any, count:number) {
    return axios.get('/paimai/goods/diy/auction', { params: {type: type, source: source, pageSize: count}});
}

export async function getShopClasses() {
    return axios.get('/paimai/goods/class/all');
}
