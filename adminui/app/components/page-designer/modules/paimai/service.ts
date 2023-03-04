import axios from '~/utils/request.client';



export async function getPagedGoods(type: number, tag: string = '') {
    return axios.get('/paimai/goods/auction', { params: {type: type, tag: tag}});
}

export async function getShopClasses() {
    return axios.get('/paimai/goods/class/all');
}
