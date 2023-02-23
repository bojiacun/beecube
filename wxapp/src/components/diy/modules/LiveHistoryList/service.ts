import request, {SERVICE_WINKT_LIVE_HEADER} from "../../../../utils/request";


export async function searchLives (type: number) {
    return request.get('wxapp/lives/history', SERVICE_WINKT_LIVE_HEADER, {type: type}, false).then(res => {
        return res.data.data.content;
    });
}
