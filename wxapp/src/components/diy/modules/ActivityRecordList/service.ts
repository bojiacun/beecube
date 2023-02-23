import request, {SERVICE_WINKT_SYSTEM_HEADER} from "../../../../utils/request";

export async function getPagedActivityRecords (siteId: number = 0) {
    return request.get('wxapp/activity/records', SERVICE_WINKT_SYSTEM_HEADER, {"site_id": siteId}, false).then(res => {
        return res.data.data.content;
    });
}
