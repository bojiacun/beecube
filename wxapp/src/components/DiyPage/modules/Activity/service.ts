import request, {SERVICE_WINKT_SYSTEM_HEADER} from "../../../../utils/request";

export async function getPagedActivities (siteId: number = 0) {
    return request.get('wxapp/activities', SERVICE_WINKT_SYSTEM_HEADER, {"site_id": siteId}, false).then(res => {
        return res.data.data.content;
    });
}
