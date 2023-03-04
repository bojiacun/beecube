import axios from '~/utils/request.client';



export async function getPagedGoods(type: number, source: number) {
    return axios.get('/paimai/goods/diy/auction', { params: {type: type, source: source}});
}

export async function getShopClasses() {
    return axios.get('/paimai/goods/class/all');
}
