import request, {SERVICE_WINKT_ORDER_HEADER} from "../../../../utils/request";



export async function getUserReadsStatistics() {
    return request.get('wxapp/subscribe/orders/reads', SERVICE_WINKT_ORDER_HEADER, null, true).then(res => {
        return res.data.data;
    });
}
export async function getUserReadRanksStatistics() {
    return request.get('wxapp/subscribe/orders/ranks', SERVICE_WINKT_ORDER_HEADER, null, true).then(res => {
        return res.data.data;
    });
}
